#!/usr/bin/env bash
# Auto-sync the Iceland Eclipse companion schedule.
#   ROS Google Sheet  ->  schedule.json  ->  Vercel production
#
# Runs from cron on hermes. Credential-free by design: it relies on the ROS
# sheet being link-shared ("Anyone with the link: Viewer"), which makes the
# xlsx export fetchable without auth. Deploys only when the schedule actually
# changed (generatedAt timestamp is ignored in the comparison).
#
# Config: create $ROOT/.sync.env with:  SHEET_ID=<google-sheet-id>
# (optional)  SLACK_NOTIFY=1  to post to #imxp-simplefi on each live update.
set -euo pipefail

# cron has a bare PATH — add nvm's node (vercel CLI needs it) + user bins.
export PATH="/home/jon/.nvm/versions/node/v22.22.2/bin:/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"

ROOT="/home/jon/imxp/eclipse-companion"
SRC="$ROOT/src"
# Production is deployed from a dedicated worktree pinned to `main`, NEVER from
# this dev checkout (which rides feature branches). Otherwise a schedule change
# would ship whatever branch is checked out to prod. Regenerate + compare +
# deploy all happen in PROD_SRC. After an intentional promotion (merge into
# main), refresh it: git -C "$PROD_TREE" merge --ff-only main
PROD_TREE="/home/jon/imxp/eclipse-companion-prod"
PROD_SRC="$PROD_TREE/src"
CONF="$ROOT/.sync.env"
LOG="$ROOT/sync.log"
LOCK="$ROOT/.sync.lock"
ALERT_STATE="$ROOT/.sync.alert"     # last failure signature + timestamp (throttle)
PAT_ENV="$HOME/.hermes/profiles/pat/.env"
PAT_HEALTH="C0B47TV8U00"            # #pat-health (Pat bot must be a member)

log() { echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') $*" >>"$LOG"; }

# Post a failure alert to #pat-health as the Pat bot. Throttled: the same
# failure signature stays quiet for 6h so a persistent breakage (e.g. the ROS
# tab left unpublished) doesn't ping every 30 min. Never aborts the script.
# Success clears the state via `alert_clear`, so a fresh failure alerts at once.
alert() {
  local sig="$1" msg="$2" now token
  now="$(date +%s)"
  if [ -f "$ALERT_STATE" ]; then
    local last_sig last_ts
    last_sig="$(sed -n 1p "$ALERT_STATE" 2>/dev/null)"
    last_ts="$(sed -n 2p "$ALERT_STATE" 2>/dev/null)"
    if [ "$last_sig" = "$sig" ] && [ $((now - ${last_ts:-0})) -lt 21600 ]; then
      log "alert suppressed (same issue <6h): $sig"; return 0
    fi
  fi
  printf '%s\n%s\n' "$sig" "$now" >"$ALERT_STATE"
  if [ ! -f "$PAT_ENV" ]; then log "cannot alert — no pat env at $PAT_ENV"; return 0; fi
  token="$(grep -E '^SLACK_BOT_TOKEN=' "$PAT_ENV" | cut -d= -f2-)"
  if [ -z "$token" ]; then log "cannot alert — no SLACK_BOT_TOKEN"; return 0; fi
  curl -s -H "Authorization: Bearer $token" -H 'Content-type: application/json' \
    --data "$(python3 -c 'import json,sys;print(json.dumps({"channel":sys.argv[1],"text":sys.argv[2]}))' "$PAT_HEALTH" "$msg")" \
    "https://slack.com/api/chat.postMessage" >>"$LOG" 2>&1 || log "alert post failed"
}
alert_clear() { [ -f "$ALERT_STATE" ] && { rm -f "$ALERT_STATE"; log "pipeline healthy — cleared alert state"; } || true; }

# Single-flight: never let two syncs (or a slow deploy) overlap.
exec 9>"$LOCK"
flock -n 9 || { log "already running — skip"; exit 0; }

if [ ! -f "$CONF" ]; then
  log "not configured yet (no .sync.env with SHEET_ID) — skip"
  exit 0
fi
# shellcheck disable=SC1090
source "$CONF"
if [ -z "${ROS_CSV_URL:-}" ] && [ -z "${SHEET_ID:-}" ]; then
  log "neither ROS_CSV_URL nor SHEET_ID set in .sync.env — skip"
  exit 0
fi

# Safety invariant: prod is only ever deployed from the pinned-main worktree.
# If it's missing or not on main, refuse to deploy rather than risk shipping a
# feature branch to production.
if [ ! -d "$PROD_SRC" ] || [ "$(git -C "$PROD_TREE" branch --show-current 2>/dev/null)" != "main" ]; then
  log "prod worktree missing or not on main — refusing to deploy"
  alert "prodtree" "🔴 *Eclipse schedule sync: prod deploy tree not ready*

*Impact:* schedule NOT deployed (safe — prod unchanged).
*Cause:* $PROD_TREE is missing or not on main.
*Next step:* recreate it: git -C ~/imxp/eclipse-companion worktree add $PROD_TREE main"
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Fetch the ROS Chart. Prefer the Publish-to-web CSV of just the
#    "ROS Chart (auto)" tab (anonymous, no PII); fall back to the full-file
#    xlsx export if only SHEET_ID is configured.
if [ -n "${ROS_CSV_URL:-}" ]; then
  SRCFILE="$TMP/ros.csv"
  FETCH_URL="$ROS_CSV_URL"
else
  SRCFILE="$TMP/ros.xlsx"
  FETCH_URL="https://docs.google.com/spreadsheets/d/$SHEET_ID/export?format=xlsx"
fi
code="$(curl -s -L -o "$SRCFILE" -w '%{http_code}' "$FETCH_URL")"
if [ "$code" != "200" ] || head -c2 "$SRCFILE" | grep -q '<'; then
  log "fetch failed (http $code) — is the ROS tab Published to web (CSV) / the file link-shared?"
  alert "fetch" "🔴 *Eclipse schedule sync: can't read the ROS sheet* (HTTP $code)

*Impact:* the companion-app schedule has stopped auto-updating from the ROS sheet.
*Likely cause:* the \"ROS Chart (auto)\" tab is no longer Published to web, or its CSV URL changed.
*Next step:* re-publish that tab (File → Share → Publish to web → CSV) and update ROS_CSV_URL in ~/imxp/eclipse-companion/.sync.env."
  exit 1
fi

# 2. Regenerate schedule.json into a temp file.
if ! python3 "$PROD_SRC/scripts/normalize_schedule.py" "$SRCFILE" "$TMP/schedule.json" >>"$LOG" 2>&1; then
  log "normalize_schedule.py failed — keeping current schedule"
  alert "normalize" "🔴 *Eclipse schedule sync: couldn't parse the ROS sheet*

*Impact:* schedule NOT updated — the app is still showing the previous version (safe, not broken).
*Likely cause:* a column was renamed/removed or the tab layout changed in the ROS sheet.
*Next step:* check ~/imxp/eclipse-companion/sync.log for the Python error."
  exit 1
fi

# 2b. Add Icelandic fields (title_is/bio_is) for app.eclipse.is. Cache-backed:
#     only new/changed strings hit the claude CLI, usually none. NON-FATAL by
#     design — on failure the app just shows English for the missing fields,
#     so the sync always proceeds. Runs BEFORE the changed-comparison so a
#     reviewed correction to the cache alone still triggers a deploy.
translate_ok=1
if [ -f "$PROD_SRC/scripts/translate_schedule.py" ] && \
   ! python3 "$PROD_SRC/scripts/translate_schedule.py" \
    "$TMP/schedule.json" "$PROD_SRC/data/schedule-i18n-cache.json" >>"$LOG" 2>&1; then
  translate_ok=0
  log "translate_schedule.py failed — deploying with English fallback for new strings"
  alert "translate" "🟡 *Eclipse schedule sync: Icelandic translation step failed*

*Impact:* the schedule still syncs and deploys, but NEW schedule entries show English on app.eclipse.is until this is fixed (existing translations are cached and unaffected).
*Likely cause:* the claude CLI is missing/unauthenticated on the sync host, or its output failed to parse.
*Next step:* check ~/imxp/eclipse-companion/sync.log, then run: python3 ~/imxp/eclipse-companion/src/scripts/translate_schedule.py <schedule.json> <cache.json> by hand."
fi

# Everything worked — the pipeline is healthy, so reset the alert throttle
# (a later failure will alert immediately rather than being suppressed).
# Skipped while translate is failing so its 6h throttle state survives runs.
[ "$translate_ok" = "1" ] && alert_clear

# 3. Deploy only if the meaningful content changed (ignore generatedAt).
changed="$(python3 - "$TMP/schedule.json" "$PROD_SRC/data/schedule.json" <<'PY'
import json, sys
def norm(p):
    try:
        d = json.load(open(p)); d.pop("generatedAt", None)
        return json.dumps(d, sort_keys=True, ensure_ascii=False)
    except Exception:
        return None
print("1" if norm(sys.argv[1]) != norm(sys.argv[2]) else "0")
PY
)"
if [ "$changed" = "0" ]; then
  log "no schedule change"
  exit 0
fi

cp "$TMP/schedule.json" "$PROD_SRC/data/schedule.json"
log "schedule changed — deploying main to production"
cd "$PROD_SRC"
url="$(vercel --prod --yes --scope imxp 2>>"$LOG" | grep -oE 'https://[a-z0-9-]+\.vercel\.app' | head -1 || true)"
if [ -z "$url" ]; then
  log "deploy failed — schedule.json updated locally but prod may be stale"
  alert "deploy" "🔴 *Eclipse schedule sync: deploy to production failed*

*Impact:* a new schedule was generated from the ROS sheet but the live app didn't update — attendees still see the old schedule.
*Next step:* check ~/imxp/eclipse-companion/sync.log for the Vercel error, then redeploy from ~/imxp/eclipse-companion-prod/src with: vercel --prod --yes --scope imxp"
  exit 1
fi
log "deployed: $url"
# No Slack post on success — #pat-health only hears about failures (Jon, 2026-07-07).
