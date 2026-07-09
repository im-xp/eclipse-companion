#!/usr/bin/env bash
# Auto-sync the Iceland Eclipse Attendee FAQ.
#   Notion FAQ database  ->  faq.json  ->  Vercel production
#
# Runs from cron on hermes. Mirrors sync_schedule.sh. Unlike the schedule (a
# link-shared sheet), the FAQ database is NOT publicly readable, so this needs
# an official Notion integration. Add to $ROOT/.sync.env:
#   NOTION_TOKEN=ntn_…              (internal integration secret)
#   FAQ_DATABASE_ID=<32-hex db id>  (database shared with that integration)
# Until both are set, this script skips cleanly (like the schedule sync does
# without SHEET_ID). Deploys only when the FAQ content actually changed.
set -euo pipefail

# cron has a bare PATH — add nvm's node (vercel CLI needs it) + user bins.
export PATH="/home/jon/.nvm/versions/node/v22.22.2/bin:/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"

ROOT="/home/jon/imxp/eclipse-companion"
SRC="$ROOT/src"
CONF="$ROOT/.sync.env"
LOG="$ROOT/sync.log"
LOCK="$ROOT/.sync.faq.lock"
ALERT_STATE="$ROOT/.sync.faq.alert"
PAT_ENV="$HOME/.hermes/profiles/pat/.env"
PAT_HEALTH="C0B47TV8U00"            # #pat-health (Pat bot must be a member)

log() { echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') [faq] $*" >>"$LOG"; }

# Throttled failure alert to #pat-health as the Pat bot (same as schedule sync).
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
alert_clear() { [ -f "$ALERT_STATE" ] && { rm -f "$ALERT_STATE"; log "faq pipeline healthy — cleared alert state"; } || true; }

exec 9>"$LOCK"
flock -n 9 || { log "already running — skip"; exit 0; }

if [ ! -f "$CONF" ]; then
  log "not configured yet (no .sync.env) — skip"
  exit 0
fi
# shellcheck disable=SC1090
source "$CONF"
if [ -z "${NOTION_TOKEN:-}" ] || [ -z "${FAQ_DATABASE_ID:-}" ]; then
  log "NOTION_TOKEN / FAQ_DATABASE_ID not set in .sync.env — skip"
  exit 0
fi
export NOTION_TOKEN FAQ_DATABASE_ID

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Fetch + normalize straight from the Notion API into a temp file.
if ! python3 "$SRC/scripts/normalize_faq.py" "$TMP/faq.json" >>"$LOG" 2>&1; then
  log "normalize_faq.py failed — keeping current faq.json"
  alert "faq-fetch" "🔴 *Eclipse FAQ sync: couldn't read the Notion FAQ database*

*Impact:* the companion-app FAQ is still showing the previous version (safe, not broken).
*Likely cause:* the integration lost access to the database, the token was rotated, or a column was renamed.
*Next step:* check ~/imxp/eclipse-companion/sync.log for the error; confirm the FAQ database is still shared with the integration."
  exit 1
fi
alert_clear

# 2. Deploy only if the meaningful content changed (ignore generatedAt).
changed="$(python3 - "$TMP/faq.json" "$SRC/data/faq.json" <<'PY'
import json, sys
def norm(p):
    try:
        d = json.load(open(p)); d.pop("generatedAt", None); d.pop("_comment", None)
        return json.dumps(d, sort_keys=True, ensure_ascii=False)
    except Exception:
        return None
print("1" if norm(sys.argv[1]) != norm(sys.argv[2]) else "0")
PY
)"
if [ "$changed" = "0" ]; then
  log "no FAQ change"
  exit 0
fi

cp "$TMP/faq.json" "$SRC/data/faq.json"
log "FAQ changed — deploying to production"
cd "$SRC"
url="$(vercel --prod --yes --scope imxp 2>>"$LOG" | grep -oE 'https://[a-z0-9-]+\.vercel\.app' | head -1 || true)"
if [ -z "$url" ]; then
  log "deploy failed — faq.json updated locally but prod may be stale"
  alert "faq-deploy" "🔴 *Eclipse FAQ sync: deploy to production failed*

*Impact:* a new FAQ was pulled from Notion but the live app didn't update.
*Next step:* check ~/imxp/eclipse-companion/sync.log for the Vercel error, then redeploy from ~/imxp/eclipse-companion/src with: vercel --prod --yes --scope imxp"
  exit 1
fi
log "deployed: $url"
