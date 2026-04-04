# H6 — RELEASE READINESS CHECKLIST
**Branch:** `feature/homepage-v1`
**Date:** 2026-03-28
**Gate:** Requires "Approved H5"
**Output:** Go-live checklist + Rollback plan + Monitoring dashboard setup

---

## 1. TEST MATRIX

### 1.1 Functional Tests

| # | Test Case | Expected | Pass? |
|---|-----------|----------|-------|
| F1 | Homepage loads for guest (not logged in) | Hero visible, CTAs clickable, Feed loads | `[ ]` |
| F2 | Homepage loads for auth user | PersonalizedGreeting visible, CreatePost visible | `[ ]` |
| F3 | Feed tab switch: Hot → Verified | Posts reload, skeleton shows, new posts render | `[ ]` |
| F4 | Feed tab switch: Hot → On-Chain | Empty state shows correctly if no on-chain posts | `[ ]` |
| F5 | CreatePost submit (auth) | Post appears in feed, `onCreated` callback fires | `[ ]` |
| F6 | Register CTA click (guest) | Navigates to `/register` | `[ ]` |
| F7 | Flow Runtime module card click | Opens `flow.iai.one` in new tab | `[ ]` |
| F8 | Charter badge click | Opens `iai.one` in new tab | `[ ]` |
| F9 | ProvenanceBadge click (on-chain post) | Opens modal with hash/CID/txHash | `[ ]` |
| F10 | Verify link click on PostCard | Navigates to `/verify?postId=...&content=...` | `[ ]` |
| F11 | Load more button | Loads next page of posts, cursor advances | `[ ]` |
| F12 | API metrics fail (simulate) | Fallback values show, no crash | `[ ]` |
| F13 | Feed API fail (simulate) | Error state shows with retry button | `[ ]` |
| F14 | Logout | Hero shows guest version, CreatePost hidden | `[ ]` |
| F15 | User menu open/close (auth) | Dropdown shows/hides correctly | `[ ]` |

---

### 1.2 UX / Visual Tests

| # | Test Case | Expected | Pass? |
|---|-----------|----------|-------|
| U1 | Hero renders above fold on 1920×1080 | Full hero visible without scroll | `[ ]` |
| U2 | Hero renders above fold on 375×812 (iPhone SE) | Headline + at least 1 CTA visible | `[ ]` |
| U3 | Trust Strip visible on mobile | Horizontal scroll or wrapped correctly | `[ ]` |
| U4 | Sidebar hidden on mobile | `lg:hidden` working | `[ ]` |
| U5 | Skeleton loading state correct | Skeletons match real content shape | `[ ]` |
| U6 | Empty feed state correct | EmptyFeed renders per tab | `[ ]` |
| U7 | Gold/jade/cyan colors match design tokens | No color inconsistency | `[ ]` |
| U8 | Navbar fixed positioning correct | Doesn't overlap Hero, `pt-16` correct | `[ ]` |
| U9 | Module cards hover state visible | Card brightens on hover | `[ ]` |
| U10 | Focus rings visible (keyboard nav) | Tab through CTA buttons shows focus | `[ ]` |

---

### 1.3 Performance Tests

| # | Test | Target | Actual | Pass? |
|---|------|--------|--------|-------|
| P1 | Lighthouse Performance score (mobile) | >= 85 | ___ | `[ ]` |
| P2 | LCP (Lighthouse, mobile) | < 1.8s | ___ | `[ ]` |
| P3 | CLS (Lighthouse) | < 0.05 | ___ | `[ ]` |
| P4 | TBT (Lighthouse) | < 150ms | ___ | `[ ]` |
| P5 | FCP (Lighthouse) | < 1.2s | ___ | `[ ]` |
| P6 | Lighthouse SEO score | >= 95 | ___ | `[ ]` |
| P7 | Lighthouse Accessibility score | >= 90 | ___ | `[ ]` |
| P8 | Bundle delta from homepage changes | <= 20KB gz | ___ | `[ ]` |

**Command to run:**
```bash
# Install lighthouse globally or use npx
npx lighthouse https://app.iai.one --output=html --output-path=./lighthouse-report.html

# Or via Chrome DevTools → Lighthouse tab
```

