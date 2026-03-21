#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  Upload & chạy IAI Mail Server lên VPS
#  Chạy lệnh này từ máy Mac của bạn
#
#  Usage: chmod +x deploy-to-server.sh && ./deploy-to-server.sh
# ═══════════════════════════════════════════════════════════════

VPS_IP="89.167.116.167"
VPS_USER="root"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "═══════════════════════════════════════════════════════════"
echo "  Deploying IAI Mail Server to $VPS_IP"
echo "═══════════════════════════════════════════════════════════"

# Upload toàn bộ infrastructure/mail-server lên VPS
echo "[1/3] Uploading files to VPS..."
rsync -avz --progress \
  "$PROJECT_DIR/" \
  "${VPS_USER}@${VPS_IP}:/opt/iai-mail-setup/" \
  --exclude ".git" \
  --exclude "node_modules"

# Chạy setup script trên VPS
echo "[2/3] Running setup on VPS..."
ssh "${VPS_USER}@${VPS_IP}" bash << 'REMOTE'
  export MAIL_HOSTNAME="mail.iai.one"
  export IAI_API_KEY="$(openssl rand -hex 32)"

  # Copy API files
  mkdir -p /opt/iai-mail-api
  cp /opt/iai-mail-setup/api/* /opt/iai-mail-api/
  cp /tmp/iai-mail-api/* /opt/iai-mail-api/ 2>/dev/null || true

  # Run setup
  cd /opt/iai-mail-setup
  chmod +x setup.sh scripts/*.sh
  ./setup.sh

  echo ""
  echo "API_KEY=$IAI_API_KEY" >> /root/iai-setup-info.txt
  echo "Setup complete! Check /root/iai-setup-info.txt"
REMOTE

echo "[3/3] Done! Next steps:"
echo "  1. SSH vào server: ssh root@$VPS_IP"
echo "  2. Xem thông tin: cat /root/iai-setup-info.txt"
echo "  3. Xem mailbox passwords: cat /root/iai-mailbox-credentials.txt"
