# H4 — SEO, SCHEMA & PERFORMANCE SPEC
**Branch:** `feature/homepage-v1`
**Date:** 2026-03-28
**Gate:** Requires "Approved H3"
**Output:** SEO checklist + JSON-LD schemas + Perf budget + Lighthouse baseline

---

## 1. SEO SPEC

### 1.1 Meta Tags (`apps/web/app/page.tsx`)

**Current (to keep):**
```typescript
export const metadata: Metadata = {
  title: 'IAI — Giáo dục bằng sự thật',
  description: 'Feed cộng đồng nơi mọi bài viết được AI kiểm chứng...',
}
```

**H4 Enhancement (replace with):**
```typescript
export const metadata: Metadata = {
  title: 'IAI App — Constitutional AI for Real-World Coordination',
  description:
    'Build, run, and verify AI workflows with charter guardrails and provenance by default. Join the IAI community — where every post is AI-verified.',
  keywords: [
    'IAI', 'Constitutional AI', 'fact-check', 'AI verification',
    'giáo dục', 'blockchain', 'provenance', 'charter', 'iai.one',
    'workflow AI', 'community AI', 'kiểm chứng AI'
  ],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    url: 'https://app.iai.one',
    siteName: 'IAI — Intelligence · Artistry · International',
    title: 'IAI — Constitutional AI for Real-World Coordination',
    description: 'No one stands above. No one falls below.',
    images: [{
      url: 'https://app.iai.one/og-image.png',
      width: 1200,
      height: 630,
      alt: 'IAI — Constitutional AI Platform',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@iai_one',
    creator: '@iai_one',
    title: 'IAI — Constitutional AI for Real-World Coordination',
    description: 'No one stands above. No one falls below.',
    images: ['https://app.iai.one/og-twitter.png'],
  },
  alternates: {
    canonical: 'https://app.iai.one',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

---

### 1.2 JSON-LD Schemas (`apps/web/app/layout.tsx`)

Thêm vào `<head>` của layout, sau `<body>` open tag hoặc trong `<head>` via Next.js:

#### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "IAI — Intelligence · Artistry · International",
  "alternateName": "IAI.ONE",
  "url": "https://iai.one",
  "logo": "https://app.iai.one/logo.png",
  "description": "Constitutional AI platform for real-world coordination. Charter-based AI governance with provenance and verification by default.",
  "foundingDate": "2024",
  "sameAs": [
    "https://iai.one",
    "https://app.iai.one",
    "https://flow.iai.one",
    "https://noos.iai.one"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@iai.one"
  }
}
```

#### WebSite Schema (với SearchAction)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "IAI App",
  "url": "https://app.iai.one",
  "description": "IAI App — Constitutional AI for Real-World Coordination",
  "inLanguage": ["vi", "en"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://app.iai.one/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

#### FAQPage Schema (homepage-level)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "IAI là gì?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IAI là Constitutional AI OS — nền tảng điều phối AI có trách nhiệm, nơi mọi workflow đều có charter guardrails và provenance by default."
      }
    },
    {
      "@type": "Question",
      "name": "IAI Verify hoạt động như thế nào?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mỗi bài viết được Claude AI phân tích và gắn nhãn sự thật. Nguồn dẫn minh bạch, kết quả lưu trên blockchain."
      }
    },
    {
      "@type": "Question",
      "name": "Làm thế nào để tham gia IAI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Đăng ký tại app.iai.one/register. Miễn phí. Email xác nhận sẽ được gửi ngay."
      }
    }
  ]
}
```

**Implementation:**
```tsx
// apps/web/app/layout.tsx
// Thêm vào <head> section:

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(ORGANIZATION_SCHEMA)
  }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(WEBSITE_SCHEMA)
  }}
/>
```

---

## 2. PERFORMANCE BUDGET

### 2.1 Core Web Vitals Targets

| Metric | Target | Threshold | Tool |
|--------|--------|-----------|------|
| LCP (Largest Contentful Paint) | < 1.8s | < 2.5s acceptable | Lighthouse + CF Analytics |
| FID / INP (Interaction to Next Paint) | < 100ms | < 200ms acceptable | Chrome UX Report |
| CLS (Cumulative Layout Shift) | < 0.05 | < 0.1 acceptable | Lighthouse |
| TBT (Total Blocking Time) | < 150ms | < 300ms acceptable | Lighthouse |
| FCP (First Contentful Paint) | < 1.2s | < 1.8s acceptable | Lighthouse |
| TTFB (Time to First Byte) | < 200ms | < 600ms acceptable | Network tab |

### 2.2 Bundle Size Budget

| Asset | Current (est.) | Budget | Action if exceeded |
|-------|----------------|--------|-------------------|
| Initial JS bundle | ~180KB gz | <= 200KB gz | Code split new components |
| Homepage JS delta | 0 (no new pages) | <= 20KB gz | Lazy load non-critical sections |
| CSS (global) | ~15KB gz | <= 20KB gz | Purge unused Tailwind |
| Hero image (og) | N/A | <= 150KB | WebP format, srcset |
| Logo (SVG) | ~2KB | <= 5KB | OK |
| Fonts | ~45KB gz | <= 60KB | Subset if needed |

### 2.3 Image Optimization

| Image | Format | Size | Loading |
|-------|--------|------|---------|
| OG image (`/og-image.png`) | PNG → WebP | <= 150KB | N/A (meta only) |
| User avatars (feed) | Auto (next/image) | Responsive | `lazy` |
| Logo | SVG inline | < 5KB | Eager (above fold) |

**Rule:** Không dùng `<img>` trực tiếp cho ảnh content — phải dùng `next/image`.

---

## 3. LOADING STRATEGY

### 3.1 Above the Fold (Critical Path)
```
Priority: Eager load
├── Navbar (always visible)
├── Hero (immediate render — static content, no API wait)
├── TrustStrip (static fallback instantly, API updates after)
└── Feed Tab Nav (static)
```

### 3.2 Below the Fold (Deferred)
```
Priority: Lazy load
├── Feed posts (cursor pagination — load on scroll)
├── KPIBar (async fetch, skeleton while loading)
├── ModuleCards (lazy — not above fold)
└── Roadmap (lazy)
```

### 3.3 React Suspense Boundaries

```tsx
// FeedPage layout:
<div className="grid ...">
  <div> {/* Main column */}
    <Hero />           {/* No suspense — renders instantly */}
    <TrustStrip />     {/* No suspense — has instant fallback */}
    <ActionPanel />    {/* No suspense — sync with auth */}
    <TabNav />         {/* Static */}
    <Suspense fallback={<PostSkeletons count={3} />}>
      <FeedContent tab={tab} />
    </Suspense>
  </div>
  <aside> {/* Sidebar */}
    <Suspense fallback={<KPIBarSkeleton />}>
      <KPIBar />
    </Suspense>
    <ModuleCards />    {/* Static — no suspense */}
    <RoadmapBlock />   {/* Static — no suspense */}
  </aside>
