# Iceland Eclipse Companion — Architecture

> Purpose: the data-flow map an agent needs *before* answering questions, so it
> doesn't have to re-read the code each time. Auto-loaded via `CLAUDE.md`
> (`@docs/ARCHITECTURE.md`). **Keep this current** — when you change auth,
> favorites, the schedule pipeline, or deploy mechanics, update this file in the
> same commit. Cite `file:line` sparingly; prefer describing the flow.

Next.js 16 (App Router) app rooted at `src/`. Deployed on Vercel project
`imxp/eclipse-companion` (team `imxp`). Read `AGENTS.md` first — this Next major
has breaking changes vs training data.

## Login / profile (`AUTH_MODE`)

The profile feature is gated behind login. Mode is chosen by the `AUTH_MODE` env
var (`src/lib/profile.ts` → `authMode()`):

- `demo` — any email → bundled sample profile (`data/demo-profile.json`), no API.
- `list` — any email present in the participation API signs straight into their
  REAL profile with **no possession proof**. Auth bypass → gated-staging only.
- `live` — participation API emails a 6-digit EdgeOS code (`/v1/auth/login` +
  `/v1/auth/verify`).
- `magic` — **public launch mode.** We mint a single-use, 15-min HMAC login token
  and email a sign-in link via Postmark; `GET /api/auth/magic` verifies it and
  sets the session. Self-contained; the participation API is untouched (only its
  email lookup is reused). See "Email" below.

**Session:** `ie_session`, an HMAC-SHA256-signed, httpOnly, 14-day cookie holding
`{email, customerId, purpose:"session", exp}` (`src/lib/auth.ts`). Login tokens
share the wire format but carry `purpose:"magic"` and a 15-min TTL; both verifiers
require their `purpose`, so neither token can be replayed as the other.

**Authorization model (important):** the shared participation-API key
(`PAT_API_TOKEN`) lives ONLY server-side; the browser never sees it and only ever
holds the scoped `ie_session`. Every data route derives `customer_id` from the
session, never from client input (`app/api/profile/*`, `app/profile/page.tsx`).
The API itself has no per-customer authz (any key reads any customer) — the
boundary is enforced here, in this app's server layer.

## Favorites (schedule hearts)

- **Visibility is login-gated.** `/schedule` passes `loggedIn={Boolean(session)}`;
  `ScheduleView` renders heart buttons and the "Saved" chip only when logged in.
- **Client** (`src/lib/favorites.ts`, `useFavorites`): localStorage is the instant
  source of truth; when a session exists it syncs to the account — union-merge on
  load, debounced PUT (2s) on toggle, `sendBeacon` flush on `pagehide`.
- **App API** (`src/app/api/profile/favorites.ts`): session-required (401 else),
  resolves `customer_id` from the session, `PUT /v1/customers/{id}/favorites`.
  Demo mode does not write upstream unless `DEMO_FAVORITES_SYNC=1`.
- **Backend** (`pat-profile-cloud/api/favorites.py`): persists to S3 in the
  `imxp-participation-read-model` bucket (Lambda has `CONFIRMED_CONTACTS_BUCKET`
  wired; `_bucket()` falls back to it) as BOTH a current snapshot
  `favorites/{customer_id}.json` AND an append-only, timestamped copy
  `favorites-log/{customer_id}/{ts}.json` on every save.
- **For analysis:** use the **`favorites-log`**, not the snapshot (the snapshot is
  last-write-wins and loses un-heart history). Each log entry is the full id set
  per push with `updated_at`; diff consecutive entries to derive heart/un-heart
  events. The log appends on every push (incl. load-time merges) → dedupe by
  content.
- **Heart identifier caveat:** favorites are keyed by `eventKey(e)`. Schedule
  events come from the ROS sheet and have **no stable id**, so the key is a
  synthetic composite. See "Schedule pipeline" — changing it affects saved data.

## Schedule pipeline (ROS sheet → `schedule.json`)

The festival lineup is **NOT from Luma** — it comes from the "IE26 Master ROS"
Google Sheet. Luma is a separate attendance/calendar concern.

