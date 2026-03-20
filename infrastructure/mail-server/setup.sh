#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  IAI Mail Server — One-click setup on Ubuntu 22.04
#  Installs: Docker, Mailcow, IAI Email API, Nginx, SSL
#
#  Usage:
#    chmod +x setup.sh
#    sudo ./setup.sh
#
#  Required env before running:
#    export MAIL_HOSTNAME=mail.iai.one
#    export IAI_API_KEY=your-secret-api-key   # pick any strong random string
# ═══════════════════════════════════════════════════════════════

set -e

MAIL_HOSTNAME="${MAIL_HOSTNAME:-mail.iai.one}"
IAI_API_KEY="${IAI_API_KEY:-$(openssl rand -hex 32)}"
MAILCOW_DIR="/opt/mailcow-dockerized"

echo ""
echo "═══════════════════════════════════════"
echo "  IAI Mail Server Setup"
echo "  Hostname: $MAIL_HOSTNAME"
echo "═══════════════════════════════════════"
echo ""

# ── 1. System update ─────────────────────────────────────────
echo "[1/8] Updating system..."
apt-get update -q && apt-get upgrade -yq
apt-get install -yq \
  git curl wget nano htop ufw fail2ban \
  nginx certbot python3-certbot-nginx \
  ca-certificates gnupg lsb-release

# ── 2. Docker ────────────────────────────────────────────────
echo "[2/8] Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

# ── 3. Firewall ──────────────────────────────────────────────
echo "[3/8] Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp      # HTTP (Let's Encrypt)
ufw allow 443/tcp     # HTTPS
ufw allow 25/tcp      # SMTP (receiving mail)
ufw allow 465/tcp     # SMTPS
ufw allow 587/tcp     # Submission
ufw allow 993/tcp     # IMAPS
ufw allow 4190/tcp    # Sieve (optional)
ufw --force enable
echo "Firewall configured."

# ── 4. fail2ban ──────────────────────────────────────────────
echo "[4/8] Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << 'JAIL'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true
JAIL
systemctl restart fail2ban

# ── 5. Mailcow ───────────────────────────────────────────────
echo "[5/8] Installing Mailcow..."
if [ ! -d "$MAILCOW_DIR" ]; then
  git clone --depth 1 https://github.com/mailcow/mailcow-dockerized "$MAILCOW_DIR"
fi
cd "$MAILCOW_DIR"
./generate_config.sh <<< "$MAIL_HOSTNAME
Europe/Berlin"

# Tune Mailcow config for lower memory usage
sed -i 's/^SKIP_CLAMD=.*/SKIP_CLAMD=y/' mailcow.conf  # disable ClamAV to save ~500MB RAM
sed -i 's/^SKIP_SOLR=.*/SKIP_SOLR=y/' mailcow.conf    # disable Solr search index

docker compose pull
docker compose up -d
echo "Mailcow started. Admin UI: https://$MAIL_HOSTNAME (after DNS + SSL)"

# ── 6. IAI Email API ─────────────────────────────────────────
echo "[6/8] Installing IAI Email API..."
mkdir -p /opt/iai-mail-api
cp -r /tmp/iai-mail-api/* /opt/iai-mail-api/ 2>/dev/null || true

cat > /opt/iai-mail-api/.env << ENV
PORT=3000
IAI_API_KEY=${IAI_API_KEY}
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=api@iai.one
SMTP_PASS=CHANGE_AFTER_MAILCOW_SETUP
ENV

cd /opt/iai-mail-api
docker build -t iai-mail-api .
docker run -d \
  --name iai-mail-api \
  --restart unless-stopped \
  --network host \
  --env-file .env \
  iai-mail-api

echo "IAI Email API running on :3000"

# ── 7. Nginx ─────────────────────────────────────────────────
echo "[7/8] Configuring Nginx..."
# Mailcow uses its own nginx on :443, so we use :8443 for our API
# We'll proxy mail.iai.one/api/* → localhost:3000
# And mail.iai.one/* → Mailcow admin

cat > /etc/nginx/sites-available/iai-mail << NGINX
server {
    listen 80;
    server_name $MAIL_HOSTNAME;
    return 301 https://\$host\$request_uri;
}
NGINX
# Note: Full HTTPS config added after certbot (see nginx/mail.conf)
ln -sf /etc/nginx/sites-available/iai-mail /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ── 8. Summary ───────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════"
echo "  Setup complete!"
echo "═══════════════════════════════════════"
echo ""
echo "  IMPORTANT — Save these:"
echo "  API Key: $IAI_API_KEY"
echo "  Mailcow admin: https://$MAIL_HOSTNAME"
echo "  API endpoint:  https://$MAIL_HOSTNAME/api/send"
echo ""
echo "  NEXT STEPS:"
echo "  1. Add DNS records (see scripts/dns-records.sh)"
echo "  2. Wait for DNS propagation (~5 min)"
echo "  3. Run: certbot --nginx -d $MAIL_HOSTNAME"
echo "  4. Login to Mailcow, create mailboxes"
echo "  5. Update /opt/iai-mail-api/.env with SMTP_PASS"
echo "  6. Run: docker restart iai-mail-api"
echo ""
