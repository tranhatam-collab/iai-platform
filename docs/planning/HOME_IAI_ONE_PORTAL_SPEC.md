# HOME_IAI_ONE_PORTAL_SPEC

Date: 2026-04-03
Status: Build-ready spec
Target domain: `home.iai.one`
Target repo workspace: `apps/home` (to be created)

## 1. Purpose

`home.iai.one` is the portal for the entire new `iai.one` ecosystem.

It is not:

- the constitutional root
- the main community app
- the flow builder itself
- the docs site
- the dashboard

It is the routing layer that helps users enter the right surface quickly.

## 2. Job To Be Done

When a person lands on `home.iai.one`, they must be able to answer within seconds:

- what part of the ecosystem is relevant to me?
- where should I go next?
- if I came from the old community, where do I continue now?

## 3. Primary User Types

### User Type A - New Visitor

Intent:

- understand what IAI is
- find the right product entry

Needs:

- simple orientation
- no jargon overload
- clear destination choice

### User Type B - Legacy Community Member

Intent:

- find the new home of the old community
- continue reading, posting, or participating

Needs:

- explicit migration reassurance
- direct route to `app.iai.one`

### User Type C - Builder / Developer

Intent:

- inspect docs, APIs, integrations, developer resources

Needs:

- route to `docs.iai.one`
- route to `developer.iai.one`
- route to `flow.iai.one` if building workflows

### User Type D - Operator / Internal Team

Intent:

- access operational or control surfaces

Needs:

- route to `dash.iai.one`
- later route to `noos.iai.one` / `cios.iai.one`

## 4. Portal Information Architecture

Approved IA:

1. Hero / Ecosystem orientation
2. Entry-point chooser
3. Surface map
4. Legacy community migration block
5. System trust / boundary explanation
6. Footer / canonical domain directory

Portal principle:

- one page can do the initial routing job
- no product deep-dive on portal
- no overloaded feature catalog

## 5. Page Structure

### Section 1 - Hero

Purpose:

- frame the portal as the entry into the ecosystem

Content requirements:

- H1 that positions this as the system portal
- short supporting line
- max 2 primary CTAs

Recommended H1 direction:

- Enter the IAI Ecosystem

Recommended subline direction:

- Find the right surface for community, workflows, docs, and operations.

Primary CTAs:

- Go to the App
- Explore the System

Destination:

- `app.iai.one`
- section jump or route directory lower on page

### Section 2 - Choose Your Entry Point

Purpose:

- route users by intent, not by internal org chart

Required cards:

- Use the platform
  - destination: `app.iai.one`
  - description: community, learning, verification, member activity
- Build workflows
  - destination: `flow.iai.one`
  - description: workflow builder and execution
- Read docs
  - destination: `docs.iai.one`
  - description: system, product, and architecture docs
- Build on IAI
  - destination: `developer.iai.one`
  - description: APIs, integrations, technical onboarding
- Operate the system
  - destination: `dash.iai.one`
  - description: dashboard and operational surfaces

### Section 3 - Domain Surface Map

Purpose:

- explain the ecosystem in one visual block

Required entries:

- `iai.one` -> charter / constitution
- `home.iai.one` -> portal
- `app.iai.one` -> community and user app
- `flow.iai.one` -> workflow builder
- `api.iai.one` -> backend API
- `docs.iai.one` -> documentation
- `developer.iai.one` -> developer portal
- `dash.iai.one` -> dashboard

Optional lower-emphasis entries:

- `noos.iai.one`
- `cios.iai.one`
- `mail.iai.one`
- `cdn.iai.one`
- `flows.iai.one`

### Section 4 - Legacy Community Migration Block

Purpose:

- explicitly absorb users from the old community

Required message:

- the old community is continuing inside the new ecosystem
- the main destination is now `app.iai.one`

Required CTA:

- Continue to the Community App

Optional second CTA:

- Read the migration guide

This block is mandatory.

### Section 5 - Trust and Boundaries

Purpose:

- prevent portal from feeling like random marketing

Required points:

- root authority stays at `iai.one`
- products and community live in the right subdomains
- docs and developer resources live separately
- control surfaces are not the main public entry

### Section 6 - Footer Directory

Purpose:

- create one stable canonical directory of the ecosystem

Required footer groups:

- Core: `iai.one`, `home.iai.one`, `app.iai.one`, `flow.iai.one`
- Build: `docs.iai.one`, `developer.iai.one`, `api.iai.one`
- Operate: `dash.iai.one`, later `noos.iai.one`, `cios.iai.one`
- Infrastructure: `mail.iai.one`, `cdn.iai.one`, `flows.iai.one`

## 6. Navigation Spec

Top nav required items:

- App
- Flow
- Docs
- Developer
- Dashboard

Optional:

- Charter

Navigation rules:

- no giant menu
- no duplicated footer-to-header clutter
- nav must support both desktop and mobile cleanly

## 7. CTA Matrix

Primary CTA destinations:

- `app.iai.one`
- `flow.iai.one`
- `docs.iai.one`
- `developer.iai.one`
- `dash.iai.one`

Priority order:

1. `app.iai.one`
2. `flow.iai.one`
3. `docs.iai.one`
4. `developer.iai.one`
5. `dash.iai.one`

Legacy migration CTA always points to:

- `app.iai.one`

## 8. Content Rules

Must do:

- explain structure clearly
- route users quickly
- name the main surfaces directly
- include old community migration guidance

Must not do:

- become a long product marketing page
- duplicate the full constitutional voice of `iai.one`
- duplicate app feed/content
- duplicate docs content
- become an internal dashboard

## 9. UX Rules

- fast, minimal, clear
- desktop and mobile first-class
- clear hierarchy over visual noise
- one strong action per card
- visible distinction between public product surfaces and operator surfaces

## 10. Recommended File Structure In Repo

If implemented as Next.js in `apps/home`:

- `apps/home/app/layout.tsx`
- `apps/home/app/page.tsx`
- `apps/home/app/globals.css`
- `apps/home/components/PortalHero.tsx`
- `apps/home/components/EntryPointGrid.tsx`
- `apps/home/components/SurfaceMap.tsx`
- `apps/home/components/LegacyCommunityBlock.tsx`
- `apps/home/components/TrustBoundaryBlock.tsx`
- `apps/home/components/PortalFooter.tsx`
- `apps/home/lib/surfaces.ts`

## 11. Suggested Data Model For Static Content

Create a small static config module such as `apps/home/lib/surfaces.ts` with:

- surface name
- domain
- role
- audience
- href
- prominence level

This avoids hardcoding domain cards in multiple places.

## 12. MVP Build Order

1. Create `apps/home` workspace.
2. Implement `layout.tsx` and `page.tsx`.
3. Build the 6 required sections as separate components.
4. Add static route config in `lib/surfaces.ts`.
5. Add responsive nav and footer.
6. Connect deploy config for Cloudflare Pages.

## 13. Acceptance Criteria

Portal spec is satisfied only if:

- [ ] a first-time visitor can understand where to go in under 10 seconds
- [ ] an old community user can clearly continue into `app.iai.one`
- [ ] the page distinguishes root/portal/app/flow/docs/developer/dashboard roles correctly
- [ ] no section duplicates the role of `iai.one`
- [ ] no section duplicates the role of `app.iai.one`
- [ ] mobile layout preserves all main entry points cleanly
- [ ] top 5 domain CTAs are visible without confusion

## 14. Final Directive

`home.iai.one` is not a marketing brochure.

It is the ecosystem router.

If a page element does not help route people into the correct surface faster and more clearly, it should not be on the portal.
