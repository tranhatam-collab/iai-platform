# H1 — INFORMATION ARCHITECTURE & CONTENT MAP
**Branch:** `feature/homepage-v1`
**Date:** 2026-03-28
**Gate:** Requires "Approved H0" before this phase starts
**Output:** IA Map + Copy Map + Section Contract (code-ready)

---

## 1. PAGE INFORMATION ARCHITECTURE

### 1.1 Scroll Flow (Top → Bottom)
```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (fixed, z-50)                                   │
│  Logo | Feed | Bài Học | Kiểm Chứng | Studio | CTA Auth │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [1] HERO SECTION (full-width, above fold)              │
│  Headline + Sub + Supporting + 3 CTAs + Trust badge     │
│  Guest only — Auth users see PersonalizedGreeting       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [2] TRUST PROOF STRIP (full-width, borderless)         │
│  ✦ Charter Compliant | ◎ AI Verified N | ⬡ On-Chain     │
└─────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────────────────┐
│  MAIN COLUMN (flex-1)│  SIDEBAR (320px, sticky)         │
│                      │                                  │
│  [3] ACTION PANEL    │  [5] KPI BAR                     │
│  CreatePost / CTAs   │  Live stats metrics              │
│                      │                                  │
│  [4] FEED            │  [6] MODULE ENTRY CARDS          │
│  Tab Nav + PostCards │  Flow | Verify | Studio | NOOS   │
│  + Load More         │                                  │
│                      │  [7] ROADMAP BLOCK               │
│                      │  Phase 1 ✓ | 2 ◉ | 3 ⬡          │
│                      │                                  │
│                      │  [SIDEBAR TRENDING] (existing)   │
└──────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [8] FOOTER (existing Footer.tsx — minor enhancements)  │
│  © IAI.ONE | Charter | Policies | Contact | Build hash  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Mobile Layout (< 768px)
```
[1] Hero (full width, condensed)
[2] Trust Strip (scrollable horizontal pills)
[3] Action Panel (full width)
[4] Feed (full width, no sidebar)
[5] KPI Bar (horizontal scroll)
[6] Module Entry (2-col grid)
[7] Roadmap (collapsed, expandable)
[8] Footer
```

### 1.3 Tablet Layout (768px - 1024px)
```
[1] Hero (full width)
[2] Trust Strip
[3] Action Panel + [4] Feed (full width)
[5] KPI Bar (inline, horizontal)
[6] Module Entry (3-col grid)
[7] Roadmap (sidebar below modules)
[8] Footer
```

---

## 2. CONTENT MAP (Section by Section)

### Section 1 — Hero

#### 2.1.1 Guest State (isAuth = false)
```
BADGE:     ● LIVE — Constitutional AI OS
HEADLINE:  Constitutional AI for Real-World Coordination
SUB:       No one stands above. No one falls below.
BODY:      Build, run, and verify AI workflows with charter
           guardrails and provenance by default.
CTA-1:     [Start on App]         → /register         (btn-gold)
CTA-2:     [Explore Flow Runtime] → flow.iai.one       (btn-outline)
CTA-3:     [Read the Charter]     → iai.one            (btn-ghost)
```

#### 2.1.2 Auth State (isAuth = true)
```
GREETING:  Chào lại, {user.name} ◎
TRUST:     Trust Score: T{user.trust_score}
CTA-AUTH:  [Tạo bài viết]   → CreatePost  (btn-gold)
           [Kiểm chứng]     → /verify     (btn-outline)
           [Bài học hôm nay] → /lessons   (btn-ghost)
```

#### 2.1.3 Stats Row (below CTAs, guest only)
```
1,247+          94%             89+            432+
Bài viết        Đã kiểm chứng   Bài học AI     Thành viên
[text-gold]     [text-jade]     [text-cyan]    [text-white/60]
```
*Data source: `/api/metrics/home` với fallback static values (xem H3)*

---

### Section 2 — Trust Proof Strip

```
┌─────────────────────────────────────────────────────────┐
│  ✦ Charter Compliant   ◎ 1,247 Posts Verified   ⬡ IPFS │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- `✦ Charter Compliant` — link hover: "Xem IAI Charter →"
- `◎ {N} Posts Verified` — real count từ API
- `⬡ Provenance On-Chain` — link: "Verify bài viết →"

