# H0 — ACCEPTANCE CHECKLIST
**Branch:** `feature/homepage-v1`
**Date:** 2026-03-28
**Gate:** Product Owner phải sign off tất cả mục trước khi H1 bắt đầu

---

## CHECKLIST FORMAT
- `[ ]` = Chưa verify
- `[x]` = Đã verify và pass
- `[~]` = Đã verify nhưng có deviation (cần ghi chú)
- `[!]` = Blocker — phải resolve trước khi proceed

---

## A. SCOPE VERIFICATION

| # | Item | Status | Note |
|---|------|--------|------|
| A1 | Section list chính thức (8 sections) đã được review và không có section nào bị thiếu | `[ ]` | |
| A2 | Section list đã được chốt — không có section nào sẽ được thêm mà không có separate approval | `[ ]` | |
| A3 | File scope frozen list đã được xem xét (6 files sửa + 7 files tạo mới) | `[ ]` | |
| A4 | Các file `out of scope` đã được liệt kê rõ và team biết | `[ ]` | |
| A5 | Target URL confirmed: `app.iai.one` (không phải `iai.one` hay `home.iai.one`) | `[ ]` | |

---

## B. KPI TARGETS CONFIRMATION

| # | KPI | Target | Đo lường | Approved? |
|---|-----|--------|----------|-----------|
| B1 | Activation Rate | >= 35% | Guest → Register click / Visitors | `[ ]` |
| B2 | CTA Click-Through Rate | >= 18% | Hero CTA clicks / Hero impressions | `[ ]` |
| B3 | Create-Post Conversion | >= 12% | Create post submit / DAU auth | `[ ]` |
| B4 | Verify Flow Entry | >= 8% | `/verify` entry from home / Visitors | `[ ]` |
| B5 | LCP (Largest Contentful Paint) | < 1.8s | Lighthouse P75 | `[ ]` |
| B6 | Feed Scroll Depth | >= 60% | Scroll past fold (custom event) | `[ ]` |

---

## C. CONTENT & MESSAGING SIGN-OFF

| # | Item | Approved? | Note |
|---|------|-----------|------|
| C1 | Hero Headline: `Constitutional AI for Real-World Coordination` | `[ ]` | |
| C2 | Hero Subheadline: `No one stands above. No one falls below.` | `[ ]` | |
| C3 | Hero Supporting: `Build, run, and verify AI workflows with charter guardrails and provenance by default.` | `[ ]` | |
| C4 | CTA 1 label: `Start on App` → `/register` | `[ ]` | |
| C5 | CTA 2 label: `Explore Flow Runtime` → `flow.iai.one` | `[ ]` | |
| C6 | CTA 3 label: `Read the Charter` → `iai.one` | `[ ]` | |
| C7 | Vietnamese copy cho HeroBanner (fallback): `Giáo dục bằng sự thật. Lưu trữ bởi phi tập trung.` | `[ ]` | |
| C8 | Trust Strip labels: `Charter Compliant` / `AI Verified` / `Provenance On-Chain` | `[ ]` | |

---

## D. TECHNICAL CONSTRAINTS ACKNOWLEDGED

| # | Constraint | Acknowledged? |
|---|-----------|---------------|
| D1 | Next.js 14 App Router (Edge Runtime) — không dùng getServerSideProps | `[ ]` |
| D2 | Tailwind CSS + existing design tokens — không thêm màu mới | `[ ]` |
| D3 | Zustand auth store — không thêm state lib | `[ ]` |
| D4 | Bundle size delta <= 20KB gzipped | `[ ]` |
| D5 | WCAG AA minimum accessibility | `[ ]` |
| D6 | `/api/metrics/home` chưa có — dùng mock/fallback trong H3 | `[ ]` |

---

## E. DEPENDENCIES CONFIRMED

| # | Dependency | Status | Owner |
|---|-----------|--------|-------|
| E1 | `iai.one` live và trỏ đúng | `[ ]` | Infrastructure |
| E2 | `flow.iai.one` live và trỏ đúng | `[ ]` | Infrastructure |
| E3 | Cloudflare Analytics setup trên `app.iai.one` | `[ ]` | Infrastructure |
| E4 | CI/CD pipeline chạy được trên nhánh `feature/homepage-v1` | `[ ]` | DevOps |
| E5 | Design tokens (obsidian/gold/jade/jade-dark/cyan-iai) document ở đâu | `[ ]` | Frontend |

---

## F. PR-H0 DELIVERABLES COMPLETE

| # | Deliverable | Status |
|---|------------|--------|
| F1 | `docs/homepage/H0_SCOPE_PACK_v1.md` tạo và push | `[ ]` |
| F2 | `docs/homepage/H0_ACCEPTANCE_CHECKLIST.md` tạo và push | `[ ]` |
| F3 | `docs/homepage/H1_IA_CONTENT_MAP.md` tạo và push | `[ ]` |
| F4 | `docs/homepage/H2_COMPONENT_CONTRACT.md` tạo và push | `[ ]` |
| F5 | `docs/homepage/H3_DATA_CONTRACT.md` tạo và push | `[ ]` |
| F6 | `docs/homepage/H4_SEO_PERF_SPEC.md` tạo và push | `[ ]` |
| F7 | `docs/homepage/H5_TRUST_COMPLIANCE_SPEC.md` tạo và push | `[ ]` |
| F8 | `docs/homepage/H6_RELEASE_CHECKLIST.md` tạo và push | `[ ]` |
| F9 | PR-H0 mở trên GitHub với đầy đủ description | `[ ]` |

---

## G. SIGN-OFF

**Product Owner:** _________________________ Date: ___________

**Comment trên PR:** `Approved H0`

**Sau khi approved:**
- Team bắt đầu H1 ngay
- Tạo nhánh `feature/homepage-v1-h1` hoặc tiếp tục trên nhánh hiện tại
- Target: H1 hoàn thành trong 1 ngày làm việc

---

*Document version: v1.0 | 2026-03-28 | feature/homepage-v1*
