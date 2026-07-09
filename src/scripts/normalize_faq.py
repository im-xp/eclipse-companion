"""Fetch the Attendee FAQ from the Notion database into faq.json.

Uses the OFFICIAL Notion API (https://api.notion.com/v1), which needs:
  - NOTION_TOKEN       an internal integration secret (ntn_… / secret_…)
  - FAQ_DATABASE_ID    the FAQ database id (32 hex, dashed or not)
both read from the environment. The database must be shared with the
integration (Notion: database → ••• → Connections → add the integration).

Why not the public/anonymous endpoint: the FAQ hub page is published to web,
but the database blocks embedded in it return role "none" to anonymous API
calls — they aren't publicly shared — so credential-free scraping yields no
rows. The official API is also far more stable than Notion's private v3 API.

Schema-tolerant: the question is the database's single title property; the
answer is a rich_text/text property (prefers one named ~"answer"); the category
is a select/multi_select (prefers one named ~"category"). Adjust the *_HINT
lists below if the FAQ database uses different column names.

Usage:  NOTION_TOKEN=… FAQ_DATABASE_ID=… python normalize_faq.py OUT.json
"""
import json
import os
import sys
import urllib.request

OUT = sys.argv[1] if len(sys.argv) > 1 else "faq.json"
TOKEN = os.environ.get("NOTION_TOKEN", "")
DB = os.environ.get("FAQ_DATABASE_ID", "").replace("-", "")
NOTION_VERSION = "2022-06-28"

ANSWER_HINT = ("answer", "response", "a")
CATEGORY_HINT = ("category", "topic", "section", "group")
# Category display order in the app (Notion order is not guaranteed). Unknown
# categories are appended after these, in first-seen order.
CATEGORY_ORDER = [
    "Key Event Info",
    "Travel & Packing",
    "Campgrounds",
    "Meals",
    "Programming",
    "General",
]
HUB_URL = "https://app.notion.com/p/imxp/Attendee-FAQ-366ec4424fdb8070bb32eb47bcd7fe7f"


def die(msg):
    print(f"normalize_faq: {msg}", file=sys.stderr)
    sys.exit(1)


def api(path, body):
    req = urllib.request.Request(
        f"https://api.notion.com/v1/{path}",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def plain(rich):
    return "".join(seg.get("plain_text", "") for seg in (rich or [])).strip()


def prop_text(prop):
    t = prop.get("type")
    if t == "title":
        return plain(prop.get("title"))
    if t == "rich_text":
        return plain(prop.get("rich_text"))
    if t == "select":
        return (prop.get("select") or {}).get("name", "")
    if t == "multi_select":
        return ", ".join(o.get("name", "") for o in (prop.get("multi_select") or []))
    return ""


def pick_column(props, types, hints):
    """Property name matching a type, preferring one whose name hits a hint."""
    candidates = [n for n, p in props.items() if p.get("type") in types]
    for n in candidates:
        if any(h in n.lower() for h in hints):
            return n
    return candidates[0] if candidates else None


def main():
    if not TOKEN or not DB:
        die("NOTION_TOKEN and FAQ_DATABASE_ID must be set")

    rows = []
    cursor = None
    while True:
        body = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        data = api(f"databases/{DB}/query", body)
        rows.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")

    if not rows:
        die("query returned 0 rows — is the database shared with the integration?")

    props0 = rows[0].get("properties", {})
    q_col = pick_column(props0, ("title",), ())
    a_col = pick_column(props0, ("rich_text",), ANSWER_HINT)
    c_col = pick_column(props0, ("select", "multi_select"), CATEGORY_HINT)
    if not q_col or not a_col:
        die(f"couldn't find question/answer columns in: {list(props0)}")

    by_cat = {}
    for row in rows:
        p = row.get("properties", {})
        question = prop_text(p.get(q_col, {}))
        answer = prop_text(p.get(a_col, {}))
        category = prop_text(p.get(c_col, {})) if c_col else "General"
        if not question or not answer:
            continue
        by_cat.setdefault(category or "General", []).append(
            {"question": question, "answer": answer}
        )

    ordered = [c for c in CATEGORY_ORDER if c in by_cat]
    ordered += [c for c in by_cat if c not in CATEGORY_ORDER]

    out = {
        "hubUrl": HUB_URL,
        "generatedAt": None,  # stamped by the caller so diffs stay content-only
        "categories": [{"title": c, "items": by_cat[c]} for c in ordered],
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    total = sum(len(v) for v in by_cat.values())
    print(f"normalize_faq: {total} Q&A across {len(ordered)} categories -> {OUT}")


if __name__ == "__main__":
    main()
