#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  Add a new domain to Mailcow via API
#  Usage: ./add-domain.sh yourdomain.com "Your Domain Description"
#
#  Prerequisites:
#    export MAILCOW_API_KEY=your-mailcow-api-key
#    (found in Mailcow admin → Configuration → Access → API)
# ═══════════════════════════════════════════════════════════════

DOMAIN="${1:-}"
DESC="${2:-$DOMAIN}"
MAILCOW_URL="${MAILCOW_URL:-https://mail.iai.one}"
API_KEY="${MAILCOW_API_KEY:-}"

if [ -z "$DOMAIN" ]; then
  echo "Usage: ./add-domain.sh yourdomain.com [description]"
  exit 1
fi

if [ -z "$API_KEY" ]; then
  echo "Error: MAILCOW_API_KEY not set"
  echo "  Get it from: $MAILCOW_URL → Configuration → Access → API"
  exit 1
fi

echo "Adding domain: $DOMAIN to Mailcow..."

# Add domain
curl -sX POST "$MAILCOW_URL/api/v1/add/domain" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"domain\": \"$DOMAIN\",
    \"description\": \"$DESC\",
    \"aliases\": 10,
    \"mailboxes\": 10,
    \"maxquota\": 10240,
    \"quota\": 10240,
    \"active\": 1,
    \"rl_value\": 10,
    \"rl_frame\": \"s\",
    \"backupmx\": 0,
    \"relay_all_recipients\": 0
  }" | python3 -m json.tool

echo ""
echo "Domain $DOMAIN added."
echo ""
echo "Next steps:"
echo "  1. Add DNS records: VPS_IP=YOUR_IP ./dns-records.sh $DOMAIN"
echo "  2. Generate DKIM in Mailcow admin UI"
echo "  3. Update ALLOWED_FROM_DOMAINS in /opt/iai-mail-api/.env"
echo "     Add: ,$DOMAIN"
echo "  4. Restart API: docker restart iai-mail-api"
