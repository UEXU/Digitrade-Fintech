import { useEffect, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { translationStore } from './translationStore';

function subscribe(callback: () => void) {
  return translationStore.subscribe(callback);
}

function getSnapshot() {
  return translationStore.getVersion();
}

/**
 * Returns the translated version of a Chinese string for the current language.
 * - lang === 'zh' → returns input as-is
 * - lang === 'en' → returns cached translation if present, otherwise queues
 *   for batch Gemini translation and returns the original Chinese until ready.
 *
 * Handles plain strings only. For JSON arrays from Supabase, use
 * useTranslatedJSON which parses → translates leaves → re-serializes.
 */
export function useTranslatedText(text: string | undefined | null): string {
  const { i18n } = useTranslation();
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    translationStore.setLocale(i18n.language);
  }, [i18n.language]);

  if (!text) return text ?? '';
  if (i18n.language === 'zh') return text;

  const cached = translationStore.get(text);
  if (cached) return cached;

  translationStore.request(text);
  return text;
}

const TRANSLATABLE_KEYS = new Set([
  'title',
  'desc',
  'description',
  'more',
  'name',
  'label',
  'value',
  'placeholder',
  'heading',
  'subtitle',
  'badge',
  'content',
  'text',
  'stage',
]);

function isChinese(s: string) {
  return /[一-鿿]/.test(s);
}

function collectAndReplaceLeaves(
  node: any,
  collect: (s: string) => void,
  translateFn?: (s: string) => string,
): any {
  if (node == null) return node;
  if (typeof node === 'string') {
    if (isChinese(node)) {
      collect(node);
      if (translateFn) return translateFn(node);
    }
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((item) => collectAndReplaceLeaves(item, collect, translateFn));
  }
  if (typeof node === 'object') {
    const out: any = {};
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (typeof v === 'string' && TRANSLATABLE_KEYS.has(k) && isChinese(v)) {
        collect(v);
        out[k] = translateFn ? translateFn(v) : v;
      } else {
        out[k] = collectAndReplaceLeaves(v, collect, translateFn);
      }
    }
    return out;
  }
  return node;
}

/**
 * Translates Chinese leaf strings inside an arbitrary JSON-shaped value
 * (object / array / nested). Returns a new value with translated leaves.
 * Non-Chinese strings, numbers, and other primitives are left untouched.
 */
export function useTranslatedJSON<T>(data: T): T {
  const { i18n } = useTranslation();
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    translationStore.setLocale(i18n.language);
  }, [i18n.language]);

  if (data == null || i18n.language === 'zh') return data;

  collectAndReplaceLeaves(data, (s) => translationStore.request(s));
  return collectAndReplaceLeaves(data, () => {}, (s) => translationStore.get(s) ?? s);
}
