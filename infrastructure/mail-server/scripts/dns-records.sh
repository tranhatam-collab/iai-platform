#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  IAI Mail — DNS Records Guide
#  Run this to see exactly what DNS records to add in Cloudflare
#  for mail.iai.one + any additional domain
#
#  Usage:
#    chmod +x dns-records.sh
#    ./dns-records.sh
#    ./dns-records.sh tranhatam.net    # for additional domain
# ═══════════════════════════════════════════════════════════════

VPS_IP="${VPS_IP:-5.223.19.241}"  # export VPS_IP=1.2.3.4 before running
DOMAIN="${1:-iai.one}"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  DNS Records for: $DOMAIN"
echo "║  VPS IP: $VPS_IP"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Add these records in Cloudflare DNS (cloudflare.com/dns):"
echo ""

if [ "$DOMAIN" = "iai.one" ]; then
echo "── Subdomain A record (mail server) ──────────────────────────"
echo "  Type:    A"
echo "  Name:    mail"
echo "  Value:   $VPS_IP"
echo "  Proxy:   OFF (grey cloud — CRITICAL for SMTP port 25)"
echo "  TTL:     Auto"
echo ""
fi

echo "── MX record (receive email) ──────────────────────────────────"
echo "  Type:    MX"
echo "  Name:    $DOMAIN  (or @ for root)"
echo "  Value:   mail.iai.one"
echo "  Priority: 10"
echo "  Proxy:   DNS only"
echo ""

echo "── SPF (allow mail.iai.one to send) ───────────────────────────"
echo "  Type:    TXT"
echo "  Name:    $DOMAIN  (or @)"
echo "  Value:   \"v=spf1 mx a:mail.iai.one ~all\""
echo "  Proxy:   DNS only"
echo ""

echo "── DMARC (policy for spoofing protection) ─────────────────────"
echo "  Type:    TXT"
echo "  Name:    _dmarc.$DOMAIN"
echo "  Value:   \"v=DMARC1; p=quarantine; rua=mailto:dmarc@$DOMAIN; ruf=mailto:dmarc@$DOMAIN; fo=1\""
echo ""

echo "── DKIM (get from Mailcow after setup) ────────────────────────"
echo "  1. Login to https://mail.iai.one (Mailcow admin)"
echo "  2. Configuration → Domains → $DOMAIN → DKIM"
echo "  3. Generate DKIM key (2048 bit)"
echo "  4. Add the TXT record shown:"
echo "     Name:  dkim._domainkey.$DOMAIN"
echo "     Value: (the public key Mailcow generates)"
echo ""

echo "── PTR / Reverse DNS (set on VPS provider panel) ─────────────"
echo "  IP:      $VPS_IP"
echo "  Value:   mail.iai.one"
echo "  (On Hetzner: Server → Networking → IPv4 → Edit rDNS)"
echo ""

echo "── Auto-discovery (optional, for email clients) ───────────────"
echo "  Type:    CNAME"
echo "  Name:    autoconfig.$DOMAIN"
echo "  Value:   mail.iai.one"
echo ""
echo "  Type:    CNAME"
echo "  Name:    autodiscover.$DOMAIN"
echo "  Value:   mail.iai.one"
echo ""

echo "────────────────────────────────────────────────────────────────"
echo "After adding all records, verify with:"
echo "  dig MX $DOMAIN"
echo "  dig TXT $DOMAIN | grep spf"
echo "  nslookup -type=TXT _dmarc.$DOMAIN"
echo ""
echo "Test email deliverability: https://mail-tester.com"
echo "────────────────────────────────────────────────────────────────"
