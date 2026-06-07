# Scripts

## `warmup_translations.py`

Batch-translate new Chinese CMS content to English and write to the
Supabase `translations` cache, so visitors who toggle EN don't pay the
first-hit Gemini latency.

### When to run

- After admin adds or edits Chinese content in the admin dashboard
- As a periodic cron (e.g. nightly) if content changes often
- Once after deploying the bilingual feature (no-op if browser-side
  translations have already populated the cache)

### Setup (one-time)

```bash
python3 -m venv scripts/venv
scripts/venv/bin/pip install supabase python-dotenv google-genai
```

Requires `.env` at the repo root with:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
```

### Usage

```bash
# Preview what would be translated, no writes:
scripts/venv/bin/python scripts/warmup_translations.py --dry-run

# Actually translate and write:
scripts/venv/bin/python scripts/warmup_translations.py
```

### What it does

1. Reads all rows from `site_config` and `products`.
2. Walks JSON-encoded fields (`pain_points`, `industries`, etc.) and
   extracts Chinese leaf strings under translatable keys (`title`,
   `desc`, `description`, …) — matches the frontend's
   `TRANSLATABLE_KEYS` filter in `src/i18n/useTranslatedText.ts`.
3. Computes `cyrb53(text)` for each (matches `src/i18n/hash.ts`).
4. Skips any string whose hash is already in `translations`.
5. Batches the remainder to `gemini-2.5-flash-lite` (30 per call).
6. Inserts results into `translations` with `locale='en'`.

### Notes

- Hash and key-filter logic mirror the frontend exactly. If you change
  either side, update the other or the cache will silently miss.
- The script only INSERTs. RLS on `translations` allows anonymous
  insert but not update, so existing rows are skipped (filtered above)
  rather than upserted.
- Costs roughly $0.0001 per 100 strings on `gemini-2.5-flash-lite`.
