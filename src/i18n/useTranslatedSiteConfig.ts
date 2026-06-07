import { useEffect, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { translationStore } from './translationStore';
import { safeJsonParse } from '../lib/utils';

const JSON_VALUED_KEYS = new Set([
  'pain_points',
  'industries',
  'contact_items',
  'contact_form_fields',
  'about_features',
  'service_steps',
  'navbar_links',
]);

const isChinese = (s: string) => /[一-鿿]/.test(s);

function translateString(text: string): string {
  if (!text || !isChinese(text)) return text;
  const cached = translationStore.get(text);
  if (cached) return cached;
  translationStore.request(text);
  return text;
}

function deepTranslate(node: any): any {
  if (node == null) return node;
  if (typeof node === 'string') return translateString(node);
  if (Array.isArray(node)) return node.map(deepTranslate);
  if (typeof node === 'object') {
    const out: any = {};
    for (const k of Object.keys(node)) out[k] = deepTranslate(node[k]);
    return out;
  }
  return node;
}

function useLocaleStore() {
  const { i18n } = useTranslation();
  useSyncExternalStore(translationStore.subscribe, translationStore.getVersion, translationStore.getVersion);
  useEffect(() => {
    translationStore.setLocale(i18n.language);
  }, [i18n.language]);
  return i18n.language;
}

export function useTranslatedSiteConfig<T extends Record<string, any>>(siteConfig: T): T {
  const language = useLocaleStore();
  if (!siteConfig || language === 'zh') return siteConfig;

  const out: any = {};
  for (const [key, value] of Object.entries(siteConfig)) {
    if (typeof value === 'string' && JSON_VALUED_KEYS.has(key)) {
      const parsed = safeJsonParse(value, null);
      if (parsed != null) {
        out[key] = JSON.stringify(deepTranslate(parsed));
        continue;
      }
    }
    if (typeof value === 'string') {
      out[key] = translateString(value);
      continue;
    }
    out[key] = value;
  }
  return out as T;
}

export function useTranslatedProducts<T extends Record<string, any>>(products: T[]): T[] {
  const language = useLocaleStore();
  if (!Array.isArray(products) || language === 'zh') return products;

  return products.map((p) => ({
    ...p,
    title: typeof p.title === 'string' ? translateString(p.title) : p.title,
    description: typeof p.description === 'string' ? translateString(p.description) : p.description,
    stage: typeof p.stage === 'string' ? translateString(p.stage) : p.stage,
    features: Array.isArray(p.features)
      ? p.features.map((f: any) => (typeof f === 'string' ? translateString(f) : f))
      : p.features,
  })) as T[];
}
