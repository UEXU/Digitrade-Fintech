import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabase';
import { cyrb53 } from './hash';

const FLUSH_DELAY_MS = 80;
const MAX_BATCH_SIZE = 40;
const MODEL = 'gemini-2.5-flash-lite';

type Status = 'pending' | 'resolved' | 'failed';

class TranslationStore {
  private cache = new Map<string, string>();
  private status = new Map<string, Status>();
  private pending = new Set<string>();
  private subscribers = new Set<() => void>();
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private locale = 'zh';
  private version = 0;
  private ai: GoogleGenAI | null = null;

  constructor() {
    const key =
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);
    if (key && key !== 'MY_GEMINI_API_KEY') {
      try {
        this.ai = new GoogleGenAI({ apiKey: key });
      } catch (e) {
        console.warn('Failed to init Gemini client', e);
      }
    }
  }

  setLocale(locale: string) {
    if (this.locale !== locale) {
      this.locale = locale;
      this.notify();
    }
  }

  getLocale() {
    return this.locale;
  }

  get(text: string): string | undefined {
    return this.cache.get(this.cacheKey(text));
  }

  request(text: string) {
    if (this.locale === 'zh' || !text) return;
    const key = this.cacheKey(text);
    if (this.cache.has(key) || this.status.get(key) === 'pending') return;
    this.status.set(key, 'pending');
    this.pending.add(text);
    this.scheduleFlush();
  }

  subscribe = (fn: () => void) => {
    this.subscribers.add(fn);
    return () => {
      this.subscribers.delete(fn);
    };
  };

  getLocaleSnapshot = () => this.locale;

  getVersion = () => this.version;

  private cacheKey(text: string) {
    return `${this.locale}:${text}`;
  }

  private notify() {
    this.version++;
    this.subscribers.forEach((fn) => fn());
  }

  private scheduleFlush() {
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => this.flush(), FLUSH_DELAY_MS);
  }

  private async flush() {
    this.flushTimer = null;
    if (this.pending.size === 0) return;
    if (this.locale === 'zh') {
      this.pending.clear();
      return;
    }

    const targetLocale = this.locale;
    const batch = Array.from(this.pending).slice(0, MAX_BATCH_SIZE);
    batch.forEach((t) => this.pending.delete(t));
    if (this.pending.size > 0) this.scheduleFlush();

    try {
      const hashes = batch.map((t) => cyrb53(t));
      const { data: cached } = await supabase
        .from('translations')
        .select('source_hash, source_text, translated_text')
        .in('source_hash', hashes)
        .eq('locale', targetLocale);

      const hashToTranslation = new Map<string, string>();
      cached?.forEach((row: any) => {
        if (row.source_text && row.translated_text) {
          hashToTranslation.set(row.source_hash, row.translated_text);
        }
      });

      const missing: string[] = [];
      batch.forEach((source) => {
        const hash = cyrb53(source);
        const hit = hashToTranslation.get(hash);
        if (hit) {
          this.cache.set(`${targetLocale}:${source}`, hit);
          this.status.set(`${targetLocale}:${source}`, 'resolved');
        } else {
          missing.push(source);
        }
      });

      if (missing.length > 0) {
        const translations = await this.callGemini(missing, targetLocale);
        const rows: any[] = [];
        translations.forEach((translated, idx) => {
          const source = missing[idx];
          if (!source || !translated) return;
          this.cache.set(`${targetLocale}:${source}`, translated);
          this.status.set(`${targetLocale}:${source}`, 'resolved');
          rows.push({
            source_hash: cyrb53(source),
            locale: targetLocale,
            source_text: source,
            translated_text: translated,
          });
        });
        if (rows.length > 0) {
          supabase.from('translations').upsert(rows, { onConflict: 'source_hash,locale' }).then(({ error }) => {
            if (error) console.warn('translation cache write failed', error);
          });
        }
      }
    } catch (err) {
      console.error('Translation batch failed', err);
      batch.forEach((t) => this.status.set(`${targetLocale}:${t}`, 'failed'));
    }

    this.notify();
  }

  private async callGemini(texts: string[], targetLocale: string): Promise<string[]> {
    if (!this.ai) {
      console.warn('Gemini client not initialized; returning source text');
      return texts;
    }

    const targetName = targetLocale === 'en' ? 'English' : targetLocale;
    const prompt = `You are a professional translator for a Sino-Australia B2B consulting firm marketing site. Translate the following Chinese texts to ${targetName}.

Rules:
- Preserve newline characters (\\n) and any markdown formatting exactly.
- Keep ALL phrases inside quotation marks "" but render the quotes as standard ASCII quotes.
- Tone: confident, professional, consulting-grade. Avoid overly literal translation.
- Translate proper nouns like 数贸融 as "Digitrade".
- Return ONLY a JSON array of strings in the same order as input, with no commentary, no markdown fences.

Input (JSON array of source strings):
${JSON.stringify(texts)}`;

    const response: any = await this.ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text: string = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('Gemini returned malformed response');
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed) || parsed.length !== texts.length) {
      throw new Error('Gemini response length mismatch');
    }
    return parsed.map((s) => String(s));
  }
}

export const translationStore = new TranslationStore();
