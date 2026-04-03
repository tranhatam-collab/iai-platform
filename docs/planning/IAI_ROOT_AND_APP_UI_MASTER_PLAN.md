# IAI_ROOT_AND_APP_UI_MASTER_PLAN

Date: 2026-04-03
Status: Master plan for next design and product refinement phase
Scope:

- `iai.one` root homepage / charter system
- `app.iai.one` UI refinement

## 1. Goal

Complete the public-facing system so the ecosystem feels intentional and finished.

This phase must make two surfaces unmistakably clear:

- `iai.one` = constitutional root and trust authority
- `app.iai.one` = living user/community product

## 2. Root Problem To Solve

Right now the architecture is clearer than the visual/product experience.

The remaining gap is not “what is the system?”

The gap is:

- how the root homepage presents the system with authority
- how the app feels polished, coherent, and mature enough to absorb the old community

## 3. Track A - `iai.one` Root Homepage System

### 3.1 Job of Root Homepage

`iai.one` must:

- define what IAI is
- hold the constitutional voice
- establish trust boundaries
- route people upward into the portal, not downward into confusion

`iai.one` must not:

- become the app
- become the portal
- become a feed
- become a generic startup marketing site

### 3.2 Root Homepage Required Sections

1. Hero
2. Constitutional position
3. What IAI defines
4. Ecosystem overview
5. Trust and boundaries
6. Route to portal and system surfaces
7. Footer authority statement

### 3.3 Root Homepage Deliverables

- final content outline for Wix
- page-by-page IA for root domain
- CTA hierarchy to `home.iai.one`
- visual direction for constitutional homepage
- migration of wrong legacy sections away from root

### 3.4 Root Homepage Technical / Content Tasks

- [ ] create final root IA doc
- [ ] define root nav model
- [ ] define exact CTA destinations
- [ ] define copy blocks for hero and trust sections
- [ ] define redirect mapping for any old root pages that should move to portal/app/docs
- [ ] define SEO metadata strategy for root authority positioning

## 4. Track B - `app.iai.one` UI Refinement

### 4.1 Goal

Make `app.iai.one` feel like the mature public/community product surface of the ecosystem.

### 4.2 Areas To Refine

#### Navigation

Need:

- stronger primary nav hierarchy
- clearer distinction between public product, learning, verification, and member identity
- clearer handoff to `flow.iai.one` and `iai.one`

#### Homepage / Feed Surface

Need:

- cleaner visual hierarchy
- stronger portal/app distinction
- more disciplined CTA structure
- improved spacing, card consistency, and section transitions

#### Public Page Cohesion

Need:

- lessons, verify, profile, badges, marketplace, policies, studio to feel like one product system
- reduce visual drift across pages

#### Legacy Community Readiness

Need:

- explicit legacy user orientation
- migration-friendly copy in the right places
- future-safe placeholders for groups/programs/community structure

#### SEO / Metadata / OG

Need:

- consistency across pages
- proper route metadata
- stronger social previews and canonical data

### 4.3 App UI Deliverables

- refined nav system
- refined footer system
- refined homepage/feed layout pass
- public page consistency pass
- metadata/SEO pass
- legacy community orientation pass

## 5. Repo-Level Focus For App UI Work

Primary files likely involved:

- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`
- `apps/web/app/FeedPage.tsx`
- `apps/web/components/ui/Navbar.tsx`
- `apps/web/components/ui/Footer.tsx`
- `apps/web/components/feed/PostCard.tsx`
- `apps/web/components/feed/CreatePost.tsx`
- `apps/web/app/lessons/page.tsx`
- `apps/web/app/verify/page.tsx`
- `apps/web/app/u/[handle]/page.tsx`
- `apps/web/lib/seo.ts`
- `apps/web/lib/config.ts`

## 6. Recommended Execution Sequence

1. finalize root `iai.one` homepage IA and content plan
2. refine `app.iai.one` navigation and footer first
3. refine `app.iai.one` homepage/feed visual system
4. align public page templates and metadata
5. add legacy community orientation layer
6. run responsive/SEO/accessibility polish pass

## 7. Definition Of Done For This Phase

This phase is complete only if:

- [ ] `iai.one` clearly reads as the root constitutional authority
- [ ] `home.iai.one` and `iai.one` no longer compete in role
- [ ] `app.iai.one` feels like the primary living product
- [ ] app navigation and footer clearly express the ecosystem map
- [ ] public pages share one coherent visual language
- [ ] legacy users can understand where they belong in the new system
- [ ] root/app messaging and CTA hierarchy no longer conflict

## 8. Final Directive

The next quality jump will not come from adding random new modules.

It will come from making the root authority and the living app feel fully intentional, coherent, and ready for migration into the complete `iai.one` ecosystem.
