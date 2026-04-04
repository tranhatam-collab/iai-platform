# H0 — HOMEPAGE SCOPE PACK v1.0
**Branch:** `feature/homepage-v1`
**Date:** 2026-03-28
**Status:** PENDING APPROVAL — "Approved H0" required before H1 begins
**Owner:** Product Owner (tranhatam)
**Scope:** `app.iai.one` homepage (`apps/web/app/page.tsx` + related components)

---

## 1. CONTEXT & RATIONALE

### Tại sao làm homepage v1 ngay?
`app.iai.one` là **Layer 3 — Application** trong kiến trúc IAI:

```
iai.one          → Layer 0 — Constitutional Charter (Wix, hiện tại)
home.iai.one     → Layer 1 — Portal Entry Point
flow.iai.one     → Layer 2 — Workflow Builder Platform
app.iai.one      → Layer 3 — Application (Next.js — đây là target)
noos.iai.one     → Layer 4 — Civilization OS / AI Layer
```

Homepage v1 là **điểm vào đầu tiên** của người dùng vào hệ sinh thái IAI App. Nó phải:
- Kể rõ 1 câu chuyện duy nhất: **Constitutional AI OS**
- Funnel người dùng vào feed, create-post, verify, và đăng ký
- Embed trust layer (provenance + charter) vào mọi interaction
- Đạt KPI activation đủ để justify Phase 2 (Social Seed)

### As-Is hiện tại (confirmed từ codebase 2026-03-28)
| File | Trạng thái |
|------|-----------|
| `apps/web/app/page.tsx` | Tồn tại — chỉ render `<FeedPage />` |
| `apps/web/app/FeedPage.tsx` | Tồn tại — Feed + HeroBanner + SidebarStats |
| `apps/web/components/feed/PostCard.tsx` | Tồn tại — production-grade |
| `apps/web/components/feed/CreatePost.tsx` | Tồn tại |
| `apps/web/components/ui/Navbar.tsx` | Tồn tại — đầy đủ |
| `apps/web/components/ui/Footer.tsx` | Tồn tại |
| `apps/web/components/home/*` | **CHƯA TỒN TẠI — sẽ tạo mới** |
| `apps/web/lib/home-metrics.ts` | **CHƯA TỒN TẠI — sẽ tạo mới** |

**Điểm mạnh hiện tại:**
- SEO metadata đầy đủ (layout.tsx)
- Feed cursor pagination hoạt động
- Design system đồng nhất (obsidian/gold/jade tokens)
- Skeleton loading, empty state, error handling cơ bản

**Điểm yếu cần fix trong v1:**
- HeroBanner stats là mock data (hardcode "1,247+", "94%", "89+")
- Trust layer chưa embed (chưa có ProvenanceBadge, CharterBadge)
- Không có Section nào ngoài Feed (thiếu: KPI Strip, Module Entry, Trust Strip)
- Không có analytics funnel events
- Sidebar Trending Topics hardcode
- Performance: chưa có Suspense/lazy loading cho feed

---

## 2. HOMEPAGE SECTIONS — FROZEN SCOPE

Dưới đây là **danh sách section chính thức** của homepage v1. Không thêm/bớt section ngoài danh sách này mà không có approval.

### Section 1 — Hero (Full-Width)
```
ID: hero
Priority: P0 — MUST HAVE
Width: Full viewport
```
**Nội dung:**
- Headline: `Constitutional AI for Real-World Coordination`
- Subheadline: `No one stands above. No one falls below.`
- Supporting copy: `Build, run, and verify AI workflows with charter guardrails and provenance by default.`
- CTA Primary: `[Start on App]` → `/register`
- CTA Secondary: `[Explore Flow Runtime]` → `https://flow.iai.one`
- CTA Tertiary: `[Read the Charter]` → `https://iai.one`
- Trust indicator: Live pulse badge `● LIVE — Constitutional AI OS`
- Hiển thị: Chỉ với guest (isAuth=false). Nếu logged in → show PersonalizedGreeting

**Trạng thái:**
- Loading: Skeleton placeholder (height matched)
- Auth: `if (isAuth) return <PersonalizedGreeting />`
- Error: Không applicable (static content)

