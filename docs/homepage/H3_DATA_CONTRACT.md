# H3 — DATA CONTRACT & API INTEGRATION
**Branch:** `feature/homepage-v1`
**Date:** 2026-03-28
**Gate:** Requires "Approved H2"
**Output:** Data contract + Mock/Fallback strategy + Analytics event spec

---

## 1. DATA SOURCES MAP

| Section | Data Source | Endpoint | Fallback |
|---------|-------------|----------|---------|
| Hero (stats) | API → mock | `GET /api/metrics/home` | Static hardcode |
| Trust Strip (count) | API → mock | `GET /api/metrics/home` | Static "1,247+" |
| Feed | API | `GET /api/posts?tab=&limit=&cursor=` | Empty state UI |
| KPIBar | API → mock | `GET /api/metrics/home` | Static values |
| Module Cards | Static | N/A — config object | N/A |
| Roadmap | Static | N/A — config object | N/A |
| User (auth) | Zustand store | `useAuth()` → persisted | Unauthenticated UI |

---

## 2. API CONTRACTS

### 2.1 `/api/metrics/home` (NEW endpoint — cần backend build)

**Request:**
```
GET https://api.iai.one/metrics/home
Headers:
  Content-Type: application/json
  (no auth required — public endpoint)
```

**Response (200 OK):**
```typescript
interface HomeMetricsResponse {
  ok: true
  data: HomeMetrics
  cached_at: string  // ISO timestamp
  cache_ttl: number  // seconds (300 = 5 min)
}

interface HomeMetrics {
  total_posts: number           // e.g. 1247
  verified_posts: number        // e.g. 1173
  verification_rate: number     // e.g. 0.94 (= 94%)
  total_lessons: number         // e.g. 89
  total_members: number         // e.g. 432
  active_members_7d: number     // e.g. 156
  workflows_run: number         // e.g. 8432 (Flow Runtime stat)
  provenance_verified: number   // e.g. 743 (on-chain)
}
```

**Error Response (500 / timeout):**
```typescript
interface HomeMetricsError {
  ok: false
  error: string
}
```

**Frontend behavior on error:** Use FALLBACK_METRICS (see below).

---

### 2.2 `/api/posts` (EXISTING)

**Request:**
```
GET /api/posts?tab={tab}&limit={limit}&cursor={cursor}

tab: 'hot' | 'verified' | 'lesson' | 'debate' | 'chain'
limit: number (default 10, max 20)
cursor: string | undefined (pagination cursor)
```

**Response (existing interface):**
```typescript
interface PostsResponse {
  ok: boolean
  posts: Post[]
  cursor: string | null
}
```

**Confirmed working** — không thay đổi interface.

---

## 3. FRONTEND DATA FLOW

### 3.1 `lib/home-metrics.ts` (NEW FILE)

```typescript
// apps/web/lib/home-metrics.ts
// ═══════════════════════════════════════════════════════════════
//  IAI Homepage Metrics — fetch + cache + fallback
// ═══════════════════════════════════════════════════════════════

export interface HomeMetrics {
  total_posts: number
  verified_posts: number
  verification_rate: number
  total_lessons: number
  total_members: number
  active_members_7d: number
  workflows_run: number
  provenance_verified: number
}

// Static fallback — always render something meaningful
export const FALLBACK_METRICS: HomeMetrics = {
  total_posts: 1247,
  verified_posts: 1173,
  verification_rate: 0.94,
  total_lessons: 89,
  total_members: 432,
  active_members_7d: 156,
  workflows_run: 8432,
  provenance_verified: 743,
}

// In-memory cache (5 minutes)
let _cache: { data: HomeMetrics; expiresAt: number } | null = null
const CACHE_TTL_MS = 5 * 60 * 1000

export async function fetchHomeMetrics(): Promise<HomeMetrics> {
  // Return from cache if valid
  if (_cache && Date.now() < _cache.expiresAt) {
    return _cache.data
  }

  try {
    const res = await fetch('https://api.iai.one/metrics/home', {
      next: { revalidate: 300 }, // Next.js cache hint
    })
    if (!res.ok) return FALLBACK_METRICS

    const json = await res.json()
    if (!json.ok) return FALLBACK_METRICS

    _cache = { data: json.data, expiresAt: Date.now() + CACHE_TTL_MS }
    return json.data
  } catch {
    return FALLBACK_METRICS
  }
}

// Format helpers
export function formatMetricValue(value: number, format: 'count' | 'percent' | 'plus'): string {
  switch (format) {
    case 'count':
      return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value)
    case 'percent':
      return `${Math.round(value * 100)}%`
    case 'plus':
      return `${value.toLocaleString()}+`
  }
}
```

---

### 3.2 `lib/analytics.ts` (NEW FILE)

