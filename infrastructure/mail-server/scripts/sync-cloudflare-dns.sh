#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════
#  IAI Mail — Sync Cloudflare DNS
#  Upserts MX/SPF/DMARC/DKIM records for all mail domains
#
#  Required:
#    export CLOUDFLARE_API_TOKEN=...
#
#  Optional:
#    export MAILCOW_API_KEY=...
#    export MAILCOW_URL=https://mail.iai.one
#    export MAIL_HOSTNAME=mail.iai.one
#    export VPS_IP=89.167.116.167
#    export DMARC_RUA=mailto:dmarc@iai.one
#    export DRY_RUN=1
#
#  If MAILCOW_API_KEY is not set, the script will try to read it
#  from /root/iai-setup-info.txt over SSH.
# ═══════════════════════════════════════════════════════════════

CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
MAILCOW_API_KEY="${MAILCOW_API_KEY:-}"
MAILCOW_URL="${MAILCOW_URL:-https://mail.iai.one}"
MAIL_HOSTNAME="${MAIL_HOSTNAME:-mail.iai.one}"
MAILCOW_SSH_HOST="${MAILCOW_SSH_HOST:-root@89.167.116.167}"
VPS_IP="${VPS_IP:-89.167.116.167}"
DMARC_RUA="${DMARC_RUA:-mailto:dmarc@iai.one}"
DRY_RUN="${DRY_RUN:-0}"
CF_API_BASE="https://api.cloudflare.com/client/v4"

DEFAULT_DOMAINS=(
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

if [[ -n "${TARGET_DOMAINS:-}" ]]; then
  read -r -a DOMAINS <<<"${TARGET_DOMAINS//,/ }"
else
  DOMAINS=("${DEFAULT_DOMAINS[@]}")
fi

SKIPPED_DOMAINS=()

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

need_cmd curl
need_cmd jq

if [[ -z "$CLOUDFLARE_API_TOKEN" ]]; then
  echo "CLOUDFLARE_API_TOKEN is required." >&2
  exit 1
fi

if [[ -z "$MAILCOW_API_KEY" ]]; then
  if command -v ssh >/dev/null 2>&1; then
    MAILCOW_API_KEY="$(
      ssh -o BatchMode=yes "$MAILCOW_SSH_HOST" \
        "grep '^MAILCOW_API_KEY=' /root/iai-setup-info.txt | tail -1 | cut -d= -f2-" \
        2>/dev/null || true
    )"
  fi
fi

if [[ -z "$MAILCOW_API_KEY" ]]; then
  echo "MAILCOW_API_KEY is required. Export it or allow SSH auto-read from $MAILCOW_SSH_HOST." >&2
  exit 1
fi

cf_api() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  local tmp_file http_code

  tmp_file="$(mktemp)"

  if [[ -n "$body" ]]; then
    http_code="$(
      curl -sS --retry 3 --retry-delay 1 --retry-all-errors \
        -o "$tmp_file" -w "%{http_code}" \
        -X "$method" "${CF_API_BASE}${path}" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "$body"
    )"
  else
    http_code="$(
      curl -sS --retry 3 --retry-delay 1 --retry-all-errors \
        -o "$tmp_file" -w "%{http_code}" \
        -X "$method" "${CF_API_BASE}${path}" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json"
    )"
  fi

  cat "$tmp_file"
  if [[ "$http_code" -ge 400 ]]; then
    echo "" >&2
    echo "HTTP ${http_code} for ${method} ${path}" >&2
    rm -f "$tmp_file"
    return 1
  fi

  rm -f "$tmp_file"
}

cf_assert_success() {
  local response="$1"
  local context="${2:-Cloudflare API call}"
  jq -e '.success == true' >/dev/null <<<"$response" || {
    echo "Cloudflare API error in: ${context}" >&2
    echo "$response" | jq . >&2
    exit 1
  }
}

