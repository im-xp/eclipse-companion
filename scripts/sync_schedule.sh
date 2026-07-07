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
CONF="$ROOT/.sync.env"
LOG="$ROOT/sync.log"
LOCK="$ROOT/.sync.lock"

log() { echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') $*" >>"$LOG"; }

# Single-flight: never let two syncs (or a slow deploy) overlap.
exec 9>"$LOCK"
flock -n 9 || { log "already running — skip"; exit 0; }

if [ ! -f "$CONF" ]; then
  log "not configured yet (no .sync.env with SHEET_ID) — skip"
  exit 0
fi
# shellcheck disable=SC1090
source "$CONF"
if [ -z "${SHEET_ID:-}" ]; then
  log "SHEET_ID empty in .sync.env — skip"
  exit 0
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
XLSX="$TMP/ros.xlsx"

# 1. Fetch the sheet as xlsx.
code="$(curl -s -L -o "$XLSX" -w '%{http_code}' \
  "https://docs.google.com/spreadsheets/d/$SHEET_ID/export?format=xlsx")"
if [ "$code" != "200" ] || head -c2 "$XLSX" | grep -q '<'; then
  log "fetch failed (http $code) — is the sheet shared 'Anyone with link: Viewer'?"
  exit 1
fi

# 2. Regenerate schedule.json into a temp file.
if ! python3 "$SRC/scripts/normalize_schedule.py" "$XLSX" "$TMP/schedule.json" >>"$LOG" 2>&1; then
  log "normalize_schedule.py failed — keeping current schedule"
  exit 1
fi

# 3. Deploy only if the meaningful content changed (ignore generatedAt).
changed="$(python3 - "$TMP/schedule.json" "$SRC/data/schedule.json" <<'PY'
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

cp "$TMP/schedule.json" "$SRC/data/schedule.json"
log "schedule changed — deploying to production"
cd "$SRC"
url="$(vercel --prod --yes --scope imxp 2>>"$LOG" | grep -oE 'https://[a-z0-9-]+\.vercel\.app' | head -1 || true)"
log "deployed: ${url:-unknown}"

# 4. Optional Slack heads-up in #imxp-simplefi.
if [ "${SLACK_NOTIFY:-0}" = "1" ] && [ -f "$HOME/.hermes/profiles/pat/.env" ]; then
  token="$(grep -E '^SLACK_BOT_TOKEN=' "$HOME/.hermes/profiles/pat/.env" | cut -d= -f2-)"
  curl -s -H "Authorization: Bearer $token" -H 'Content-type: application/json' \
    --data '{"channel":"C0B4CPNJ9T6","text":"📅 Companion Guide schedule just auto-updated from the ROS sheet — live now."}' \
    "https://slack.com/api/chat.postMessage" >>"$LOG" 2>&1 || true
fi