---

### 1.4 Accessibility Tests

| # | Test Case | Expected | Pass? |
|---|-----------|----------|-------|
| A1 | All images have alt text | No missing alt attributes | `[ ]` |
| A2 | Color contrast ratio ≥ 4.5:1 (body text) | Passes WCAG AA | `[ ]` |
| A3 | Interactive elements keyboard accessible | Tab/Enter/Space work | `[ ]` |
| A4 | No keyboard trap | Tab flows through page correctly | `[ ]` |
| A5 | Screen reader: Hero heading hierarchy | H1 unique, H2 per section | `[ ]` |
| A6 | Skeleton loaders have aria-busy="true" | Screen reader announces loading | `[ ]` |
| A7 | External links announce "(opens in new tab)" | aria-label contains hint | `[ ]` |

---

### 1.5 Cross-Browser Tests

| Browser | Version | Test | Pass? |
|---------|---------|------|-------|
| Chrome | Latest | Full functional + visual | `[ ]` |
| Firefox | Latest | Full functional + visual | `[ ]` |
| Safari | Latest (macOS) | Full functional + visual | `[ ]` |
| Chrome Android | Latest | Mobile layout + touch | `[ ]` |
| Safari iOS | Latest | Mobile layout + touch | `[ ]` |

---

### 1.6 Fallback Tests

| # | Scenario | Expected | Pass? |
|---|----------|----------|-------|
| FB1 | `/api/metrics/home` returns 500 | Fallback metrics show, no error UI | `[ ]` |
| FB2 | `/api/metrics/home` times out (10s) | Fallback metrics show | `[ ]` |
| FB3 | `/api/posts` returns 500 | Feed error state with retry button | `[ ]` |
| FB4 | Slow 3G network | Skeletons show, no layout shift | `[ ]` |
| FB5 | JavaScript disabled | Graceful degradation (Next.js SSR) | `[ ]` |

---

## 2. KPI TRACKING VERIFICATION

Before go-live, confirm each KPI event fires:

| KPI | Event Name | How to verify |
|-----|-----------|---------------|
| Activation Rate | `homepage_register_click` | Click Register, check `console.debug` in dev |
| CTA CTR | `homepage_hero_cta_click` | Click each CTA button, verify event fires |
| Create-Post | `homepage_create_post_click` | Submit post, verify event |
| Verify Entry | `homepage_verify_click` | Click verify link, verify event |

**Dev verification command:**
```javascript
// In browser console (dev mode):
// Filter for "[IAI Analytics]" — should see events on interactions
```

**Cloudflare Analytics:** Verify events appear in CF dashboard 24h after deploy.

---

## 3. CI/CD CHECKS (Must Pass Before Merge)

```yaml
# .github/workflows/deploy-web.yml — current checks that must pass:
- lint: ESLint no errors
- typecheck: TypeScript no type errors
- build: next build completes successfully
- no bundle-size-exceeded flag

# Additional H6 checks to add (optional but recommended):
- lighthouse-ci: LCP < 1.8s, Performance >= 85
```

---

## 4. PRE-LAUNCH CHECKLIST

### 4.1 Code
- [ ] All TypeScript errors resolved (`tsc --noEmit` passes)
- [ ] No ESLint errors (`next lint` passes)
- [ ] `next build` completes without errors
- [ ] No `console.error` or unhandled Promise rejections in dev
- [ ] No hardcoded secrets or API keys in code

### 4.2 Content
- [ ] Hero copy final (sign-off from product owner)
- [ ] All CTA labels final
- [ ] Trust Strip labels final
- [ ] Module card descriptions final
- [ ] Roadmap phases final

### 4.3 Infrastructure
- [ ] `app.iai.one` DNS pointing to CF Pages
- [ ] CF Pages deployment triggers on `main` branch merge
- [ ] Environment variables set in CF Pages dashboard:
  - `NEXT_PUBLIC_API_URL=https://api.iai.one`
  - `NEXT_PUBLIC_SITE_NAME=IAI — Intelligence · Artistry · International`
  - `NEXT_PUBLIC_SITE_URL=https://app.iai.one`
