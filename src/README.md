# Eclipse Companion

Bare-bones festival companion for Iceland Eclipse (11–15 Aug 2026): festival
map, full schedule, and participant profile login. Branded to match
[explore.icelandeclipse.com](https://explore.icelandeclipse.com/) (same
palette, Montserrat/Raleway/Space Mono, pill buttons, mono eyebrows).

## Run

```bash
npm install
npm run dev
```

## Languages & domains

One deployment, two locales, no user-facing toggle — `src/proxy.ts` picks the
language per request and rewrites into the hidden `app/[locale]/` tree (URLs
stay clean, everything stays statically generated):

- **app.icelandeclipse.com** (and any non-eclipse.is host) → always English
- **app.eclipse.is** → Icelandic when `x-vercel-ip-country` is `IS`, else English

UI strings live in `lib/i18n/{en,is}.ts` (typed — a missing Icelandic key
fails the build). Guide articles are forked as `data/articles.is.ts`
(structure locked to `data/articles.ts` by `scripts/check_i18n.mjs`, a
prebuild step). Schedule content gets `title_is`/`bio_is` fields written by
`scripts/translate_schedule.py` during the cron sync, cached in
`data/schedule-i18n-cache.json` — to fix a translation, edit the `is` value
in the cache (keyed on the English text's hash, so corrections persist).
Side quests carry inline `is` blocks in `data/side-quests.json`.

Testing a locale in dev/preview: `?debug-locale=is` (or the `x-debug-locale`
header). Production ignores the override; Vercel owns the geo header there.
All Icelandic copy is machine-drafted (2026-07-15) and pending native review.

The home hero ticket CTA is per-locale: English → Fever
(`feverup.com/m/416569`), Icelandic → tickets.moment.is (with
`utm_source=eclipse.is`).

## Pages

- `/map` — pinch/scroll-zoomable festival map (`public/festival-map.jpg`)
- `/schedule` — day tabs + stage filter over `data/schedule.json`
- `/profile` — email login → participation profile

## Schedule data

`data/schedule.json` is generated from the "IE26 Master ROS list format"
Google Sheet ("ROS Chart (auto)" tab). To refresh: download the sheet as
xlsx, then

```bash
python3 scripts/normalize_schedule.py path/to/ros.xlsx data/schedule.json
```

The normalizer keeps only public-safe fields (no emails, phones, or stage
manager contacts) and drops rows that aren't Confirmed/Pending.

## Auth modes

Controlled by `AUTH_MODE` (see `.env.example`):

- `demo` (default) — any email signs in and renders the bundled sample
  participant (`data/demo-profile.json`). For UX testing.
- `live` — real magic-code login: `/api/auth/login` asks the participation
  API (`POST /v1/auth/login`) to email the participant a 6-digit EdgeOS
  code; `/api/auth/verify` verifies it (`POST /v1/auth/verify`) and opens
  the session. The full customer record is fetched by `customer_id` and
  rendered. All API calls are server-side with bearer `PAT_API_TOKEN`.

Contact edits POST to `/api/profile/contacts`; in live mode they're written
back to the master IMXP record via `POST /v1/customers/{id}/contacts`
(pat-profile-cloud PR #24) so the confirmed-profile score weight is applied
by the scoring pipeline. A signed cookie keeps edits instantly visible
either way.

To flip on for deploy: set `AUTH_MODE=live`, `PAT_API_TOKEN`, and a strong
`SESSION_SECRET` in Vercel env. Sessions are HMAC-signed httpOnly cookies
(14 days).