```typescript
// apps/web/lib/analytics.ts
// ═══════════════════════════════════════════════════════════════
//  IAI Analytics — homepage funnel events
// ═══════════════════════════════════════════════════════════════

export type AnalyticsEvent =
  | 'homepage_hero_view'
  | 'homepage_hero_cta_click'
  | 'homepage_trust_strip_view'
  | 'homepage_trust_badge_click'
  | 'homepage_action_panel_view'
  | 'homepage_create_post_click'
  | 'homepage_feed_tab_change'
  | 'homepage_feed_scroll'
  | 'homepage_kpi_bar_view'
  | 'homepage_module_card_click'
  | 'homepage_roadmap_view'
  | 'homepage_register_click'
  | 'homepage_login_click'
  | 'homepage_verify_click'

export interface AnalyticsPayload {
  event: AnalyticsEvent
  properties?: Record<string, string | number | boolean>
}

export function trackEvent(event: AnalyticsEvent, properties?: AnalyticsPayload['properties']): void {
  // Cloudflare Web Analytics beacon
  if (typeof window !== 'undefined' && 'cf' in window) {
    // @ts-expect-error — CF analytics global
    window.cf?.track?.(event, properties)
  }

  // Console in dev
  if (process.env.NODE_ENV === 'development') {
    console.debug('[IAI Analytics]', event, properties)
  }
}

// Specific event helpers
export const analytics = {
  heroCTAClick: (cta: 'register' | 'flow' | 'charter') =>
    trackEvent('homepage_hero_cta_click', { cta }),

  feedTabChange: (tab: string) =>
    trackEvent('homepage_feed_tab_change', { tab }),

  moduleCardClick: (moduleId: string, external: boolean) =>
    trackEvent('homepage_module_card_click', { module: moduleId, external }),

  registerClick: (source: string) =>
    trackEvent('homepage_register_click', { source }),
}
```

---

## 4. MOCK STRATEGY (Before API is ready)

### Phase 1: Static Mock (H2 → H3 early)
- Hardcode `FALLBACK_METRICS` trực tiếp trong component props
- Feed: API đã hoạt động → không cần mock
- Trust Strip count: Dùng `FALLBACK_METRICS.verified_posts`

### Phase 2: API Integration (H3 final)
- `fetchHomeMetrics()` trong Hero + KPIBar + TrustStrip
- Nếu API fail → auto fallback, không block render

### Phase 3: Real-time (Post-launch)
- Websocket hoặc SSE cho live metrics — **out of scope cho v1**

---

## 5. DATA CONTRACT — HERO STATS ROW

```typescript
// Mapping từ HomeMetrics → UI display
const HERO_STATS: StatDisplay[] = [
  {
    key: 'total_posts',
    label: 'Bài viết',
    format: 'plus',
    color: 'text-gold',
    fallback: '1,247+',
  },
  {
    key: 'verification_rate',
    label: 'Đã kiểm chứng',
    format: 'percent',
    color: 'text-jade',
    fallback: '94%',
  },
  {
    key: 'total_lessons',
    label: 'Bài học AI',
    format: 'plus',
    color: 'text-cyan-iai',
    fallback: '89+',
  },
  {
    key: 'total_members',
    label: 'Thành viên',
    format: 'plus',
    color: 'text-white/60',
    fallback: '432+',
  },
]
```

---

## 6. FEED DATA CONTRACT

### Tab → API param mapping
```typescript
const TAB_PARAMS: Record<FeedTab, { tab: string; description: string }> = {
  hot:      { tab: 'hot',      description: 'Trending posts' },
  verified: { tab: 'verified', description: 'AI-verified posts' },
  lesson:   { tab: 'lesson',   description: 'Lesson posts' },
  debate:   { tab: 'debate',   description: 'Debate posts' },
  chain:    { tab: 'chain',    description: 'On-chain posts' },
}
```

### Error handling (Feed)
```typescript
// Current behavior (FeedPage.tsx line 198-199):
// catch { /* API not ready — show empty state */ }

// H3 improvement: distinguish error from empty
try {
  const res = await api.posts.list(...)
  if (res.ok) { /* success */ }
  else { setError('API returned non-ok') }
} catch (err) {
  setError(err instanceof Error ? err.message : 'Network error')
  // Error state: show <FeedError onRetry={() => loadPosts(true)} />
}
```

---

## 7. AUTH DATA CONTRACT (Existing — Zustand)

```typescript
// apps/web/store/auth.ts (existing — do not modify)
interface AuthState {
  isAuth: boolean
  user: User | null
  logout: () => void
}

// Usage in homepage components:
const { isAuth, user } = useAuth()
```

**Rule:** Homepage components PHẢI handle cả 2 states (`isAuth=true` và `isAuth=false`). Never assume auth.

---

## 8. CACHING STRATEGY SUMMARY

| Data | Cache Layer | TTL | Invalidation |
|------|-------------|-----|--------------|
| HomeMetrics | In-memory + Next.js `revalidate` | 5 min | On-demand (không cần) |
| Feed posts | None (fresh per tab switch) | N/A | Tab change |
| User auth | Zustand + localStorage | Session | Logout |
| Static content | Build-time | Deploy | Re-deploy |

---

## 9. FALLBACK DECISION TREE

```
Homepage renders
  ├── Fetch HomeMetrics
  │   ├── Success → Use real data
  │   └── Fail → Use FALLBACK_METRICS (never crash)
  │
  ├── Fetch Feed
  │   ├── Success → Render posts
  │   ├── Empty → EmptyFeed component
  │   └── Error → FeedError component với retry button
  │
  └── Auth check
      ├── isAuth=true → PersonalizedGreeting + CreatePost
      └── isAuth=false → GuestHero + RegisterCTA
```

---

## 10. DELIVERABLES FOR H3 APPROVAL

- [ ] `lib/home-metrics.ts` implemented và tested locally
- [ ] `lib/analytics.ts` implemented
- [ ] `/api/metrics/home` stub hoặc mock endpoint trả FALLBACK_METRICS
- [ ] Feed error state implemented (thay vì silent catch)
- [ ] Analytics events firing trên CTA clicks (kiểm tra console dev)
- [ ] Fallback tested: disconnect API → hero vẫn render với fallback data

**Approve H3:** Comment `Approved H3` trên PR

---

*Document version: v1.0 | 2026-03-28 | feature/homepage-v1*