cf_zone_id() {
  local domain="$1"
  local response
  response="$(cf_api GET "/zones?name=${domain}&status=active&per_page=1")"
  cf_assert_success "$response" "GET /zones?name=${domain}"
  jq -r '.result[0].id // empty' <<<"$response"
}

cf_list_records() {
  local zone_id="$1"
  local name="$2"
  local type="${3:-}"
  local path="/zones/${zone_id}/dns_records?name=${name}&per_page=100"
  if [[ -n "$type" ]]; then
    path="${path}&type=${type}"
  fi
  cf_api GET "$path"
}

cf_delete_record() {
  local zone_id="$1"
  local record_id="$2"
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "  [dry-run] DELETE record ${record_id}"
    return
  fi
  local response
  response="$(cf_api DELETE "/zones/${zone_id}/dns_records/${record_id}")"
  cf_assert_success "$response" "DELETE /zones/${zone_id}/dns_records/${record_id}"
}

cf_create_record() {
  local zone_id="$1"
  local body="$2"
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "  [dry-run] CREATE $(jq -c . <<<"$body")"
    return
  fi
  local response
  response="$(cf_api POST "/zones/${zone_id}/dns_records" "$body")"
  cf_assert_success "$response" "POST /zones/${zone_id}/dns_records"
}

delete_all_named_records() {
  local zone_id="$1"
  local fqdn="$2"
  local response ids

  response="$(cf_list_records "$zone_id" "$fqdn")"
  cf_assert_success "$response" "GET dns_records?name=${fqdn}"

  ids="$(jq -r '.result[]?.id' <<<"$response")"
  if [[ -z "$ids" ]]; then
    return
  fi

  while IFS= read -r id; do
    [[ -n "$id" ]] || continue
    cf_delete_record "$zone_id" "$id"
  done <<<"$ids"
}

delete_records_by_type_and_name() {
  local zone_id="$1"
  local fqdn="$2"
  local type="$3"
  local response ids

  response="$(cf_list_records "$zone_id" "$fqdn" "$type")"
  cf_assert_success "$response" "GET dns_records?name=${fqdn}&type=${type}"

  ids="$(jq -r '.result[]?.id' <<<"$response")"
  if [[ -z "$ids" ]]; then
    return
  fi

  while IFS= read -r id; do
    [[ -n "$id" ]] || continue
    cf_delete_record "$zone_id" "$id"
  done <<<"$ids"
}

delete_root_mail_txt_records() {
  local zone_id="$1"
  local domain="$2"
  local response

  response="$(cf_list_records "$zone_id" "$domain" "TXT")"
  cf_assert_success "$response" "GET dns_records?name=${domain}&type=TXT"

  while IFS= read -r id; do
    [[ -n "$id" ]] || continue
    cf_delete_record "$zone_id" "$id"
  done < <(
    jq -r '
      .result[]
      | select(
          ((.content | gsub("^\"|\"$"; "")) | startswith("v=spf1"))
          or ((.content | gsub("^\"|\"$"; "")) | startswith("v=DMARC1"))
        )
      | .id
    ' <<<"$response"
  )
}

zone_has_managed_email_routing_mx() {
  local zone_id="$1"
  local domain="$2"
  local response

  response="$(cf_list_records "$zone_id" "$domain" "MX")"
  cf_assert_success "$response" "GET dns_records?name=${domain}&type=MX"

  jq -e '.result[]? | select(.meta.email_routing == true)' >/dev/null <<<"$response"
}

create_a_record() {
  local zone_id="$1"
  local name="$2"
  local ip="$3"
  local body
  body="$(jq -nc --arg name "$name" --arg content "$ip" '
    {type:"A", name:$name, content:$content, ttl:1, proxied:false}
  ')"
  cf_create_record "$zone_id" "$body"
}

create_cname_record() {
  local zone_id="$1"
  local name="$2"
  local target="$3"
  local body
  body="$(jq -nc --arg name "$name" --arg content "$target" '
    {type:"CNAME", name:$name, content:$content, ttl:1, proxied:false}
  ')"
  cf_create_record "$zone_id" "$body"
}

