#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  IAI Mail — Setup all domains
#  Adds all owner domains to Mailcow + prints DNS records for each
#
#  Usage:
#    export VPS_IP=YOUR_VPS_IP
#    export MAILCOW_API_KEY=your-mailcow-api-key
#    chmod +x setup-all-domains.sh && ./setup-all-domains.sh
# ═══════════════════════════════════════════════════════════════

VPS_IP="${VPS_IP:-89.167.116.167}"
MAILCOW_URL="${MAILCOW_URL:-https://mail.iai.one}"
API_KEY="${MAILCOW_API_KEY:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── All domains ───────────────────────────────────────────────
DOMAINS=(
  "iai.one"
  "lactiendalat.com"
  "muonnoi.org"
  "nguyenlananh.com"
  "nhachung.org"
  "phiasaumannhung.com"
  "tranhatam.com"
  "tueban.com"
  "vetuonglai.com"
  "visamuonnoi.com"
  "visamuonnoi.org"
  "duongsaotoasang.com"
)

if [ -z "$API_KEY" ]; then
  echo "⚠  MAILCOW_API_KEY not set."
  echo "   Get it from: $MAILCOW_URL → Configuration → Access → API"
  echo "   Then: export MAILCOW_API_KEY=your-key && ./setup-all-domains.sh"
  exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Setting up ${#DOMAINS[@]} domains on IAI Mail Server"
echo "  VPS: $VPS_IP"
echo "═══════════════════════════════════════════════════════════"

# ── Add each domain to Mailcow ────────────────────────────────
for DOMAIN in "${DOMAINS[@]}"; do
  echo ""
  echo "▶ Adding $DOMAIN..."
  RESULT=$(curl -s -X POST "$MAILCOW_URL/api/v1/add/domain" \
    -H "X-API-Key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"domain\": \"$DOMAIN\",
      \"description\": \"IAI Ecosystem - $DOMAIN\",
      \"aliases\": 20,
      \"mailboxes\": 20,
      \"maxquota\": 10240,
      \"quota\": 10240,
      \"active\": 1,
      \"backupmx\": 0
    }")
  echo "  $RESULT"
done

# ── Create default mailboxes for iai.one ─────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Creating default mailboxes for iai.one"
echo "═══════════════════════════════════════════════════════════"

MAILBOXES=(
  "noreply:IAI No Reply"
  "hello:IAI Hello"
  "support:IAI Support"
  "admin:IAI Admin"
  "dmarc:IAI DMARC Reports"
)

for MB in "${MAILBOXES[@]}"; do
  LOCAL="${MB%%:*}"
  DISPLAY="${MB##*:}"
  PASS=$(openssl rand -hex 16)
  echo ""
  echo "▶ Creating $LOCAL@iai.one (password: $PASS)"
  curl -s -X POST "$MAILCOW_URL/api/v1/add/mailbox" \
    -H "X-API-Key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"local_part\": \"$LOCAL\",
      \"domain\": \"iai.one\",
      \"name\": \"$DISPLAY\",
      \"password\": \"$PASS\",
      \"password2\": \"$PASS\",
      \"quota\": \"1024\",
      \"active\": 1,
      \"force_pw_update\": 0
    }" | python3 -m json.tool 2>/dev/null || echo "done"

  # Save credentials
  echo "$LOCAL@iai.one:$PASS" >> /root/iai-mailbox-credentials.txt
done

echo ""
echo "Mailbox credentials saved to: /root/iai-mailbox-credentials.txt"
echo "⚠  Save these in a password manager and delete this file!"

# ── Update IAI Mail API allowed domains ──────────────────────
ALLOWED=$(IFS=','; echo "${DOMAINS[*]}")
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Updating IAI Mail API allowed domains..."
echo "═══════════════════════════════════════════════════════════"

if [ -f /opt/iai-mail-api/.env ]; then
  sed -i "s/^ALLOWED_FROM_DOMAINS=.*/ALLOWED_FROM_DOMAINS=$ALLOWED/" /opt/iai-mail-api/.env
  docker restart iai-mail-api
  echo "✓ API updated and restarted"
else
  echo "Note: Update ALLOWED_FROM_DOMAINS=$ALLOWED in /opt/iai-mail-api/.env"
fi

# ── Print all DNS records needed ─────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  DNS Records needed (add in each domain's DNS panel)"
echo "═══════════════════════════════════════════════════════════"

for DOMAIN in "${DOMAINS[@]}"; do
  echo ""
  echo "── $DOMAIN ──────────────────────────────────────────────"
  echo "  MX    @             mail.iai.one      priority 10"
  echo "  TXT   @             \"v=spf1 mx a:mail.iai.one ~all\""
  echo "  TXT   _dmarc        \"v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one\""
  echo "  CNAME autoconfig    mail.iai.one"
  echo "  CNAME autodiscover  mail.iai.one"
  if [ "$DOMAIN" = "iai.one" ]; then
    echo "  A     mail          $VPS_IP  (PROXY OFF)"
  fi
  echo "  DKIM: Generate in Mailcow admin → Domains → $DOMAIN → DKIM"
done

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✓ Done! All ${#DOMAINS[@]} domains configured."
echo ""
echo "  Next: Generate DKIM keys for each domain in Mailcow admin"
echo "  URL: $MAILCOW_URL → Configuration → Domains → [domain] → DKIM"
echo "═══════════════════════════════════════════════════════════"
