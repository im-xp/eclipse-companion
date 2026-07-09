"""Normalize the IE26 Master ROS into schedule.json for the companion app.

Public-safe: drops emails, phones, stage-manager contacts. Keeps only what renders.

Input (arg 1) is either:
  - the full workbook (.xlsx) — reads the "ROS Chart (auto)" tab, or
  - a single-tab CSV — the auto-sync fetches the "ROS Chart (auto)" tab via the
    sheet's Publish-to-web CSV so the master sheet's PII tabs stay private.
"""
import json, os, re, sys, datetime
from datetime import datetime as datetime_cls, timezone

SRC = sys.argv[1] if len(sys.argv) > 1 else "ros.xlsx"
OUT = sys.argv[2] if len(sys.argv) > 2 else "schedule.json"

DAY_MAP = {
    "Tuesday 11 August": "2026-08-11",
    "Wednesday 12 August": "2026-08-12",
    "Thursday 13 August": "2026-08-13",
    "Friday 14 August": "2026-08-14",
    "Saturday 15 August": "2026-08-15",
    "Sunday 16 August": "2026-08-16",
    "Monday 10 August": "2026-08-10",
}


def load_rows(path):
    """Rows as value-tuples (header first) from a CSV or the ROS xlsx tab."""
    if path.lower().endswith((".csv", ".tsv")):
        import csv
        delim = "\t" if path.lower().endswith(".tsv") else ","
        # utf-8-sig strips the BOM Google prepends to published CSV.
        with open(path, newline="", encoding="utf-8-sig") as f:
            return [tuple(r) for r in csv.reader(f, delimiter=delim)]
    import openpyxl
    wb = openpyxl.load_workbook(path, data_only=True)
    return list(wb["ROS Chart (auto)"].iter_rows(values_only=True))


rows = load_rows(SRC)
header = [str(h).strip() if h else "" for h in rows[0]]
idx = {h: i for i, h in enumerate(header)}

def get(row, col):
    i = idx.get(col)
    if i is None or i >= len(row):
        return None
    v = row[i]
    if v is None:
        return None
    s = str(v).strip()
    return s or None

events = []
unknown_days = {}
for row in rows[1:]:
    billing = get(row, "Lineup-Ready Billing")
    day_raw = get(row, "Day of the Week")
    si = idx.get("Start Time")
    start = row[si] if si is not None and si < len(row) else None
    stage = get(row, "Stage")
    if not billing or not day_raw or start is None or not stage:
        continue
    # Only "Confirmed" rows go public. Anything else (Pending, blank, draft…)
    # is withheld from the schedule — the Status column is the on/off switch:
    # flip a row to Confirmed to publish it, back to Pending to pull it.
    status = (get(row, "Status") or "").lower()
    if status != "confirmed":
        continue
    date = DAY_MAP.get(day_raw.strip())
    if not date:
        unknown_days[day_raw] = unknown_days.get(day_raw, 0) + 1
        continue
    if isinstance(start, datetime.time):
        start_s = start.strftime("%H:%M")
    elif isinstance(start, datetime.datetime):
        start_s = start.strftime("%H:%M")
    else:
        m = re.match(r"(\d{1,2}):(\d{2})", str(start))
        if not m:
            continue
        start_s = f"{int(m.group(1)):02d}:{m.group(2)}"
    dur_raw = get(row, "Duration") or ""
    m = re.search(r"(\d+)", dur_raw)
    duration_min = int(m.group(1)) if m else 60

    title = get(row, "Title")
    # Emcee host blocks duplicate the individual sessions; keep but flag
    is_host_block = bool(title and title.lower().startswith("hosting emcee"))

    events.append({
        "artist": billing,
        "title": None if is_host_block else title,
        "isHostBlock": is_host_block,
        "status": "confirmed",
        "category": get(row, "Category"),
        "subcategory": get(row, "subcategory"),
        "date": date,
        "day": day_raw.strip(),
        "start": start_s,
        "durationMin": duration_min,
        "stage": stage,
        "headshot": get(row, "Head shot"),
        "bio": get(row, "website BIO"),
        "tagline": get(row, "website TAGLINE"),
        "emcee": get(row, "Emcee"),
    })

events.sort(key=lambda e: (e["date"], e["start"], e["stage"]))
stages = sorted({e["stage"] for e in events})
days = sorted({e["date"] for e in events})
cats = sorted({e["category"] for e in events if e["category"]})

generated_at = datetime_cls.now(timezone.utc).isoformat(timespec="seconds")
out = {
    "generatedAt": generated_at,
    "days": days,
    "stages": stages,
    "categories": cats,
    "events": events,
}
with open(OUT, "w") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

# Archive every generation: favorites are keyed by date|stage|start|artist,
# so affinity analysis needs the schedule as it existed when a heart was
# saved — regenerating from the sheet can move or rename events.
archive_dir = os.path.join(os.path.dirname(os.path.abspath(OUT)), "schedule-archive")
os.makedirs(archive_dir, exist_ok=True)
stamp = generated_at.replace(":", "").replace("-", "").replace("+0000", "Z")
with open(os.path.join(archive_dir, f"schedule-{stamp}.json"), "w") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

print("events:", len(events))
print("days:", days)
print("stages:", stages)
print("categories:", cats)
if unknown_days:
    print("UNKNOWN DAYS (dropped):", unknown_days)
from collections import Counter
print(Counter(e["date"] for e in events))
