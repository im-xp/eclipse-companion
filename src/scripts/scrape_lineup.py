#!/usr/bin/env python3
"""Scrape participant social links from the public lineup page.

icelandeclipse.com/lineup is a Framer site whose artist cards carry the social
links (Instagram, X, Facebook, YouTube, Spotify, LinkedIn, personal sites, ...)
that the ROS sheet — and therefore schedule.json — does not. This pulls those
links into src/data/lineup.json so the companion app can show an icon row when
you tap into an event.

Framer emits each card up to ~4x (one per responsive breakpoint), so we dedupe
by normalized name and merge the union of links found across copies.

Usage: python3 src/scripts/scrape_lineup.py
"""
from __future__ import annotations

import html
import json
import os
import re
import sys
import urllib.request

URL = "https://icelandeclipse.com/lineup"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "lineup.json")

# title="..." on the <a> tells us the platform. Anything else (personal sites)
# we bucket as "Website".
KNOWN_PLATFORMS = {
    "instagram", "x", "twitter", "facebook", "youtube", "spotify",
    "linkedin", "tiktok", "soundcloud", "bandcamp", "substack",
    "bluesky", "vimeo", "website", "spotify",
}

A_TAG = re.compile(r"<a\b([^>]*)>", re.I)
ATTR = re.compile(r'(\w+)="([^"]*)"')


def fetch() -> str:
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (lineup-scraper)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def platform_for(title: str, href: str) -> str:
    t = title.strip().lower()
    if t in KNOWN_PLATFORMS:
        return "twitter" if t == "x" else t
    # fall back to host sniffing for links whose title is a person's name etc.
    h = href.lower()
    for key in ("instagram", "facebook", "youtube", "spotify", "linkedin",
                "tiktok", "soundcloud", "bandcamp", "substack", "vimeo"):
        if key in h:
            return key
    if "x.com" in h or "twitter.com" in h:
        return "twitter"
    if "bsky.app" in h:
        return "bluesky"
    return "website"


def parse_cards(doc: str) -> dict:
    """Return {normalized_name: {name, socials{platform:href}}}.

    Only socials are pulled — schedule.json already carries bio/tagline from the
    ROS sheet, so this file's job is purely the links the sheet lacks.
    """
    out: dict[str, dict] = {}
    heads = list(re.finditer(r"<h3\b[^>]*>(.*?)</h3>", doc, re.S))
    for idx, m in enumerate(heads):
        name = html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
        if not name:
            continue
        end = heads[idx + 1].start() if idx + 1 < len(heads) else m.end() + 6000
        window = doc[m.end():end]

        socials: dict[str, str] = {}
        for am in A_TAG.finditer(window):
            attrs = dict(ATTR.findall(am.group(1)))
            href = html.unescape(attrs.get("href", "")).strip()
            title = attrs.get("title", "")
            if not href.startswith("http"):
                continue
            plat = platform_for(title, href)
            socials.setdefault(plat, href)  # first wins; skips dup breakpoints

        if not socials:
            continue

        key = normalize(name)
        if key in out:
            # merge across Framer's responsive copies of the same card
            for k, v in socials.items():
                out[key]["socials"].setdefault(k, v)
        else:
            out[key] = {"name": name, "socials": socials}
    return out


# --- name normalization (keep in sync with normalizeName in src/lib/socials.ts)
_TITLES = re.compile(r",?\s*\b(dr|prof|professor|phd|md|sir|dame)\.?\b", re.I)
_PAREN = re.compile(r"\(.*?\)")


def normalize(name: str) -> str:
    import unicodedata
    s = html.unescape(name)
    s = _PAREN.sub(" ", s)  # "Quantic (DJ set)" -> "Quantic"
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = s.replace("&", " and ")
    s = _TITLES.sub(" ", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def main() -> int:
    doc = fetch()
    cards = parse_cards(doc)
    entries = sorted(cards.values(), key=lambda e: e["name"].lower())
    # flatten socials dict -> ordered list for stable JSON
    order = ["instagram", "twitter", "facebook", "youtube", "spotify",
             "soundcloud", "bandcamp", "tiktok", "linkedin", "vimeo",
             "substack", "bluesky", "website"]
    payload = []
    for e in entries:
        socials = [{"platform": p, "href": e["socials"][p]}
                   for p in order if p in e["socials"]]
        # any platform not in `order` (shouldn't happen) appended at end
        for p, href in e["socials"].items():
            if p not in order:
                socials.append({"platform": p, "href": href})
        payload.append({"name": e["name"], "socials": socials})

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        f.write("\n")

    total_links = sum(len(e["socials"]) for e in payload)
    print(f"wrote {len(payload)} participants, {total_links} social links -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