---

### Section 2 — Trust Proof Strip
```
ID: trust-strip
Priority: P0 — MUST HAVE
Width: Full (below Hero)
```
**Nội dung:**
- 3 trust indicators hiển thị ngang:
  1. `✦ Charter Compliant` — icon + label + tooltip link → `iai.one/charter`
  2. `◎ AI Verified` — icon + count (`N posts verified`) + tooltip
  3. `⬡ Provenance On-Chain` — icon + label + tooltip
- Background: subtle gradient border-bottom
- Font: `font-mono text-xs`

**Trạng thái:**
- Loading: skeleton (3 pills)
- Data: stats từ `/api/metrics/home` với fallback static values
- Error: hiện fallback static (không crash)

---

### Section 3 — Action Panel (Create Post / Quick Actions)
```
ID: action-panel
Priority: P0 — MUST HAVE
Width: Main column (left)
```
**Nội dung:**
- Guest: CTA box `"Tham gia để tạo bài viết và kiểm chứng thông tin"` + buttons
- Auth: `<CreatePost onCreated={...} />` (đã tồn tại)
- Quick actions bar: `[Tạo bài viết]` `[Kiểm chứng]` `[Bài học]`

---

### Section 4 — Feed (với Tab Navigation)
```
ID: feed
Priority: P0 — MUST HAVE
Width: Main column (left)
```
**Tabs:** Hot 🔥 | Đã kiểm chứng ✓ | Bài học ✦ | Tranh luận ⚡ | On-Chain ⬡

**Trạng thái:**
- Loading: 3x `<PostSkeleton />` (đã tồn tại)
- Empty: `<EmptyFeed />` (đã tồn tại)
- Error: Error boundary với retry button
- Success: `<PostCard />` list + Load more cursor

---

### Section 5 — KPI Strip (Live Statistics)
```
ID: kpi-strip
Priority: P1 — SHOULD HAVE (v1 có thể dùng mock)
Width: Sidebar (right) hoặc full-width strip
```
**Metrics cần hiện:**
| Metric | Label | Source | Fallback |
|--------|-------|--------|---------|
| Tổng bài viết | `Bài viết` | `/api/metrics/home` | `1,247+` |
| Tỷ lệ verified | `Đã kiểm chứng` | `/api/metrics/home` | `94%` |
| Tổng bài học | `Bài học AI` | `/api/metrics/home` | `89+` |
| Active members | `Thành viên` | `/api/metrics/home` | `432+` |

**Logic:** Fetch once on mount, cache 5 phút trong memory, fallback to static.

---

### Section 6 — Module Entry Cards
```
ID: module-entry
Priority: P1 — SHOULD HAVE
Width: Full-width grid (2-3 cols)
Position: Below feed or in sidebar
```
**Cards:**
1. `Flow Runtime` — "Tự động hóa workflow AI" → `flow.iai.one`
2. `IAI Verify` — "Kiểm chứng bài viết bằng AI" → `/verify`
3. `IAI Studio` — "Tạo bài học, nội dung" → `/studio`
4. `NOOS Community` — "Tham gia cộng đồng" → `noos.iai.one`

---

### Section 7 — Roadmap Block
```
ID: roadmap
Priority: P2 — NICE TO HAVE
Width: Sidebar
```
**Phases:**
- Phase 1 ✓ ACTIVE: Education + Truth
- Phase 2 ◉ PLANNED: Social + Community (Phase 2 Social Seed)
- Phase 3 ⬡ FUTURE: Blockchain + Web3

---

### Section 8 — Footer CTA + Trust Footer
```
ID: footer-cta
Priority: P0 — MUST HAVE (nằm trong Footer.tsx)
```
- "Tham gia IAI ngay" + Register button
- Charter link, Policies link, Contact
- Build version + commit hash (từ env)

---

## 3. KPI TARGETS (Homepage v1 Success Metrics)

