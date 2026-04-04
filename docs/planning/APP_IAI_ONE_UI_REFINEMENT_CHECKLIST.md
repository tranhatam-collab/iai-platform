# APP_IAI_ONE_UI_REFINEMENT_CHECKLIST

Date: 2026-04-03
Status: Week 1 scope lock artifact
Target: `app.iai.one`

## 1. Purpose

Lock the UI refinement checklist for the next two execution weeks so the team can improve the app as one coherent product surface.

## 2. Refinement Principles

- `app.iai.one` must feel like the living product surface
- root and portal roles must remain external and clearly linked, not duplicated
- navigation must express the ecosystem map clearly
- public pages must share one visual language
- legacy community users must understand where they belong in the new system

## 3. Week 2 Checklist — App Shell + Homepage / Feed

### App Shell

- [ ] `apps/web/app/layout.tsx`
  - [ ] top system strip reflects final ecosystem wording
  - [ ] app description and metadata reflect app role, not root role
  - [ ] root/portal/flow links are clear and non-conflicting
- [ ] `apps/web/components/ui/Navbar.tsx`
  - [ ] primary nav hierarchy is clear
  - [ ] app destinations are prioritized over random module clutter
  - [ ] ecosystem links are present but secondary
  - [ ] mobile nav is clean and readable
- [ ] `apps/web/components/ui/Footer.tsx`
  - [ ] footer reinforces ecosystem map
  - [ ] legacy community orientation is visible
  - [ ] footer does not feel disconnected from navbar language

### Homepage / Feed

- [ ] `apps/web/app/page.tsx`
  - [ ] metadata/title/description aligned to app role
- [ ] `apps/web/app/FeedPage.tsx`
  - [ ] hero messaging distinguishes app from root and portal
  - [ ] CTA hierarchy is clean
  - [ ] legacy community note is clear but not noisy
  - [ ] feed top area feels intentional rather than transitional
  - [ ] sidebar language is updated to current ecosystem truth
- [ ] `apps/web/components/feed/PostCard.tsx`
  - [ ] core card hierarchy consistent with new app language
- [ ] `apps/web/components/feed/CreatePost.tsx`
  - [ ] create-post module matches feed visual hierarchy

### Week 2 Acceptance Gate

- [ ] app shell clearly expresses ecosystem routing
- [ ] homepage/feed feels like the primary living surface
- [ ] navigation/footer/homepage no longer send mixed signals

## 4. Week 3 Checklist — Public Page Family Alignment

### Knowledge / Trust Pages

- [ ] `apps/web/app/lessons/page.tsx`
- [ ] `apps/web/app/lessons/[slug]/page.tsx`
- [ ] `apps/web/app/verify/page.tsx`
- [ ] `apps/web/app/policies/page.tsx`
- [ ] `apps/web/app/badges/page.tsx`

Checks:

- [ ] section spacing consistent
- [ ] typography hierarchy consistent
- [ ] trust language consistent
- [ ] CTA patterns consistent

### Identity / Community Pages

- [ ] `apps/web/app/u/[handle]/page.tsx`
- [ ] `apps/web/app/post/[id]/page.tsx`
- [ ] `apps/web/app/login/page.tsx`
- [ ] `apps/web/app/register/page.tsx`

Checks:

- [ ] public identity feels native to the product
- [ ] old/new community positioning is understandable
- [ ] auth pages fit the same visual system

### Supporting Product Modules

- [ ] `apps/web/app/marketplace/page.tsx`
- [ ] `apps/web/app/studio/page.tsx`
- [ ] `apps/web/app/courses/[slug]/page.tsx`

Checks:

- [ ] modules feel integrated, not detached
- [ ] route-level metadata follows app role

### Metadata / Canonical Pass

- [ ] `apps/web/lib/seo.ts`
  - [ ] base keyword set reflects current ecosystem
  - [ ] OG/canonical helpers are consistent
- [ ] route metadata reviewed for homepage, lessons, verify, profile, post detail

### Week 3 Acceptance Gate

- [ ] public page family feels like one cohesive product
- [ ] metadata/OG/canonical behavior is consistent enough for external sharing and SEO

## 5. Out Of Scope For This Refinement Pass

- full API rewrite
- major data model migration work
- deep flow builder implementation
- root Wix implementation itself
- noos/cios buildout

## 6. Definition Of Refinement Done

This refinement phase is done when:

- [ ] app shell is ecosystem-aware and role-correct
- [ ] homepage/feed feels mature enough for migration convergence
- [ ] public pages share one visual system
- [ ] metadata and route language are aligned
- [ ] old community users can understand that `app.iai.one` is their destination