- Cron on hermes runs `scripts/sync_schedule.sh` (every ~30 min): fetches the
  ROS "ROS Chart (auto)" tab as CSV (`ROS_CSV_URL` in `.sync.env`, public
  link-share, credential-free) → `normalize_schedule.py` → `schedule.json` →
  `vercel --prod`, only if content changed (generatedAt ignored). Alerts to
  `#pat-health` (as Pat) on failure, throttled 6h.
- ⚠️ It regenerates + deploys **in the `main` worktree** (`~/imxp/eclipse-
  companion-prod`), NOT the dev checkout — so prod stays `main`-only. Consequence:
  the dev checkout's `schedule.json` is NOT auto-refreshed anymore; regenerate it
  by hand for staging if needed (`ROS_CSV_URL` → `normalize_schedule.py`).
- `normalize_schedule.py` drops PII and emits per-event objects: `artist, title,
  isHostBlock, status, category, subcategory, date, day, start, durationMin,
  stage, headshot, bio, tagline, emcee`. **No `id` field in the source data.**
- `src/lib/schedule.ts` (`getSchedule`) folds one-row-per-speaker panels into
  merged events at runtime; `eventKey` = `date|stage|start|artist` (includes
  `start` to disambiguate repeat slots — the tradeoff is a heart drops if a set's
  start time changes on ROS regen).

## Email (Postmark)

Magic-link + transactional email go through the shared IMXP "Iceland And Egypt"
Postmark server (same server token `portal-dashboard` uses; a server token reads
templates + `/messages/outbound` but NOT `/senders` — that needs an account
token). `src/lib/email.ts` sends via `sendEmailWithTemplate`.

- Sender: `Iceland Eclipse <noreply@icelandeclipse.com>` (a confirmed sender;
  `icelandeclipse.com` is a verified sending domain).
- Template: `iceland-eclipse-signin` (id 45705778) — Eclipse-branded, model is
  `{the_url = magic link, popup_name}`.
- ⚠️ `POSTMARK_SERVER_TOKEN` must be a clean 36-char UUID; a stray char → 401 →
  `send_failed` surfaced as "Something went wrong" in the UI.

## Deploy / env mechanics

- **No Git integration** on the Vercel project (`rootDirectory` unset, `link`
  none). Push to GitHub deploys nothing. Deploys are manual, run **from `src/`**.
- **Staging (Preview):** `vercel --scope imxp` from the dev checkout
  (`~/imxp/eclipse-companion`, rides feature branches), then
  `vercel alias set <dep-url> imxp-eclipse-staging.vercel.app --scope imxp`.
- **Production:** ONLY from the dedicated worktree pinned to `main`,
  `~/imxp/eclipse-companion-prod` — `vercel --prod --scope imxp` from its `src/`.
  Never `--prod` from the dev checkout (it would ship whatever feature branch is
  checked out). The schedule cron enforces this (deploys from the worktree, with
  a guard that refuses if it's not on main). After an intentional promotion,
  refresh the worktree: `git -C ~/imxp/eclipse-companion-prod merge --ff-only main`.
- **Environments:** Preview = staging (`imxp-eclipse-staging.vercel.app`, gated by
  `STAGING_PASSWORD`, `src/proxy.ts`). Production = `app.icelandeclipse.com` /
  `app.eclipse.is` (ungated). Dev = local.
- **Env var CLI gotcha:** the plugin-wrapped `vercel env add` demands a git branch
  for Preview, but there's no git link → set/delete Preview vars via the Vercel
  REST API (`POST /v10/projects/{id}/env` target `["preview"]`; `DELETE
  /v9/.../env/{id}`; PATCH silently no-ops → delete+recreate to change a value).
  Production works via `vercel env add NAME production --value … --yes`.
- Key env: `AUTH_MODE`, `PAT_API_BASE`/`PAT_API_TOKEN`, `SESSION_SECRET`,
  `POSTMARK_SERVER_TOKEN`, `APP_BASE_URL` (origin used to build magic links),
  `STAGING_PASSWORD` (Preview only).
