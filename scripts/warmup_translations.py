"""
Translation cache warmup for digitrade-fintech.

Reads Chinese strings from Supabase site_config + products, translates each
to English via Gemini (matching the production runtime), and inserts into
the translations cache so users don't pay the first-hit latency.

Mirrors the frontend's i18n/hash.ts (cyrb53) and i18n/useTranslatedSiteConfig.ts
(JSON_VALUED_KEYS + TRANSLATABLE_LEAF_KEYS) so cache keys line up.

Usage:
    python warmup_translations.py [--dry-run]
"""
import json
import os
import sys
import time
from typing import Iterable

from dotenv import load_dotenv
from google import genai
from supabase import create_client

load_dotenv()

SUPABASE_URL = (
    os.environ["VITE_SUPABASE_URL"].rstrip("/").removesuffix("/rest/v1")
)
SUPABASE_KEY = os.environ["VITE_SUPABASE_ANON_KEY"]
GEMINI_KEY = os.environ.get("GEMINI_API_KEY") or os.environ["VITE_GEMINI_API_KEY"]

JSON_VALUED_CONFIG_KEYS = {
    "pain_points",
    "industries",
    "contact_items",
    "contact_form_fields",
    "about_features",
    "service_steps",
    "navbar_links",
}

# Mirrors TRANSLATABLE_KEYS in src/i18n/useTranslatedText.ts so we only
# pre-warm leaves the frontend will actually request.
TRANSLATABLE_LEAF_KEYS = {
    "title", "desc", "description", "more", "name", "label", "value",
    "placeholder", "heading", "subtitle", "badge", "content", "text", "stage",
}

TARGET_LOCALE = "en"
BATCH_SIZE = 30
MODEL = "gemini-2.5-flash-lite"


def cyrb53(s: str, seed: int = 0) -> str:
    """Port of src/i18n/hash.ts. Result must match the frontend exactly."""
    h1 = (0xDEADBEEF ^ seed) & 0xFFFFFFFF
    h2 = (0x41C6CE57 ^ seed) & 0xFFFFFFFF
    for ch in s:
        code = ord(ch)
        h1 = ((h1 ^ code) * 2654435761) & 0xFFFFFFFF
        h2 = ((h2 ^ code) * 1597334677) & 0xFFFFFFFF
    h1 = ((h1 ^ (h1 >> 16)) * 2246822507) & 0xFFFFFFFF
    h1 = (h1 ^ ((h2 ^ (h2 >> 13)) * 3266489909)) & 0xFFFFFFFF
    h2 = ((h2 ^ (h2 >> 16)) * 2246822507) & 0xFFFFFFFF
    h2 = (h2 ^ ((h1 ^ (h1 >> 13)) * 3266489909)) & 0xFFFFFFFF
    n = 4294967296 * (h2 & 0x1FFFFF) + (h1 & 0xFFFFFFFF)
    if n == 0:
        return "0"
    digits = "0123456789abcdefghijklmnopqrstuvwxyz"
    out = []
    while n:
        n, r = divmod(n, 36)
        out.append(digits[r])
    return "".join(reversed(out))


def is_chinese(s: str) -> bool:
    return any("一" <= c <= "鿿" for c in s)


def collect_from_json(data, restrict_keys: bool) -> Iterable[str]:
    """Walk a parsed JSON value, yield Chinese leaf strings under translatable keys."""
    if isinstance(data, str):
        if is_chinese(data):
            yield data
    elif isinstance(data, list):
        for item in data:
            yield from collect_from_json(item, restrict_keys)
    elif isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, str):
                if (not restrict_keys or k in TRANSLATABLE_LEAF_KEYS) and is_chinese(v):
                    yield v
            else:
                yield from collect_from_json(v, restrict_keys)


