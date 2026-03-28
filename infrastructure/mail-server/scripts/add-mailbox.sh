#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  Create a mailbox in Mailcow via API
#  Usage: ./add-mailbox.sh noreply@iai.one "IAI No Reply" strongpassword
# ═══════════════════════════════════════════════════════════════

EMAIL="${1:-}"
NAME="${2:-}"
PASS="${3:-$(openssl rand -hex 16)}"
MAILCOW_URL="${MAILCOW_URL:-https://mail.iai.one}"
API_KEY="${MAILCOW_API_KEY:-}"

if [ -z "$EMAIL" ]; then
  echo "Usage: ./add-mailbox.sh email@domain.com 'Display Name' [password]"
  exit 1
fi

LOCAL="${EMAIL%%@*}"
DOMAIN="${EMAIL##*@}"

echo "Creating mailbox: $EMAIL"
echo "Password: $PASS"

curl -sX POST "$MAILCOW_URL/api/v1/add/mailbox" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"local_part\": \"$LOCAL\",
    \"domain\": \"$DOMAIN\",
    \"name\": \"$NAME\",
    \"password\": \"$PASS\",
    \"password2\": \"$PASS\",
    \"quota\": \"1024\",
    \"active\": 1,
    \"force_pw_update\": 0
  }" | python3 -m json.tool

echo ""
echo "Mailbox $EMAIL created."
echo "Add to /opt/iai-mail-api/.env: SMTP_USER=$EMAIL / SMTP_PASS=$PASS"