| KPI | Target | Đo lường | Tool |
|-----|--------|----------|------|
| Activation Rate | >= 35% | Guest → Register click / Total visitors | Cloudflare Analytics + custom event |
| CTA Click-Through Rate | >= 18% | CTA clicks / hero impressions | Custom analytics event |
| Create-Post Conversion | >= 12% | Auth user → create post submit / DAU | API event tracking |
| Verify Flow Entry | >= 8% | Verify page entry from homepage / visitors | Analytics |
| Feed Load Time (LCP) | < 1.8s | Lighthouse / real user | Cloudflare Web Analytics |
| Feed Interaction (scroll depth) | >= 60% scroll past fold | Scroll tracking | Custom JS event |

**Cách đo:** Mỗi KPI gắn với 1 analytics event name (tham chiếu H3 data contract).

---

## 4. FILE SCOPE — FROZEN LIST

Các file **được phép** sửa/tạo trong `feature/homepage-v1`:

### Sửa (existing)
- `apps/web/app/page.tsx` — thêm metadata nâng cao, import sections mới
- `apps/web/app/FeedPage.tsx` — tách hero thành import, thêm trust strip, thêm analytics events
- `apps/web/app/layout.tsx` — thêm JSON-LD schema (Organization + WebSite)

### Tạo mới (new)
- `apps/web/components/home/Hero.tsx`
- `apps/web/components/home/TrustStrip.tsx`
- `apps/web/components/home/KPIBar.tsx`
- `apps/web/components/home/ModuleCards.tsx`
- `apps/web/components/home/PersonalizedGreeting.tsx`
- `apps/web/lib/home-metrics.ts`
- `apps/web/lib/analytics.ts`

### Không được phép (out of scope)
- Bất kỳ file ngoài `apps/web/` (trừ packages/brand-dna nếu được approve riêng)
- Thay đổi schema database
- Thay đổi API worker routes
- Thay đổi `apps/web/app/register/`, `/login/`, `/verify/`, `/lessons/`, `/studio/`

---

## 5. TECHNICAL CONSTRAINTS

- **Framework:** Next.js 14 App Router (Edge Runtime) — không dùng `getServerSideProps`
- **Styling:** Tailwind CSS với design tokens hiện có (không thêm màu mới nếu không qua ADR)
- **State:** Zustand (`useAuth`) cho auth state — không thêm state management lib
- **Data fetching:** `useEffect` + `api` client hiện có — có thể thêm TanStack Query ở H3 nếu approved
- **Bundle budget:** Không thêm > 20KB gzipped vào initial bundle
- **Accessibility:** WCAG AA minimum (contrast, aria-label, keyboard nav)
- **Browser support:** Modern evergreen browsers (Chrome/FF/Safari/Edge last 2 versions)

---

## 6. DEPENDENCIES & BLOCKERS

| Item | Owner | Status |
|------|-------|--------|
| API endpoint `/api/metrics/home` | Backend team | Not yet built — dùng mock/fallback |
| Design tokens `brand-dna` package | Frontend | Có thể dùng inline Tailwind trước |
| Analytics provider quyết định | Product | Cloudflare Analytics (free tier) — đủ dùng |
| `iai.one` charter URL (external link) | Business | `https://iai.one` — confirmed live |
| `flow.iai.one` URL | Infrastructure | Confirmed live |

---

## 7. PR SEQUENCE (Nhắc lại cho context)

```
PR-H0  ← Scope freeze + this doc (current PR)
PR-H1  ← IA + copy + section contract
PR-H2  ← UI components + all states
PR-H3  ← Data/API integration + fallback
PR-H4  ← SEO + schema + perf budget
PR-H5  ← Trust/compliance embedding (ProvenanceBadge + CharterBadge)
PR-H6  ← Test matrix + go-live readiness
```

**Rule:** Mỗi PR phải pass CI và được approve ("Approved Hx") trước khi merge và bắt đầu PR tiếp theo.

---

## 8. APPROVAL GATE

- [ ] Product Owner review section list — không thêm/bớt section
- [ ] KPI targets confirmed
- [ ] File scope frozen — no scope creep
- [ ] Tech constraints acknowledged
- [ ] PR-H0 merge → trigger start of H1

**Cách approve:** Comment `Approved H0` trên PR này.

---

*Document version: v1.0 | 2026-03-28 | feature/homepage-v1*