def batch_translate(client, texts: list[str]) -> list[str]:
    prompt = (
        "You are a professional translator for a Sino-Australia B2B consulting firm "
        "marketing site. Translate the following Chinese texts to English.\n\n"
        "Rules:\n"
        "- Preserve newline characters (\\n) and any markdown formatting exactly.\n"
        "- Tone: confident, professional, consulting-grade.\n"
        "- Translate proper nouns like 数贸融 as \"Digitrade\".\n"
        "- Return ONLY a JSON array of strings in the same order as input, "
        "no commentary, no markdown fences.\n\n"
        f"Input:\n{json.dumps(texts, ensure_ascii=False)}"
    )
    resp = client.models.generate_content(model=MODEL, contents=prompt)
    text = resp.text or ""
    start, end = text.find("["), text.rfind("]")
    if start < 0 or end < 0:
        raise RuntimeError(f"Gemini returned non-JSON: {text[:200]}")
    parsed = json.loads(text[start : end + 1])
    if len(parsed) != len(texts):
        raise RuntimeError(f"Length mismatch: got {len(parsed)}, expected {len(texts)}")
    return [str(s) for s in parsed]


def main():
    dry_run = "--dry-run" in sys.argv
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    gem = genai.Client(api_key=GEMINI_KEY)

    print("Reading site_config...")
    config_rows = sb.table("site_config").select("key,value").execute().data or []
    print(f"  {len(config_rows)} rows")

    print("Reading products...")
    product_rows = (
        sb.table("products")
        .select("id,title,description,stage,features")
        .execute()
        .data
        or []
    )
    print(f"  {len(product_rows)} rows")

    candidates: set[str] = set()

    for row in config_rows:
        key, value = row.get("key"), row.get("value")
        if not isinstance(value, str) or not value:
            continue
        if key in JSON_VALUED_CONFIG_KEYS:
            try:
                parsed = json.loads(value)
                candidates.update(collect_from_json(parsed, restrict_keys=True))
            except json.JSONDecodeError:
                if is_chinese(value):
                    candidates.add(value)
        elif is_chinese(value):
            candidates.add(value)

    for p in product_rows:
        for k in ("title", "description", "stage"):
            v = p.get(k)
            if isinstance(v, str) and is_chinese(v):
                candidates.add(v)
        features = p.get("features")
        if isinstance(features, str):
            try:
                features = json.loads(features)
            except json.JSONDecodeError:
                features = None
        if isinstance(features, list):
            for f in features:
                if isinstance(f, str) and is_chinese(f):
                    candidates.add(f)

    print(f"\nFound {len(candidates)} unique Chinese strings.")

    existing: set[str] = set()
    if candidates:
        hashes = [cyrb53(s) for s in candidates]
        for i in range(0, len(hashes), 100):
            chunk = hashes[i : i + 100]
            res = (
                sb.table("translations")
                .select("source_hash")
                .in_("source_hash", chunk)
                .eq("locale", TARGET_LOCALE)
                .execute()
            )
            existing.update(r["source_hash"] for r in (res.data or []))
    needs = sorted(s for s in candidates if cyrb53(s) not in existing)
    print(f"{len(existing)} already cached, {len(needs)} need translation.")

    if not needs:
        print("\nNothing to do. Cache is fully warm.")
        return

    if dry_run:
        print("\n--dry-run: skipping translation + writes. Preview:")
        for s in needs[:8]:
            preview = s.replace("\n", " ").strip()
            print(f"  • {preview[:90]}")
        if len(needs) > 8:
            print(f"  ...and {len(needs) - 8} more.")
        return

    written = failures = 0
    for i in range(0, len(needs), BATCH_SIZE):
        batch = needs[i : i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        total_batches = (len(needs) - 1) // BATCH_SIZE + 1
        print(f"\nBatch {batch_num}/{total_batches}: {len(batch)} strings...")
        try:
            translations = batch_translate(gem, batch)
        except Exception as e:
            print(f"  Translation failed: {e}")
            failures += len(batch)
            continue

        rows = [
            {
                "source_hash": cyrb53(src),
                "locale": TARGET_LOCALE,
                "source_text": src,
                "translated_text": tgt,
            }
            for src, tgt in zip(batch, translations)
        ]
        try:
            sb.table("translations").insert(rows).execute()
            written += len(rows)
            print(f"  OK: {len(rows)} rows inserted.")
        except Exception as e:
            print(f"  Insert failed: {e}")
            failures += len(batch)

        time.sleep(1)

    print(f"\nDone. Written: {written}. Failed: {failures}.")


if __name__ == "__main__":
    main()
