# ECOSYSTEM_V1_MASTER_EXECUTION_BOARD

Date: 2026-04-03
Status: Weekly execution board from current state to ecosystem v1
Current estimated completion: 62%
Target: coherent `iai.one` ecosystem v1

## 1. Goal

Move the system from early production convergence to a coherent v1 where:

- `iai.one` is the clear constitutional root
- `home.iai.one` is the clear portal
- `app.iai.one` is the polished living product/community surface
- `api.iai.one` supports migration-safe community convergence
- `flow.iai.one` has a real minimum product shell
- first-wave legacy community migration is executable

## 2. Suggested Team Owners

- Product / final direction: `Tam Tran`
- Content: `Linh Nguyen`
- Design / UI: `Minh Pham`
- Frontend implementation: `An Vo`
- Backend / API: `Khoa Bui`
- SEO / metadata / analytics setup: `Huy Le`
- QA / verification: `Quynh Do`

## 3. Weekly Plan Overview

| Week | Theme | Main Outcome |
| --- | --- | --- |
| Week 1 | Root + App Direction Lock | `iai.one` root spec execution ready, `app.iai.one` UI scope locked |
| Week 2 | App UI Convergence I | nav/footer/homepage/feed refined and verified |
| Week 3 | App UI Convergence II + Public Pages | lessons/verify/profile/marketplace/studio/policies visually aligned |
| Week 4 | Portal + Root Publish Wave | `iai.one` root live on Wix, `home.iai.one` polished and domain-ready |
| Week 5 | API/Data Convergence | migration-safe contracts and data model locked |
| Week 6 | Legacy Community Migration Wave 1 | first import map, redirect map, migration messaging ready |
| Week 7 | Flow Product Minimum | `flow.iai.one` becomes more than scaffold |
| Week 8 | Hardening + Ecosystem v1 Gate | QA, SEO, analytics, monitoring, release decision |

## 4. Week-by-Week Execution Board

## Week 1 — Root + App Direction Lock

### Objectives

- freeze final root homepage content and Wix execution package
- freeze app UI refinement scope for the next 2 weeks
- eliminate ambiguity between root, portal, and app roles

### Tasks

- [x] Finalize `iai.one` Wix content and section order
- [x] Finalize Wix build checklist and owner board
- [x] Review all current `app.iai.one` public routes and group them into one visual system
- [x] Lock navigation principles for app
- [x] Lock footer principles for app
- [x] Lock homepage/feed refinement scope

### Outputs

- final root homepage build package
- app UI refinement checklist
- page inventory for app public surfaces

Week 1 artifacts created:

- `docs/planning/IAI_ONE_WIX_HOMEPAGE_SPEC_v1.md`
- `docs/planning/IAI_ONE_WIX_BUILD_CHECKLIST.md`
- `docs/planning/IAI_ONE_WIX_BUILD_CHECKLIST_OWNER_ETA.md`
- `docs/planning/IAI_ONE_WIX_BUILD_CHECKLIST_OWNER_ETA_v2_NAMES.md`
- `docs/planning/APP_IAI_ONE_PUBLIC_PAGE_INVENTORY.md`
- `docs/planning/APP_IAI_ONE_UI_REFINEMENT_CHECKLIST.md`

### Owners

- Tam Tran
- Linh Nguyen
- Minh Pham
- An Vo

### Gate

- no unresolved role confusion between `iai.one`, `home.iai.one`, and `app.iai.one`

## Week 2 — App UI Convergence I

### Objectives

- improve the most visible app surfaces first

### Tasks

- [ ] Refine `apps/web/components/ui/Navbar.tsx`
- [ ] Refine `apps/web/components/ui/Footer.tsx`
- [ ] Refine `apps/web/app/layout.tsx`
- [ ] Refine `apps/web/app/page.tsx`
- [ ] Refine `apps/web/app/FeedPage.tsx`
- [ ] Add clear legacy-community orientation cues
- [ ] Improve app-level metadata alignment

### Outputs

- cleaner ecosystem-aware nav/footer
- stronger homepage/feed hierarchy
- clearer migration messaging

### Owners

- Minh Pham
- An Vo
- Huy Le

### Gate

- app homepage feels like the primary living product, not a transitional shell

## Week 3 — App UI Convergence II + Public Pages

### Objectives

- align the rest of the public app surfaces into one product language

### Tasks

- [ ] Refine `apps/web/app/lessons/page.tsx`
- [ ] Refine `apps/web/app/verify/page.tsx`
- [ ] Refine `apps/web/app/u/[handle]/page.tsx`
- [ ] Refine `apps/web/app/post/[id]/page.tsx`
- [ ] Refine `apps/web/app/marketplace/page.tsx`
- [ ] Refine `apps/web/app/studio/page.tsx`
- [ ] Refine `apps/web/app/policies/page.tsx`
- [ ] Refine `apps/web/app/badges/page.tsx`
- [ ] Align metadata/OG/canonical behavior across these routes

### Outputs

- public pages feel visually coherent
- SEO/metadata consistency improved

### Owners

