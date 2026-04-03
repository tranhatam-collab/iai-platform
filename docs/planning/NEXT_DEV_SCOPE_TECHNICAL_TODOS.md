# NEXT_DEV_SCOPE_TECHNICAL_TODOS

Date: 2026-04-03
Status: Execution-ready technical todo map
Depends on:

- `NEXT_DEV_SCOPE.md`
- `IAI_ONE_ECOSYSTEM_CANONICAL_2026.md`
- `DOMAIN_MIGRATION_CHECKLIST.md`

## 1. Purpose

Translate the approved next phase into concrete implementation work mapped to the actual repo structure.

## 2. Current Repo Reality

Current implementation surfaces in this repo:

- `apps/web` = active Next.js app currently aligned to `app.iai.one`
- `workers/api` = active Cloudflare Worker backend aligned to `api.iai.one`
- `apps/iai-one-dev` = static prototype/reference material, not a canonical deploy workspace
- no dedicated production workspace yet for `home.iai.one`
- no dedicated production workspace yet for `flow.iai.one`

Immediate implication:

- next dev must decide whether to create `apps/home` and `apps/flow` as first-class workspaces
- until those exist, `apps/iai-one-dev` may be used only as reference source, not as the final architecture

## 3. Repo-Level Technical Decision To Execute First

### Workspace Creation Decision

- [ ] Create `apps/home/` as the canonical workspace for `home.iai.one`
- [ ] Create `apps/flow/` as the canonical workspace for `flow.iai.one`
- [ ] Keep `apps/web/` as the canonical workspace for `app.iai.one`
- [ ] Keep `workers/api/` as the canonical workspace for `api.iai.one`
- [ ] Decide whether `apps/iai-one-dev/` becomes:
  - [ ] reference-only
  - [ ] archived
  - [ ] partially mined for copy/assets/layout ideas

Preferred repo target after this decision:

- `apps/home` -> `home.iai.one`
- `apps/web` -> `app.iai.one`
- `apps/flow` -> `flow.iai.one`
- `workers/api` -> `api.iai.one`
- future `workers/flow-api` or equivalent -> `api.flow.iai.one`

## 4. Technical Todos By Surface

### 4.1 `home.iai.one` -> new `apps/home`

Status now:

- no dedicated workspace exists yet

Technical todos:

- [ ] Create workspace folder: `apps/home/`
- [ ] Add `apps/home/package.json`
- [ ] Add `apps/home/wrangler.toml`
- [ ] Add `apps/home/next.config.mjs` or static site config depending on chosen stack
- [ ] Add `apps/home/app/` if using Next.js App Router
- [ ] Add `apps/home/public/`
- [ ] Add `apps/home/tsconfig.json`
- [ ] Add `apps/home/postcss.config.mjs`
- [ ] Add `apps/home/tailwind.config.ts` if using Tailwind

Minimum first file map if Next.js:

- [ ] `apps/home/app/layout.tsx`
- [ ] `apps/home/app/page.tsx`
- [ ] `apps/home/app/globals.css`
- [ ] `apps/home/components/` for portal sections
- [ ] `apps/home/lib/` for route maps and static config

Reference sources in repo:

- `apps/iai-one-dev/index.html`
- `apps/iai-one-dev/CONTENT.md`
- `docs/homepage/IAI_ONE_HOMEPAGE_MASTER_COPY.md`

Output of this stream:

- deployable workspace for `home.iai.one`

### 4.2 `app.iai.one` -> existing `apps/web`

Status now:

- already live and production-deployed
- already contains homepage/feed, lessons, verify, login/register, profile, marketplace, badges, studio

Technical todos:

- [ ] Review and lock route ownership in `apps/web/app/`
- [ ] Confirm `app/page.tsx` remains the canonical public homepage/feed
- [ ] Review `app/layout.tsx` for merged-community nav assumptions
- [ ] Extend `components/ui/Navbar.tsx` for future legacy-community entry points
- [ ] Extend `components/ui/Footer.tsx` to reflect canonical ecosystem routing
- [ ] Add or update public orientation pages if needed inside `apps/web/app/`
- [ ] Audit existing route list under `apps/web/app/` for community migration readiness

Files/folders to review first:

- [ ] `apps/web/app/page.tsx`
- [ ] `apps/web/app/FeedPage.tsx`
- [ ] `apps/web/app/layout.tsx`
- [ ] `apps/web/components/ui/Navbar.tsx`
- [ ] `apps/web/components/ui/Footer.tsx`
- [ ] `apps/web/components/feed/PostCard.tsx`
- [ ] `apps/web/components/feed/CreatePost.tsx`
- [ ] `apps/web/app/u/[handle]/`
- [ ] `apps/web/app/post/[id]/`
- [ ] `apps/web/app/lessons/`
- [ ] `apps/web/lib/api.ts`

Community convergence tasks in `apps/web`:

- [ ] Define where legacy community explanation lives in UI
- [ ] Add migration-safe copy for old users
- [ ] Identify pages needed for public community archive/import views
- [ ] Define groups/program placeholders or routes if not yet implemented
- [ ] Define user/profile fields needed for migrated community identity

Output of this stream:

- `apps/web` becomes explicitly ready to absorb the old community

### 4.3 `api.iai.one` -> existing `workers/api`

Status now:

- active worker already serving auth, posts, lessons, verify, media, marketplace, courses, and more

Technical todos:

- [ ] Audit route ownership in `workers/api/src/index.ts`
- [ ] Audit route modules under `workers/api/src/routes/`
- [ ] Confirm canonical ownership for:
  - [ ] users
  - [ ] auth
  - [ ] posts
  - [ ] lessons
  - [ ] verify
  - [ ] groups/programs if to be added next