**Visual:** Horizontal divider row, `font-mono text-[11px] text-white/40`, spacing giữa 3 items bằng `·` separator

---

### Section 3 — Action Panel

#### Guest State
```
┌─────────────────────────────────────────────────────────┐
│  Tham gia IAI để chia sẻ kiến thức và                   │
│  kiểm chứng thông tin cùng cộng đồng.                   │
│  [Đăng ký ngay]   [Đăng nhập]                          │
└─────────────────────────────────────────────────────────┘
```

#### Auth State
```
┌─────────────────────────────────────────────────────────┐
│  ◈  Bạn đang nghĩ gì?                          [Đăng] │
└─────────────────────────────────────────────────────────┘
(existing CreatePost component)
```

---

### Section 4 — Feed

**Tab labels (ordered):**
1. `🔥 Hot` — trending posts
2. `✓ Đã kiểm chứng` — fact_status = 'verified'
3. `✦ Bài học` — post_type = 'lesson'
4. `⚡ Tranh luận` — post_type = 'debate'
5. `⬡ On-Chain` — has ipfs_cid or chain_tx_hash

**Empty state copy (per tab):**
| Tab | Title | Description |
|-----|-------|-------------|
| Hot | Chưa có bài viết | Hãy là người đầu tiên chia sẻ! |
| Verified | Chưa có bài đã kiểm chứng | Các bài viết được AI xác nhận sẽ xuất hiện ở đây. |
| Lesson | Chưa có bài học | Tạo bài học AI đầu tiên! |
| Debate | Chưa có tranh luận | Bắt đầu một cuộc tranh luận với bằng chứng! |
| On-Chain | Chưa có nội dung On-Chain | Phase 3 — IPFS + Blockchain sắp ra mắt! |

---

### Section 5 — KPI Bar

```
┌────────┬────────┬────────┬────────┐
│ 1,247+ │  94%   │  89+   │  432+  │
│ Bài    │ Kiểm   │ Bài    │ Thành  │
│ viết   │ chứng  │ học AI │ viên   │
└────────┴────────┴────────┴────────┘
```

---

### Section 6 — Module Entry Cards

```
┌──────────────┐  ┌──────────────┐
│  ⟡ Flow      │  │  ◎ Verify    │
│  Runtime     │  │  AI          │
│  "Tự động    │  │  "Kiểm       │
│  hóa AI"     │  │  chứng"      │
│  [Khám phá →]│  │  [Thử ngay→] │
└──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│  ✦ IAI       │  │  ⬡ NOOS      │
│  Studio      │  │  Community   │
│  "Tạo nội    │  │  "Tham gia   │
│  dung AI"    │  │  cộng đồng"  │
│  [Vào Studio]│  │  [Tham gia→] │
└──────────────┘  └──────────────┘
```

**Card data:**
```typescript
const MODULES = [
  {
    id: 'flow',
    icon: '⟡',
    title: 'Flow Runtime',
    desc: 'Tự động hóa workflow AI với charter guardrails',
    cta: 'Khám phá',
    href: 'https://flow.iai.one',
    external: true,
    badge: 'LIVE',
  },
  {
    id: 'verify',
    icon: '◎',
    title: 'IAI Verify',
    desc: 'Kiểm chứng bài viết bằng AI — 94% accuracy',
    cta: 'Thử ngay',
    href: '/verify',
    external: false,
    badge: null,
  },
  {
    id: 'studio',
    icon: '✦',
    title: 'IAI Studio',
    desc: 'Tạo bài học, nội dung AI-assisted',
    cta: 'Vào Studio',
    href: '/studio',
    external: false,
    badge: null,
  },
  {
    id: 'noos',
    icon: '⬡',
    title: 'NOOS Community',
    desc: 'Cộng đồng AI có trách nhiệm',
    cta: 'Tham gia',
    href: 'https://noos.iai.one',
    external: true,
    badge: 'SOON',
  },
]
```