create_mx_record() {
  local zone_id="$1"
  local name="$2"
  local target="$3"
  local body
  body="$(jq -nc --arg name "$name" --arg content "$target" '
    {type:"MX", name:$name, content:$content, priority:10, ttl:1}
  ')"
  cf_create_record "$zone_id" "$body"
}

create_txt_record() {
  local zone_id="$1"
  local name="$2"
  local value="$3"
  local body
  body="$(jq -nc --arg name "$name" --arg content "$value" '
    {type:"TXT", name:$name, content:$content, ttl:1}
  ')"
  cf_create_record "$zone_id" "$body"
}

mailcow_dkim_txt() {
  local domain="$1"
  curl -fsS -H "X-API-Key: ${MAILCOW_API_KEY}" \
    "${MAILCOW_URL}/api/v1/get/dkim/${domain}" | jq -r '.dkim_txt // empty'
}

sync_domain() {
  local domain="$1"
  local zone_id
  local dmarc_value="v=DMARC1; p=quarantine; rua=${DMARC_RUA}; fo=1"
  local spf_value="v=spf1 mx a:${MAIL_HOSTNAME} ~all"
  local dkim_value

  echo ""
  echo "=== ${domain} ==="

  zone_id="$(cf_zone_id "$domain")"
  if [[ -z "$zone_id" ]]; then
    echo "  Zone not found in Cloudflare: ${domain}" >&2
    exit 1
  fi

  if zone_has_managed_email_routing_mx "$zone_id" "$domain"; then
    echo "  SKIP: Cloudflare Email Routing is enabled and locking MX records."
    SKIPPED_DOMAINS+=("$domain")
    return 0
  fi

  dkim_value="$(mailcow_dkim_txt "$domain")"
  if [[ -z "$dkim_value" ]]; then
    echo "  Could not fetch DKIM from Mailcow for ${domain}" >&2
    exit 1
  fi

  delete_records_by_type_and_name "$zone_id" "$domain" "MX"
  create_mx_record "$zone_id" "$domain" "$MAIL_HOSTNAME"
  delete_root_mail_txt_records "$zone_id" "$domain"
  create_txt_record "$zone_id" "$domain" "$spf_value"

  delete_all_named_records "$zone_id" "_dmarc.${domain}"
  create_txt_record "$zone_id" "_dmarc.${domain}" "$dmarc_value"

  delete_all_named_records "$zone_id" "dkim._domainkey.${domain}"
  create_txt_record "$zone_id" "dkim._domainkey.${domain}" "$dkim_value"

  delete_all_named_records "$zone_id" "autoconfig.${domain}"
  create_cname_record "$zone_id" "autoconfig.${domain}" "$MAIL_HOSTNAME"

  delete_all_named_records "$zone_id" "autodiscover.${domain}"
  create_cname_record "$zone_id" "autodiscover.${domain}" "$MAIL_HOSTNAME"

  if [[ "$domain" == "iai.one" ]]; then
    delete_all_named_records "$zone_id" "mail.${domain}"
    create_a_record "$zone_id" "mail.${domain}" "$VPS_IP"
  fi

  echo "  OK"
}

echo "Syncing Cloudflare DNS for ${#DOMAINS[@]} domains"
echo "Mailcow URL: ${MAILCOW_URL}"
echo "Mail host:   ${MAIL_HOSTNAME}"
echo "VPS IP:      ${VPS_IP}"
[[ "$DRY_RUN" == "1" ]] && echo "Mode:        DRY RUN"

for domain in "${DOMAINS[@]}"; do
  sync_domain "$domain"
done

echo ""
if [[ "${#SKIPPED_DOMAINS[@]}" -gt 0 ]]; then
  echo "Skipped domains with Cloudflare Email Routing still enabled:"
  for domain in "${SKIPPED_DOMAINS[@]}"; do
    echo "  - ${domain}"
  done
  echo ""
fi
echo "Done."
