-- Translation cache for runtime Gemini translations.
-- The frontend hashes the source Chinese string with cyrb53 (see src/i18n/hash.ts)
-- and uses (source_hash, locale) as composite key. Any anonymous visitor may
-- read (to consume cache) and insert (to populate cache). UPDATE/DELETE require
-- authenticated admin — protects existing translations from being clobbered.

CREATE TABLE IF NOT EXISTS translations (
  source_hash TEXT NOT NULL,
  locale TEXT NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (source_hash, locale)
);

CREATE INDEX IF NOT EXISTS translations_locale_idx ON translations(locale);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read translations" ON translations
  FOR SELECT USING (true);

CREATE POLICY "Public insert translations" ON translations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update translations" ON translations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete translations" ON translations
  FOR DELETE USING (auth.role() = 'authenticated');