- [ ] Cloudflare Web Analytics enabled for `app.iai.one`
- [ ] Sentry (or equivalent) error tracking configured

### 4.4 SEO
- [ ] `robots.txt` accessible: `https://app.iai.one/robots.txt`
- [ ] `sitemap.xml` accessible: `https://app.iai.one/sitemap.xml`
- [ ] OG image accessible: `https://app.iai.one/og-image.png` (1200x630)
- [ ] JSON-LD schemas valid: test at `search.google.com/test/rich-results`

---

## 5. ROLLBACK PLAN

### 5.1 When to Rollback
Trigger rollback if any of these occur post-deploy:
- Homepage 5xx error rate > 1% (5 min sustained)
- LCP regression > 3.0s (sustained)
- JavaScript errors spike > normal baseline
- CTA CTR drops > 50% vs baseline (measured after 2h)

### 5.2 How to Rollback

**CF Pages rollback (fastest — < 2 min):**
```
1. Go to: CF Pages Dashboard → iai-platform project
2. Deployments tab → find previous successful deployment
3. Click "Rollback to this deployment"
4. Confirm — live in ~90 seconds
```

**Git rollback (if CF rollback fails):**
```bash
# Create revert commit:
git revert HEAD --no-edit
git push origin main

# This triggers new CF Pages deploy with previous code
```

### 5.3 Rollback Communication
```
Slack/Discord message template:
---
[ROLLBACK] app.iai.one homepage v1
Reason: {reason}
Action: Rolled back to deployment {id} at {time}
Status: ✓ Stable (or ⚠ Investigating)
---
```

---

## 6. POST-LAUNCH MONITORING

### 6.1 First 30 Minutes
- [ ] Homepage loads correctly on mobile + desktop
- [ ] No 5xx errors in CF Pages logs
- [ ] Feed loading without errors
- [ ] CTA buttons working
- [ ] Trust indicators displaying

### 6.2 First 24 Hours
- [ ] KPI tracking events appearing in analytics
- [ ] Lighthouse score stable (no regression)
- [ ] No new JavaScript errors in Sentry
- [ ] Cloudflare Analytics showing pageviews

### 6.3 First Week
- [ ] Activation Rate measured: target >= 35%
- [ ] CTA CTR measured: target >= 18%
- [ ] Create-Post conversion measured: target >= 12%
- [ ] Verify Flow Entry measured: target >= 8%
- [ ] LCP P75 measured: target < 1.8s

### 6.4 Dashboard Links (to set up)
```
Cloudflare Analytics: dash.cloudflare.com → Analytics → app.iai.one
Error tracking: sentry.io → iai-platform → web project
CF Pages logs: dash.cloudflare.com → Pages → iai-platform → Deployments
```

---

## 7. GO-LIVE DECISION

**GO condition:** All sections below are ✓
```
[ ] All P0 functional tests pass (F1-F15)
[ ] All UX tests pass (U1-U10)
[ ] Lighthouse scores meet targets (P1-P8)
[ ] All fallback tests pass (FB1-FB5)
[ ] CI/CD green on feature/homepage-v1
[ ] Rollback plan confirmed with team
[ ] Monitoring links set up
[ ] Product Owner final sign-off: "Approved H6 — Go Live"
```

**NO-GO conditions:**
- Any P0 functional test failing
- Lighthouse LCP > 2.5s
- TypeScript or build errors
- Trust display rules not implemented (H5 issues)

---

## 8. POST-LAUNCH NEXT STEPS

After homepage v1 launches and KPIs measured (1 week):

1. **KPI review meeting** — review against targets
2. **Phase 2 decision** — if Activation >= 35% → begin Social Seed Phase (Phase 2)
3. **H7 (post-launch)** — A/B test CTA copy based on conversion data
4. **API metrics** — build real `/api/metrics/home` endpoint (replace mock)
5. **Flow Runtime integration** — embed live workflow stats in KPI Bar

---

*Document version: v1.0 | 2026-03-28 | feature/homepage-v1*
