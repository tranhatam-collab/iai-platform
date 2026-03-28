# H2 — COMPONENT CONTRACT & UI SPECIFICATION
**Branch:** `feature/homepage-v1`
**Date:** 2026-03-28
**Gate:** Requires "Approved H1"
**Output:** Component shell với đầy đủ states (loading/empty/error/success)

---

## 1. COMPONENT TREE (Homepage)

```
page.tsx
└── FeedPage (refactored)
    ├── <Hero />                          [NEW — components/home/Hero.tsx]
    │   ├── GuestHero
    │   │   ├── TrustBadge (live pulse)
    │   │   ├── Headline + Sub + Body
    │   │   ├── CTAGroup (3 buttons)
    │   │   └── StatsRow
    │   └── PersonalizedGreeting          [NEW — components/home/PersonalizedGreeting.tsx]
    │       ├── UserWelcome
    │       └── AuthCTAGroup
    │
    ├── <TrustStrip />                    [NEW — components/home/TrustStrip.tsx]
    │   ├── CharterBadge
    │   ├── VerifiedCountBadge
    │   └── ProvenanceBadge
    │
    ├── div.grid (main + sidebar)
    │   ├── MAIN COLUMN
    │   │   ├── <ActionPanel />           [NEW — components/home/ActionPanel.tsx]
    │   │   │   ├── GuestCTA
    │   │   │   └── <CreatePost />        [EXISTING — feed/CreatePost.tsx]
    │   │   │
    │   │   ├── TabNav                    [EXISTING in FeedPage — keep as-is]
    │   │   └── Feed                      [EXISTING in FeedPage — keep as-is]
    │   │       ├── <PostSkeleton />      [EXISTING]
    │   │       ├── <EmptyFeed />         [EXISTING]
    │   │       └── <PostCard />          [EXISTING]
    │   │
    │   └── SIDEBAR COLUMN (sticky)
    │       ├── <KPIBar />                [NEW — components/home/KPIBar.tsx]
    │       ├── <ModuleCards />           [NEW — components/home/ModuleCards.tsx]
    │       ├── <RoadmapBlock />          [EXISTING in FeedPage — extract to component]
    │       └── <SidebarTrending />       [EXISTING in FeedPage — keep as-is]
    │
    └── Footer                            [EXISTING]
```

---

## 2. COMPONENT SPECIFICATIONS

### 2.1 Hero (`components/home/Hero.tsx`)

**Props:**
```typescript
interface HeroProps {
  metrics?: HomeMetrics | null
  metricsLoading?: boolean
}
```

**States:**
| State | Behavior |
|-------|----------|
| Loading | Show skeleton: h-8 w-2/3 headline + h-4 w-1/2 sub + 3 button skeletons |
| Guest | Full GuestHero với CTAs và StatsRow |
| Auth | PersonalizedGreeting (ẩn hero, show greeting) |
| Error | Vẫn show static hero (metrics fallback) — không crash |

**GuestHero visual spec:**
```
┌─────────────────────────────────────────────────────────────┐
│  Background: bg-gradient-to-br from-obsidian-mid to-...     │
│  Border: border border-obsidian-border                       │
│  Rounded: rounded-2xl                                        │
│  Padding: p-6 sm:p-10                                       │
│  Glow: absolute inset-0 bg-glow-gold opacity-30             │
│                                                              │
│  ● LIVE — Constitutional AI OS          [badge-gold-outline] │
│                                                              │
│  Constitutional AI for                  [font-serif 3xl-4xl] │
│  Real-World Coordination                [text-gradient-gold] │
│                                                              │
│  No one stands above.                   [text-white/70 sm]   │
│  No one falls below.                                         │
│                                                              │
│  Build, run, and verify AI workflows    [text-white/45 xs]   │
│  with charter guardrails and                                 │
│  provenance by default.                                      │
│                                                              │
│  [Start on App] [Explore Flow] [Read Charter]               │
│   btn-gold       btn-outline    btn-ghost                    │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│  1,247+    94%        89+        432+                        │
│  Bài viết  Kiểm chứng Bài học AI Thành viên                  │
└─────────────────────────────────────────────────────────────┘
```

