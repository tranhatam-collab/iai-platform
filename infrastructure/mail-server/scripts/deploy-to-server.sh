#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  Upload & chạy IAI Mail Server lên VPS
#  Chạy lệnh này từ máy Mac của bạn
#
#  Usage: chmod +x deploy-to-server.sh && ./deploy-to-server.sh
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

VPS_IP="${VPS_IP:-89.167.116.167}"
VPS_USER="${VPS_USER:-root}"
MAIL_HOSTNAME="${MAIL_HOSTNAME:-mail.iai.one}"
MAIL_TZ="${MAIL_TZ:-Asia/Ho_Chi_Minh}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
REMOTE_DIR="/opt/iai-mail-setup"

echo "═══════════════════════════════════════════════════════════"
echo "  Deploying IAI Mail Server to $VPS_IP"
echo "═══════════════════════════════════════════════════════════"

IAI_API_KEY="$(openssl rand -hex 32)"

# Upload toàn bộ infrastructure/mail-server lên VPS
echo "[1/3] Uploading files to VPS..."
ssh "${VPS_USER}@${VPS_IP}" "rm -rf ${REMOTE_DIR} && mkdir -p ${REMOTE_DIR}"
scp -r \
  "$PROJECT_DIR/api" \
  "$PROJECT_DIR/nginx" \
  "$PROJECT_DIR/scripts" \
  "$PROJECT_DIR/setup.sh" \
  "$PROJECT_DIR/DNS_RECORDS_ALL_DOMAINS.md" \
  "${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/"

# Chạy setup script trên VPS
echo "[2/3] Running setup on VPS..."
ssh "${VPS_USER}@${VPS_IP}" \
  "MAIL_HOSTNAME='${MAIL_HOSTNAME}' MAIL_TZ='${MAIL_TZ}' IAI_API_KEY='${IAI_API_KEY}' bash -s" << 'REMOTE'

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
echo "  3. Theo dõi SSL: docker compose -f /opt/mailcow-dockerized/docker-compose.yml logs -f acme-mailcow"