- [ ] Define migration-safe import contract for legacy community users/content
- [ ] Add missing route modules if migration needs them
- [ ] Verify `workers/api/src/types.ts` can support migrated content and user metadata
- [ ] Confirm D1 schema alignment in `packages/database/schema.sql` and `migration_v2.sql`

Files/folders to review first:

- [ ] `workers/api/src/index.ts`
- [ ] `workers/api/src/types.ts`
- [ ] `workers/api/src/routes/users.ts`
- [ ] `workers/api/src/routes/posts.ts`
- [ ] `workers/api/src/routes/lessons.ts`
- [ ] `workers/api/src/routes/verify.ts`
- [ ] `workers/api/src/lib/auth.ts`
- [ ] `workers/api/wrangler.toml`
- [ ] `packages/database/schema.sql`
- [ ] `packages/database/migration_v2.sql`
- [ ] `packages/database/seeds/phase2-social-community.sql`

Potential new API deliverables in this phase:

- [ ] migration/import admin route contract
- [ ] legacy profile mapping fields
- [ ] groups/program stubs or initial schema contract
- [ ] public content import flags / source markers

Output of this stream:

- `workers/api` supports community convergence without breaking app stability

### 4.4 `flow.iai.one` -> new `apps/flow`

Status now:

- no dedicated production workspace exists yet in repo
- several planning/spec docs exist under `docs/flow/`

Technical todos:

- [ ] Create workspace folder: `apps/flow/`
- [ ] Add `apps/flow/package.json`
- [ ] Add `apps/flow/wrangler.toml`
- [ ] Add app shell structure for flow UI
- [ ] Keep first scope minimal: routing, builder shell, templates/entry page

Reference docs to use:

- [ ] `docs/product/FLOW_BUILDER_DRAG_DROP.md`
- [ ] `docs/flow/FLOW_API_MODULE_STRUCTURE.md`
- [ ] `docs/flow/FLOW_DATABASE_SCHEMA.md`
- [ ] `docs/flow/DASH_IAI_ONE_RUNTIME_APP_SPEC.md`
- [ ] `docs/flow/DEV_ACTION_FILE_FLOW_WEEK_1_TO_4.md`

Output of this stream:

- `apps/flow` exists as a real product workspace with minimal ecosystem role

### 4.5 `api.flow.iai.one` -> future backend runtime workspace

Status now:

- no separate runtime worker exists in repo yet
- current flow-related responsibilities are still mostly conceptual/spec-level

Technical todos:

- [ ] Decide workspace location for flow runtime API, likely `workers/flow-api/`
- [ ] Create workspace only after contract boundary is locked
- [ ] Extract runtime-only responsibilities from `api.iai.one` planning
- [ ] Define route surface for execution, runs, steps, schedules, queue events

Suggested future file map:

- [ ] `workers/flow-api/package.json`
- [ ] `workers/flow-api/wrangler.toml`
- [ ] `workers/flow-api/src/index.ts`
- [ ] `workers/flow-api/src/routes/`
- [ ] `workers/flow-api/src/lib/`

Output of this stream:

- `api.flow.iai.one` becomes a planned implementation target, even if not yet built this sprint

## 5. Community Migration Technical Todos

### Data Model

- [ ] Review D1 tables in `packages/database/schema.sql`
- [ ] Identify missing tables/columns for migrated community data
- [ ] Define source markers for imported content
- [ ] Define imported-user mapping fields
- [ ] Define imported-content moderation state

Likely files:

- [ ] `packages/database/schema.sql`
- [ ] `packages/database/migration_v2.sql`
- [ ] add new migration file under `packages/database/migrations/` if needed

### API Layer

- [ ] Add import-safe internal/admin routes if needed
- [ ] Add model typing in `workers/api/src/types.ts`
- [ ] Add serialization rules for imported content in route handlers

### App Layer

- [ ] Add display treatment for imported legacy posts if needed
- [ ] Add source/trust badges if needed
- [ ] Add profile mapping logic for legacy handles and names

### Content Source Material

- [ ] Gather community source content outside this repo if applicable
- [ ] Create import manifest format in repo docs before writing import code

## 6. Scripts / Tooling Todos

Current scripts already cover `apps/web` + `workers/api` deploy.

Technical todos:

- [ ] Update root `package.json` once `apps/home` exists
- [ ] Update root `package.json` once `apps/flow` exists
- [ ] Add deploy script for `home.iai.one`
- [ ] Add deploy script for `flow.iai.one`
- [ ] Keep existing `deploy:prod` stable for current app/api stack
- [ ] Decide whether future deploy orchestration becomes per-surface or ecosystem-wide

Relevant files:

- [ ] `package.json`
- [ ] `scripts/deploy.mjs`
- [ ] `scripts/deploy-api.mjs`
- [ ] future `scripts/deploy-home.mjs`
- [ ] future `scripts/deploy-flow.mjs`

## 7. Recommended Implementation Order In Repo

1. Create `apps/home` workspace.
2. Write `home.iai.one` portal page and routing shell.
3. Audit and adjust `apps/web` for merged-community destination role.
4. Audit and extend `workers/api` for migration-safe content/user contracts.
5. Create `apps/flow` workspace with minimal shell.
6. Define `workers/flow-api` boundary, but only implement if phase capacity remains.

## 8. Definition Of Done

This technical todo set is complete when:

- [ ] `apps/home` exists and is build-ready
- [ ] `apps/web` is explicitly prepared for community convergence
- [ ] `workers/api` contracts support the next migration wave
- [ ] `apps/flow` exists as a real workspace or is explicitly deferred with written reason
- [ ] technical repo ownership is clear for every canonical domain in the next phase