**StatsRow spec:**
```typescript
interface StatItem {
  value: string        // "1,247+" — formatted
  label: string        // "Bài viết"
  color: string        // "text-gold" | "text-jade" | "text-cyan-iai" | "text-white/60"
  key: keyof HomeMetrics
}
```

---

### 2.2 TrustStrip (`components/home/TrustStrip.tsx`)

**Props:**
```typescript
interface TrustStripProps {
  verifiedCount?: number
  loading?: boolean
}
```

**Visual:**
```
border-t border-b border-obsidian-border/50
bg-obsidian-mid/30
py-2.5 px-4
flex items-center justify-center gap-6 flex-wrap
```

**States:**
| State | Behavior |
|-------|----------|
| Loading | 3 skeleton pills (h-4 w-32 rounded-full each) |
| Success | 3 badges with data |
| Error | Static fallback values (never hide) |

**Badge spec:**
```typescript
interface TrustBadge {
  icon: string          // '✦' | '◎' | '⬡'
  label: string         // "Charter Compliant" etc.
  value?: string        // optional dynamic value "1,247 Posts"
  href?: string         // optional link
  tooltip?: string      // hover tooltip text
}
```

---

### 2.3 KPIBar (`components/home/KPIBar.tsx`)

**Props:**
```typescript
interface KPIBarProps {
  metrics?: HomeMetrics | null
  loading?: boolean
}
```

**Visual (sidebar card):**
```
card p-5
├── Header: "Platform Stats" [font-mono text-xs uppercase]
├── Divider
└── Grid 2x2:
    ├── [value] [label]
    ├── [value] [label]
    ├── [value] [label]
    └── [value] [label]
```

**States:**
| State | Behavior |
|-------|----------|
| Loading | 4x skeleton blocks (h-6 w-16 + h-3 w-20 each) |
| Success | Animated count-up on first mount (optional — H2 level: static) |
| Error | Show fallback values (never crash) |

---

### 2.4 ModuleCards (`components/home/ModuleCards.tsx`)

**Props:**
```typescript
interface ModuleCardsProps {
  // No external data needed — static content
}
```

**Visual (sidebar card):**
```
card p-5
├── Header: "Khám phá IAI" [font-mono text-xs uppercase]
└── Stack of 4 module rows:
    ┌─────────────────────────────────┐
    │  [icon] Title          [→ CTA] │
    │         desc text              │
    └─────────────────────────────────┘
```

**States:** Only success state (static content — no loading/error).

**External link handling:** `target="_blank" rel="noopener noreferrer"` for `flow.iai.one` và `noos.iai.one`.

---

### 2.5 PersonalizedGreeting (`components/home/PersonalizedGreeting.tsx`)

**Props:**
```typescript
interface PersonalizedGreetingProps {
  user: User
}
```

**Visual:**
```
card p-5 mb-6
├── Avatar + Name + Trust Score
├── "Chào lại, {user.name} ◎"
├── Trust progress bar (T{score} / T100)
└── Quick action buttons (row)
```

**States:**
| State | Behavior |
|-------|----------|
| Auth | Full greeting card |
| Loading | Skeleton (should not occur — auth state pre-loaded) |

---

### 2.6 ActionPanel (`components/home/ActionPanel.tsx`)

**Props:**
```typescript
interface ActionPanelProps {
  isAuth: boolean
  user: User | null
  onCreated: () => void
}
```

**Guest state:**
```
card p-4 border border-dashed border-obsidian-border
├── text-sm text-white/50: "Tham gia IAI để chia sẻ kiến thức..."
└── buttons: [Đăng ký ngay btn-gold] [Đăng nhập btn-ghost]
```

**Auth state:**
```
<CreatePost onCreated={onCreated} />
```

---

## 3. DESIGN TOKENS REFERENCE

Các token hiện có trong hệ thống (không tạo mới):

