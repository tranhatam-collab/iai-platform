# NEXT_DEV_SCOPE

Date: 2026-04-03
Status: Approved working scope draft for next build block
Depends on:

- `IAI_ONE_ECOSYSTEM_CANONICAL_2026.md`
- `DOMAIN_MIGRATION_CHECKLIST.md`

## 1. Purpose

Lock the next development phase so the team builds the correct things in the correct order for:

- `home.iai.one`
- `app.iai.one`
- `api.iai.one`
- `flow.iai.one`
- old community migration into the new ecosystem

This is the immediate phase after the current homepage/app deployment stabilization.

## 2. Phase Name

Phase: `Portal + Community Convergence`

## 3. Main Objective

Finish the first coherent ecosystem loop:

1. User understands IAI from the root/portal.
2. User enters through `home.iai.one`.
3. User lands in `app.iai.one` for actual community/product usage.
4. Core app data is served by `api.iai.one`.
5. Flow product has a clear role and handoff through `flow.iai.one`.
6. Old community begins structured migration into the new app.

## 4. In Scope

### 4.1 `home.iai.one`

In scope:

- Build the portal information architecture.
- Build the main portal page with clear routing to:
  - `app.iai.one`
  - `flow.iai.one`
  - `docs.iai.one`
  - `developer.iai.one`
  - `dash.iai.one`
- Add audience entry points:
  - new visitor
  - old community member
  - builder/developer
  - operator/team
- Add migration-safe messaging for users coming from the old ecosystem.
- Add CTA paths that do not compete with root `iai.one`.

Outcomes:

- `home.iai.one` becomes the public front door.

### 4.2 `app.iai.one`

In scope:

- Stabilize and finalize the public-first community shell.
- Confirm public routes for homepage/feed, lessons, verification, profile, and post detail are production-grade.
- Add explicit community migration support pages or messaging where needed.
- Shape app information architecture so it can absorb the old community without becoming chaotic.
- Prepare app navigation for the merged community model.
- Define first-class surfaces for migrated content and legacy users.

Outcomes:

- `app.iai.one` is clearly the real destination for usage and community.

### 4.3 `api.iai.one`

In scope:

- Lock the canonical data model for:
  - users
  - profiles
  - posts
  - lessons
  - verification
  - legacy community content import mapping
- Close gaps in public/community endpoints needed by `app.iai.one`.
- Confirm auth, registration, profile, and community content flows are canonical here.
- Define import-safe content and user migration contracts.
- Ensure production deploy pipeline remains stable for the app-facing API.

Outcomes:

- `api.iai.one` is ready to support community convergence, not just homepage rendering.

### 4.4 `flow.iai.one`

In scope:

- Define and implement the minimum portal and app handoff into flow.
- Clarify the first public-facing role of `flow.iai.one`.
- Avoid feature sprawl; focus only on the builder/runtime entry path needed by the ecosystem.
- Confirm distinction between `flow.iai.one` UI and `api.flow.iai.one` runtime.

Outcomes:

- Flow is visibly part of the ecosystem without competing with `app.iai.one`.

### 4.5 Community Migration

In scope:

- Inventory the old community assets that must be migrated first.
- Define migration priority for:
  - public posts
  - discussions
  - educational content
  - user identities/handles
- Define what gets imported, rewritten, archived, or redirected.
- Define first migration wave for legacy community into `app.iai.one`.
- Define redirect and messaging strategy for old community links.

Outcomes:

- Community migration starts as a controlled system change, not an ad hoc copy-paste exercise.

## 5. Explicitly Out Of Scope

Not in this next phase:

- full `noos.iai.one` buildout
- full `cios.iai.one` buildout
- major enterprise/B2B modules
- mobile app
- advanced proof/on-chain expansion
- deep dashboard analytics expansion beyond what is needed for migration support
- rebuilding root `iai.one` and portal/app/flow all at once without prioritization

## 6. Workstreams

### Workstream A - Portal (`home.iai.one`)

Deliverables:

- portal IA
- portal homepage copy/sections
- portal routing map
- old-user entry logic

Definition of done:

- user can arrive and clearly choose where to go next.

### Workstream B - App Convergence (`app.iai.one`)

Deliverables:

- stable public/community routes
- merged app nav for community use
- legacy-user orientation surface
- content destination map inside app

Definition of done:

- app is the obvious home of the living community.

### Workstream C - Core API (`api.iai.one`)

Deliverables:

- app-facing domain contract review
- migration-safe models/contracts
- endpoint gap closure for community convergence

Definition of done:

- app can support migrated users and content without schema confusion.

### Workstream D - Flow Positioning (`flow.iai.one` + `api.flow.iai.one`)

Deliverables:

- role clarification
- minimal builder entry flow
- domain boundary with app/api clarified

Definition of done:

- flow fits the ecosystem cleanly and does not duplicate app behavior.

### Workstream E - Community Migration

Deliverables:

- inventory
- migration mapping
- redirect draft
- first-wave migration plan

Definition of done:

- old community is ready for first structured migration wave.

## 7. Recommended Execution Order

1. Finalize portal IA and ecosystem routing for `home.iai.one`.
2. Finalize `app.iai.one` destination model for merged community.
3. Lock `api.iai.one` contracts that support that destination model.
4. Clarify `flow.iai.one` minimum role and handoff.
5. Execute first-wave community migration mapping.

Rule:

- Do not migrate legacy community content before the destination model inside `app.iai.one` is clear.

## 8. Concrete Deliverables For This Phase

The next dev block should produce these artifacts or implementations.

### Domain / IA

- `home.iai.one` information architecture and route map
- `app.iai.one` merged community information architecture
- `flow.iai.one` role note and handoff map

### Product / UX

- portal page or portal spec ready for build
- app navigation updates needed for community convergence
- old-user migration messaging copy

### API / Data

- canonical community migration data contract
- user/profile mapping rules
- content import mapping rules

### Migration / Ops

- first-wave URL redirect map
- first-wave legacy content import list
- first-wave legacy user migration assumptions

## 9. Acceptance Criteria

This phase is complete only when all conditions below are true.

- [ ] `home.iai.one` has a clear and approved role as the portal.
- [ ] `app.iai.one` is approved as the merged community destination.
- [ ] `api.iai.one` contracts for users/content/community are locked for the migration wave.
- [ ] `flow.iai.one` has a clear ecosystem role and does not duplicate portal/app responsibilities.
- [ ] first-wave old community migration plan is documented and executable.
- [ ] redirects and messaging assumptions are documented.

## 10. Risks To Control In This Phase

- Risk: building portal and app with overlapping roles.
- Risk: migrating old content before the new app structure is ready.
- Risk: splitting community truth between old site and new app for too long.
- Risk: unclear contract boundary between `api.iai.one` and `api.flow.iai.one`.
- Risk: trying to build `noos`/`cios` too early and delaying the actual convergence work.

## 11. Final Directive

The next dev phase is not “build more features.”

It is:

- establish `home.iai.one` as the portal
- establish `app.iai.one` as the merged user/community destination
- establish `api.iai.one` as the supporting backend truth
- establish `flow.iai.one` as the workflow product layer
- begin controlled migration of the old community into the new ecosystem

If a task does not help one of those five outcomes, it is not priority for this phase.
