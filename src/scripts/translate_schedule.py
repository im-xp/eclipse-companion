#!/usr/bin/env python3
"""Add Icelandic fields (title_is/bio_is/tagline_is/description_is) to a schedule.json, in place.

Called by scripts/sync_schedule.sh between normalize and the changed-comparison.
Machine translation runs through the `claude` CLI (headless, OAuth-authed on the
sync host) with a committed content-hash cache so steady-state syncs translate
only new/changed strings — usually none.

    translate_schedule.py <schedule.json> <cache.json>

Cache format (data/schedule-i18n-cache.json, committed; additive-only so the
periodic commit-back of cron output stays merge-trivial):

    {"version": 1,
     "entries": {"<sha256(en)[:16]>": {"en": "...", "is": "...",
                                        "field": "title", "translatedAt": "..."}}}

Storing `en` beside `is` makes native review a plain-file edit: correct the
`is` value and the fix sticks on every future sync (the hash keys the English).

Failure mode: apply whatever the cache already covers, exit non-zero, and let
the sync continue — the app falls back to English for any missing field, so a
translation outage can never break or block a schedule deploy.
"""
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone

FIELDS = ("title", "bio", "tagline", "description")
BATCH = 40  # strings per claude call; bios are long, keep outputs comfortably small
CLAUDE_TIMEOUT = 300  # seconds per call

PROMPT = """You are translating festival schedule content to Icelandic for the \
Iceland Eclipse companion app (a music/culture festival on Snæfellsnes, August 2026).

Translate each entry's "en" text to natural, idiomatic Icelandic (informal tone, \
"þú" address). Rules:
- Artist names, band names, brand names, and set/track titles that are proper \
names stay EXACTLY as-is — if the whole string is a proper name, return it verbatim. \
Never "correct" a name toward an Icelandic one (e.g. the artist Annu must never \
become Anna).
- Place names use their correct Icelandic forms.
- Keep prices, times, and units unchanged.
- Markdown like [text](url): translate the text, never the url.
- Preserve meaning and tone; these are event titles and artist bios.

Input entries (JSON): each has "id", "field" (title/bio/tagline), and "en".
Respond with ONLY a JSON object mapping every id to its Icelandic string — no \
markdown fences, no commentary.

"""


def key(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]


def load_json(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return default


def call_claude(batch):
    """Translate one batch via `claude -p`. Returns {id: is_string} (may be partial)."""
    prompt = PROMPT + json.dumps(batch, ensure_ascii=False)
    proc = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True,
        text=True,
        timeout=CLAUDE_TIMEOUT,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"claude exited {proc.returncode}: {proc.stderr[:400]}")
    out = proc.stdout.strip()
    # Defensive: models occasionally fence output despite instructions.
    m = re.search(r"\{.*\}", out, re.DOTALL)
    if not m:
        raise RuntimeError(f"no JSON object in claude output: {out[:200]}")
    result = json.loads(m.group(0))
    return {k: v for k, v in result.items() if isinstance(v, str) and v.strip()}


def main():
    schedule_path, cache_path = sys.argv[1], sys.argv[2]
    with open(schedule_path) as f:
        schedule = json.load(f)
    cache = load_json(cache_path, {"version": 1, "entries": {}})
    entries = cache.setdefault("entries", {})

    # Collect unique translatable strings across all events.
    wanted = {}  # key -> {"field": ..., "en": ...}
    for e in schedule.get("events", []):
        for field in FIELDS:
            text = e.get(field)
            if text and isinstance(text, str) and text.strip():
                wanted.setdefault(key(text), {"field": field, "en": text})

    misses = [k for k in wanted if k not in entries]
    failed = False
    if misses:
        now = datetime.now(timezone.utc).isoformat(timespec="seconds")
        for i in range(0, len(misses), BATCH):
            chunk = misses[i : i + BATCH]
            batch = [
                {"id": k, "field": wanted[k]["field"], "en": wanted[k]["en"]}
                for k in chunk
            ]
            try:
                result = call_claude(batch)
            except Exception as err:  # noqa: BLE001 — any failure = English fallback
                print(f"translate batch {i // BATCH}: {err}", file=sys.stderr)
                failed = True
                continue
            for k in chunk:
                if k in result:
                    entries[k] = {
                        "en": wanted[k]["en"],
                        "is": result[k],
                        "field": wanted[k]["field"],
                        "translatedAt": now,
                    }
                else:
                    failed = True
        # Persist whatever succeeded even on partial failure.
        with open(cache_path, "w") as f:
            json.dump(cache, f, ensure_ascii=False, indent=1, sort_keys=True)
            f.write("\n")

    # Apply cache to the schedule (misses simply omit the field → app shows English).
    applied = 0
    for e in schedule.get("events", []):
        for field in FIELDS:
            text = e.get(field)
            if text and isinstance(text, str):
                hit = entries.get(key(text))
                if hit:
                    e[f"{field}_is"] = hit["is"]
                    applied += 1
    with open(schedule_path, "w") as f:
        json.dump(schedule, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(
        f"translate_schedule: {applied} fields localized, "
        f"{len(misses)} new strings, cache={len(entries)}"
        + (" (PARTIAL — some batches failed)" if failed else "")
    )
    sys.exit(2 if failed else 0)


if __name__ == "__main__":
    main()