</div>
```

---

## 4. PERFORMANCE CHECKLIST

### 4.1 JavaScript
- [ ] Không có synchronous blocking scripts trong `<head>`
- [ ] `next/script` dùng `strategy="afterInteractive"` cho analytics
- [ ] Không import library nặng (lodash, moment, etc.) — dùng native
- [ ] Dynamic import cho non-critical components nếu bundle delta > 10KB

### 4.2 CSS
- [ ] Tailwind CSS purge đúng config — không có unused styles
- [ ] Không có `@import` trong CSS (dùng layer system)
- [ ] Critical CSS inline (Next.js tự xử lý)

### 4.3 Fonts
- [ ] `display: 'swap'` cho web fonts
- [ ] Preconnect đến font CDN nếu dùng Google Fonts
- [ ] Subset fonts nếu chỉ dùng Latin + Vietnamese

### 4.4 Images
- [ ] Tất cả ảnh content qua `next/image`
- [ ] OG image: `1200x630`, WebP, <= 150KB
- [ ] SVG inline cho icons (không dùng `<img>` cho icons)

### 4.5 Network
- [ ] CF Pages Edge Network — không thêm external API calls in critical path
- [ ] `/api/metrics/home` call là non-blocking (fallback ngay)
- [ ] Feed API call sau hydration (không block SSR)

---

## 5. SEO CHECKLIST

### 5.1 Technical SEO
- [ ] Canonical URL set: `https://app.iai.one`
- [ ] `robots.txt` allow crawling: `apps/web/public/robots.txt`
- [ ] `sitemap.xml` có homepage entry: `apps/web/app/sitemap.ts`
- [ ] `manifest.json` đầy đủ (có sẵn)
- [ ] `favicon.ico` đúng (có sẵn)
- [ ] Không có broken internal links

### 5.2 Content SEO
- [ ] H1 tag duy nhất trên homepage (`Constitutional AI...`)
- [ ] H2 tags có trên mỗi major section
- [ ] Alt text đầy đủ trên tất cả `<img>` tags
- [ ] Internal links hợp lý (Feed → posts → `/post/[id]`)
- [ ] External links có `rel="noopener noreferrer"`

### 5.3 Structured Data
- [ ] Organization schema valid (test với Rich Results Test)
- [ ] WebSite schema valid
- [ ] FAQPage schema valid (nếu include)
- [ ] Không có schema errors trong Google Search Console

### 5.4 Internationalization
- [ ] `<html lang="vi">` set (có sẵn)
- [ ] `hreflang` nếu có English version (future scope — skip v1)
- [ ] Nội dung tiếng Việt encode đúng UTF-8

---

## 6. LIGHTHOUSE BASELINE TARGETS

```
Lighthouse audit URL: https://app.iai.one
Device: Mobile (primary) + Desktop
Mode: Navigation

Target scores:
├── Performance:    >= 85
├── Accessibility:  >= 90
├── Best Practices: >= 90
└── SEO:            >= 95
```

**Baseline measurement:** Chạy Lighthouse trước khi merge H4 PR. Document kết quả trong PR description.

---

## 7. `robots.txt` (confirm / update)

```
# apps/web/public/robots.txt
User-agent: *
Allow: /

User-agent: *
Disallow: /api/
Disallow: /_next/

Sitemap: https://app.iai.one/sitemap.xml
```

---

## 8. `sitemap.ts` (create if not exists)

```typescript
// apps/web/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://app.iai.one',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: 'https://app.iai.one/lessons',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://app.iai.one/verify',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://app.iai.one/marketplace',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ]
}
```

---

## 9. DELIVERABLES FOR H4 APPROVAL

- [ ] Updated `metadata` trong `page.tsx`
- [ ] JSON-LD schemas implemented trong `layout.tsx`
- [ ] `sitemap.ts` created hoặc confirmed existing
- [ ] `robots.txt` verified
- [ ] Lighthouse baseline run và documented (screenshot in PR)
- [ ] All Performance Checklist items pass
- [ ] All SEO Checklist items pass

**Approve H4:** Comment `Approved H4` trên PR

---

*Document version: v1.0 | 2026-03-28 | feature/homepage-v1*
