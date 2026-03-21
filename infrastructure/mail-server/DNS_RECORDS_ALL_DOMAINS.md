# IAI Mail Server — DNS Records cho tất cả 12 domains
**VPS IP:** `89.167.116.167`
**Mail server:** `mail.iai.one`
**Ngày tạo:** 2026-03-21

> **Quan trọng:** Record `A mail.iai.one` phải để Proxy = **OFF** (grey cloud) trong Cloudflare
> vì cổng 25 (SMTP) **không qua** Cloudflare proxy.

---

## BƯỚC 0 — Cài PTR (Reverse DNS) trên Hetzner — làm trước tiên!

> Vào **console.hetzner.com → Servers → mail-iai → Networking → IPv4**
> Click vào bút chì cạnh `89.167.116.167` → nhập: `mail.iai.one` → Save

Đây là bắt buộc để Gmail/Hotmail không đưa email vào spam.

---

## iai.one (primary mail domain)

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| A | `mail` | `89.167.116.167` | — | **OFF** ☁️ |
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| CNAME | `autodiscover` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## lactiendalat.com

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## muonnoi.org

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## nguyenlananh.com

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## nhachung.org

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## phiasaumannhung.com

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## tranhatam.com

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## tueban.com

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## vetuonglai.com

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## visamuonnoi.com

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## visamuonnoi.org

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## duongsaotoasang.com

| Type | Name | Value | Priority | Proxy |
|------|------|-------|----------|-------|
| MX | `@` | `mail.iai.one` | `10` | OFF |
| TXT | `@` | `v=spf1 mx a:mail.iai.one ~all` | — | OFF |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@iai.one; fo=1` | — | OFF |
| CNAME | `autoconfig` | `mail.iai.one` | — | OFF |
| TXT | `dkim._domainkey` | *(lấy từ Mailcow sau khi setup)* | — | OFF |

---

## Checklist sau khi add DNS xong

- [ ] PTR record trên Hetzner: `89.167.116.167` → `mail.iai.one`
- [ ] A record `mail.iai.one` → `89.167.116.167` (proxy OFF)
- [ ] MX record cho tất cả 12 domains
- [ ] SPF record cho tất cả 12 domains
- [ ] DMARC record cho tất cả 12 domains
- [ ] SSH vào server, chạy setup.sh
- [ ] Login Mailcow, tạo DKIM cho từng domain
- [ ] Thêm DKIM TXT records vào DNS
- [ ] Test: https://mail-tester.com (gửi email đến địa chỉ test → phải đạt 9-10/10)