- Minh Pham
- An Vo
- Huy Le
- Quynh Do

### Gate

- app public page family looks like one system

## Week 4 — Portal + Root Publish Wave

### Objectives

- publish the constitutional root and stabilize portal presence

### Tasks

- [ ] Build/publish `iai.one` root homepage on Wix
- [ ] Validate all CTA routes from root
- [ ] Polish `apps/home` content and CTA clarity
- [ ] Verify or bind custom domain for `home.iai.one`
- [ ] Add portal analytics/monitoring basics
- [ ] Add migration guide destination for portal and root

### Outputs

- root homepage live in the correct role
- portal refined and publicly coherent

### Owners

- Tam Tran
- Linh Nguyen
- Minh Pham
- An Vo
- Huy Le
- Khoa Bui

### Gate

- root and portal no longer compete

## Week 5 — API/Data Convergence

### Objectives

- make backend safe for legacy community convergence

### Tasks

- [ ] Audit `workers/api/src/index.ts`
- [ ] Audit route ownership under `workers/api/src/routes/`
- [ ] Define migration-safe fields in `workers/api/src/types.ts`
- [ ] Extend `packages/database/schema.sql` as needed
- [ ] Create migration file(s) for imported content/user metadata
- [ ] Define import-safe internal/admin route contracts
- [ ] Clarify future split boundary with `api.flow.iai.one`

### Outputs

- backend contract for migration wave 1
- schema support for imported users/content

### Owners

- Khoa Bui
- Tam Tran

### Gate

- app and migration work can proceed without schema ambiguity

## Week 6 — Legacy Community Migration Wave 1

### Objectives

- prepare the first real migration pack from old community into the new app

### Tasks

- [ ] Inventory legacy users
- [ ] Inventory legacy public content
- [ ] Inventory legacy groups/programs if relevant
- [ ] Define import manifest format
- [ ] Define redirect map from old URLs to new app/portal URLs
- [ ] Define moderation/trust rules for imported content
- [ ] Create migration communication copy

### Outputs

- first-wave migration manifest
- redirect plan
- migration messaging pack

### Owners

- Tam Tran
- Linh Nguyen
- Khoa Bui
- Quynh Do

### Gate

- legacy migration can begin without creating parallel truths

## Week 7 — Flow Product Minimum

### Objectives

- turn `flow.iai.one` into a meaningful minimum product surface

### Tasks

- [ ] Define first real builder shell
- [ ] Add templates entry or starter workflows UI
- [ ] Add product navigation inside `apps/flow`
- [ ] Clarify handoff from `home.iai.one` and `app.iai.one`
- [ ] Define minimal API/runtime contract for upcoming `api.flow.iai.one`

### Outputs

- flow surface is no longer placeholder-only
- runtime boundary note ready for implementation

### Owners

- Minh Pham
- An Vo
- Khoa Bui

### Gate

- `flow.iai.one` has a clear usable minimum role

## Week 8 — Hardening + Ecosystem v1 Gate

### Objectives

- decide whether the ecosystem is ready to be called v1

### Tasks

- [ ] Full responsive QA across root/portal/app/flow
- [ ] Accessibility QA pass
- [ ] SEO/metadata/OG validation across surfaces
- [ ] Analytics and error tracking validation
- [ ] Custom domain validation across surfaces
- [ ] Rollback/runbook review
- [ ] Final product review against canonical docs

### Outputs

- v1 release readiness decision
- remaining backlog separated into post-v1 items

### Owners

- Quynh Do
- Huy Le
- Khoa Bui
- Tam Tran

### Gate

- release decision: `Go v1` or `Hold with blocker list`

## 5. Remaining Work Buckets

### Bucket A — Root / Portal

- Wix implementation
- portal polish
- custom domain checks
- migration guide

### Bucket B — App UI

- nav/footer refinement
- homepage/feed refinement
- public page family alignment
- SEO/metadata cleanup

### Bucket C — API / Data

- migration-safe models
- schema extensions
- import/admin routes
- route ownership clarity

### Bucket D — Legacy Community Migration

- inventory
- manifests
- redirects
- moderation/trust rules
- communication pack

### Bucket E — Flow

- real product shell
- templates/builder entry
- runtime API plan

### Bucket F — Hardening

- analytics
- monitoring
- a11y
- responsive QA
- runbooks

## 6. Definition Of Ecosystem v1

The ecosystem can be called v1 only when all are true:

- [ ] `iai.one` root live and role-correct
- [ ] `home.iai.one` live and role-correct
- [ ] `app.iai.one` polished enough for old/new community convergence
- [ ] `api.iai.one` safe for migration wave 1
- [ ] first-wave migration plan executable
- [ ] `flow.iai.one` usable beyond scaffold level
- [ ] all key public surfaces pass QA and metadata checks

## 7. Current Bottom Line

Current state:

- completed: `62%`
- remaining: `38%`

Recommended operating assumption:

- 8 focused weeks to reach a strong ecosystem v1 gate
- faster only if scope is kept disciplined and no new side-project surfaces are introduced