```css
/* Colors */
--obsidian: #0D0D0F
--obsidian-mid: #141417
--obsidian-light: #1E1E24
--obsidian-muted: #2A2A33
--obsidian-border: rgba(255,255,255,0.06)
--gold: #D4AF37
--gold-dark: #B8962E
--jade: #3D9970
--cyan-iai: #06B6D4

/* Gradients (Tailwind classes) */
.text-gradient-gold       → IAI gold gradient text
.text-gradient-iai        → IAI multi-color gradient
.bg-glow-gold             → gold radial glow bg

/* Typography */
.font-serif               → Playfair Display / serif stack
.font-mono                → JetBrains Mono / mono stack

/* Components */
.card                     → bg-obsidian-mid border border-obsidian-border rounded-xl
.card-hover               → card + hover:border-gold/20 transition
.btn                      → base button styles
.btn-gold                 → gold CTA button
.btn-outline              → outlined button
.btn-ghost                → ghost/text button
.btn-sm                   → small button size
.badge                    → inline badge
.badge-gold               → gold badge variant
.skeleton                 → loading skeleton animate-pulse
.tab-nav                  → tab navigation bar
.animate-in               → fade-in animation
```

---

## 4. ANIMATION SPECS

| Component | Animation | Spec |
|-----------|-----------|------|
| Hero (guest) | Fade in on mount | `animate-in` class — opacity 0→1, 300ms |
| Stats Row | Count up (optional H2) | Static text, animate in H4 if time allows |
| Trust Strip | None | Static |
| KPIBar | Fade in | `animate-in` |
| ModuleCards | Stagger | Each card: delay 50ms × index |
| PostCard | Fade in | `animate-in` — already has this |
| Skeleton | Pulse | `animate-pulse` — already in system |

---

## 5. RESPONSIVE BREAKPOINTS

```typescript
// Tailwind breakpoints (existing config)
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop (sidebar appears at lg)
xl: '1280px'  // Wide desktop
```

**Key responsive rules:**
- Sidebar: `hidden lg:block` (sidebar ẩn trên mobile/tablet)
- Hero headline: `text-2xl sm:text-3xl lg:text-4xl`
- Stats row: `flex flex-wrap gap-4 sm:gap-6`
- Module cards (mobile): stack vertical; (desktop): sidebar card
- Trust strip: `flex-wrap gap-3 sm:gap-6`

---

## 6. ACCESSIBILITY REQUIREMENTS

| Element | Requirement |
|---------|-------------|
| Hero CTAs | `aria-label` mô tả đầy đủ action |
| Trust badges | `title` attribute với tooltip content |
| Module cards | `aria-label="Navigate to {module.title}"` |
| External links | `aria-label` include "(opens in new tab)" |
| Skeleton loaders | `aria-busy="true"` on container |
| Color contrast | Minimum 4.5:1 for body text, 3:1 for large text |
| Focus visible | All interactive elements có visible focus ring |

---

## 7. COMPONENT SHELL TEMPLATE

Mỗi new component phải có đúng pattern này:

```tsx
// ═══════════════════════════════════════════════════════════════
//  IAI Homepage — [ComponentName]
// ═══════════════════════════════════════════════════════════════

'use client'  // nếu cần client-side

import { ... } from '...'

interface [ComponentName]Props {
  // Props typed đầy đủ
}

function [ComponentName]Skeleton() {
  return (
    <div aria-busy="true">
      {/* skeleton UI */}
    </div>
  )
}

export function [ComponentName]({ ... }: [ComponentName]Props) {
  // State: loading → skeleton, error → fallback, success → content
  if (loading) return <[ComponentName]Skeleton />

  return (
    <section id="[section-id]" aria-label="[description]">
      {/* content */}
    </section>
  )
}
```

---

## 8. DELIVERABLES FOR H2 APPROVAL

- [ ] Component tree reviewed — không thiếu component nào
- [ ] All components có skeleton state spec
- [ ] Design tokens confirmed không cần thêm
- [ ] Responsive spec reviewed
- [ ] Accessibility requirements acknowledged
- [ ] PersonalizedGreeting flow approved (auth state behavior)

**Approve H2:** Comment `Approved H2` trên PR

---

*Document version: v1.0 | 2026-03-28 | feature/homepage-v1*