---

### Section 7 — Roadmap Block

```
● Phase 1 — Education + Truth          [ACTIVE — pulse indicator]
  Kiểm chứng AI · Bài học · Feed

○ Phase 2 — Social + Community         [PLANNED — gold/dim]
  Social graph · Reputation · Seed

○ Phase 3 — Blockchain + Web3          [FUTURE — muted]
  IPFS · On-chain · NFT/Cert
```

---

## 3. SECTION CONTRACT (TypeScript Types)

```typescript
// apps/web/types/homepage.ts (sẽ tạo trong H2)

export type SectionId =
  | 'hero'
  | 'trust-strip'
  | 'action-panel'
  | 'feed'
  | 'kpi-bar'
  | 'module-entry'
  | 'roadmap'
  | 'footer-cta'

export interface HomepageSection {
  id: SectionId
  title: string
  dataSource: 'static' | 'api' | 'mock'
  trustLevel: 'charter' | 'provenance' | 'verified' | 'none'
  priority: 'P0' | 'P1' | 'P2'
  authRequired: boolean
  analyticsEvent: string
}

export const HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: 'hero',
    title: 'Hero',
    dataSource: 'api',      // metrics, auth state
    trustLevel: 'charter',
    priority: 'P0',
    authRequired: false,
    analyticsEvent: 'homepage_hero_view',
  },
  {
    id: 'trust-strip',
    title: 'Trust Proof Strip',
    dataSource: 'api',      // verified count
    trustLevel: 'provenance',
    priority: 'P0',
    authRequired: false,
    analyticsEvent: 'homepage_trust_strip_view',
  },
  {
    id: 'action-panel',
    title: 'Action Panel',
    dataSource: 'static',
    trustLevel: 'none',
    priority: 'P0',
    authRequired: false,
    analyticsEvent: 'homepage_action_panel_click',
  },
  {
    id: 'feed',
    title: 'Feed',
    dataSource: 'api',
    trustLevel: 'verified',
    priority: 'P0',
    authRequired: false,
    analyticsEvent: 'homepage_feed_view',
  },
  {
    id: 'kpi-bar',
    title: 'KPI Bar',
    dataSource: 'api',      // fallback: mock
    trustLevel: 'none',
    priority: 'P1',
    authRequired: false,
    analyticsEvent: 'homepage_kpi_bar_view',
  },
  {
    id: 'module-entry',
    title: 'Module Entry',
    dataSource: 'static',
    trustLevel: 'none',
    priority: 'P1',
    authRequired: false,
    analyticsEvent: 'homepage_module_click',
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    dataSource: 'static',
    trustLevel: 'charter',
    priority: 'P2',
    authRequired: false,
    analyticsEvent: 'homepage_roadmap_view',
  },
]
```

---

## 4. COPY TONE GUIDE

| Context | Tone | Example |
|---------|------|---------|
| Hero headline | Bold, constitutional, minimal | "Constitutional AI for Real-World Coordination" |
| Supporting copy | Clear, direct, no jargon | "Build, run, and verify AI workflows..." |
| Vietnamese copy | Tự nhiên, không dịch máy | "Giáo dục bằng sự thật" — không phải "Giáo dục qua sự thật" |
| CTA buttons | Action-first, short | "Start on App" not "Click here to start" |
| Trust indicators | Factual, metric-backed | "1,247 Posts Verified" not "Many posts verified" |
| Empty states | Encouraging, next-action | "Hãy là người đầu tiên chia sẻ!" |

---

## 5. DELIVERABLES FOR H1 APPROVAL

- [ ] IA Map reviewed và approved (section order không thay đổi)
- [ ] Copy chính thức đã được approve (hero copy, CTA labels, trust labels)
- [ ] Section Contract types reviewed
- [ ] Module cards data approved (4 modules, links confirmed)
- [ ] Roadmap phases confirmed (3 phases, correct status)

**Approve H1:** Comment `Approved H1` trên PR

---

*Document version: v1.0 | 2026-03-28 | feature/homepage-v1*
