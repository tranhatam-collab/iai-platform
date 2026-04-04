# APP_IAI_ONE_PUBLIC_PAGE_INVENTORY

Date: 2026-04-03
Status: Week 1 scope lock artifact
Target: `app.iai.one`

## 1. Purpose

Inventory all public-facing and public-adjacent routes in `apps/web/app` so the UI refinement phase can be executed as one coherent system rather than as isolated page edits.

## 2. Canonical App Role

`app.iai.one` is:

- the living product surface
- the merged community destination
- the public-facing application layer for content, identity, lessons, verification, and collaboration

It is not:

- the constitutional root
- the portal
- the workflow builder

## 3. Route Inventory

### Group A — Core Entry / Feed

| Route | File | Role | Priority |
| --- | --- | --- | --- |
| `/` | `apps/web/app/page.tsx` | canonical homepage / entry into app surface | P0 |
| client feed shell | `apps/web/app/FeedPage.tsx` | feed, hero, tabs, sidebar, create-post area | P0 |

### Group B — Identity / Access

| Route | File | Role | Priority |
| --- | --- | --- | --- |
| `/login` | `apps/web/app/login/page.tsx` | login entry | P1 |
| `/register` | `apps/web/app/register/page.tsx` | registration entry | P1 |
| `/auth/callback` | `apps/web/app/auth/callback/page.tsx` | auth return handling | P2 |

### Group C — Content / Learning / Verification

| Route | File | Role | Priority |
| --- | --- | --- | --- |
| `/lessons` | `apps/web/app/lessons/page.tsx` | public lesson index | P1 |
| `/lessons/[slug]` | `apps/web/app/lessons/[slug]/page.tsx` | lesson detail | P1 |
| `/verify` | `apps/web/app/verify/page.tsx` | verification flow / public trust utility | P1 |

### Group D — Community / Profile / Post

| Route | File | Role | Priority |
| --- | --- | --- | --- |
| `/u/[handle]` | `apps/web/app/u/[handle]/page.tsx` | public profile | P1 |
| `/post/[id]` | `apps/web/app/post/[id]/page.tsx` | public post detail | P1 |

### Group E — Product Modules / Supporting Surfaces

| Route | File | Role | Priority |
| --- | --- | --- | --- |
| `/marketplace` | `apps/web/app/marketplace/page.tsx` | marketplace module | P2 |
| `/studio` | `apps/web/app/studio/page.tsx` | studio surface | P2 |
| `/badges` | `apps/web/app/badges/page.tsx` | badges/trust display | P2 |
| `/policies` | `apps/web/app/policies/page.tsx` | public policy / system trust docs inside app | P2 |
| `/courses/[slug]` | `apps/web/app/courses/[slug]/page.tsx` | course player/detail | P2 |

## 4. Shared Shell Files

These files shape the whole public product and must be treated as system-level refinement points.

| File | Role | Priority |
| --- | --- | --- |
| `apps/web/app/layout.tsx` | root layout, metadata, top system strip | P0 |
| `apps/web/components/ui/Navbar.tsx` | primary app navigation | P0 |
| `apps/web/components/ui/Footer.tsx` | app footer, ecosystem routing, migration notice | P0 |
| `apps/web/lib/seo.ts` | metadata helpers | P1 |
| `apps/web/lib/config.ts` | surface URLs and public config | P1 |

## 5. Shared Feed Components

| File | Role | Priority |
| --- | --- | --- |
| `apps/web/components/feed/PostCard.tsx` | core content card language | P1 |
| `apps/web/components/feed/CreatePost.tsx` | creation entry for authenticated users | P1 |

## 6. Visual System Grouping

### System 1 — App Shell

Includes:

- layout
- navbar
- footer
- metadata

Goal:

- clear app identity
- clear ecosystem routing
- no root/portal confusion

### System 2 — Feed / Entry Experience

Includes:

- homepage metadata
- feed hero
- feed tabs
- feed cards
- sidebar

Goal:

- feel like the living center of the product and community

### System 3 — Public Knowledge / Trust Pages

Includes:

- lessons
- lesson detail
- verify
- policies
- badges

Goal:

- unify education, trust, and public proof surfaces

### System 4 — Identity / Community Pages

Includes:

- login
- register
- profile
- post detail

Goal:

- make identity and public participation feel native to the same ecosystem

### System 5 — Product Module Pages

Includes:

- marketplace
- studio
- course detail

Goal:

- make supporting modules feel like parts of the same product family, not detached experiments

## 7. Refinement Priority Order

1. App shell (`layout`, `Navbar`, `Footer`)
2. Homepage/feed (`page`, `FeedPage`)
3. Lessons / Verify / Profile / Post detail
4. Marketplace / Studio / Policies / Badges / Courses
5. Login / Register polish pass
6. Cross-page metadata/OG/canonical pass

## 8. Week Mapping

### Week 2 focus

- App shell
- Homepage/feed

### Week 3 focus

- Public pages
- Supporting modules
- Metadata consistency

## 9. Definition Of Scope Lock

Week 1 scope lock for `app.iai.one` is complete when:

- [ ] all public route families are inventoried
- [ ] shell files are identified
- [ ] priorities are assigned
- [ ] week 2 and week 3 refinement boundaries are clear
