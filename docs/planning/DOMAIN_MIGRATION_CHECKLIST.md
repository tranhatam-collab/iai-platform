# DOMAIN_MIGRATION_CHECKLIST

Date: 2026-04-03
Status: Execution checklist
Depends on: `IAI_ONE_ECOSYSTEM_CANONICAL_2026.md`

## 1. Goal

Replace the old `iai.one` structure with the new canonical `iai.one` ecosystem without losing community, content, trust, or routing continuity.

## 2. Migration Rule

Every existing page, route, content block, feature, or user flow must be classified into one of four actions:

- keep in place
- move to new canonical domain
- redirect to new canonical domain
- retire

Nothing should remain ambiguous.

## 3. Global Checklist

### 3.1 Domain Authority Freeze

- [ ] Confirm the canonical domain map in `IAI_ONE_ECOSYSTEM_CANONICAL_2026.md` is final.
- [ ] Freeze creation of any non-canonical new subdomain.
- [ ] Freeze any new content added directly to old mixed-purpose surfaces.
- [ ] Confirm root authority rules:
  - [ ] `iai.one` = charter / constitution only
  - [ ] `home.iai.one` = portal / entry router
  - [ ] `app.iai.one` = real user/community product
  - [ ] `flow.iai.one` = workflow product

### 3.2 Legacy Inventory

- [ ] Inventory all current root-domain pages on old `iai.one`.
- [ ] Inventory all old public community pages.
- [ ] Inventory all old onboarding flows.
- [ ] Inventory all old login/register/account flows.
- [ ] Inventory all existing docs/help/developer pages.
- [ ] Inventory all existing redirects already configured in DNS, Cloudflare, Wix, or app layer.
- [ ] Inventory all URLs indexed by search engines or linked publicly.

### 3.3 Classification Pass

For every legacy URL/page:

- [ ] Mark as `charter`
- [ ] Mark as `portal`
- [ ] Mark as `app/community`
- [ ] Mark as `docs/developer`
- [ ] Mark as `ops/internal`
- [ ] Mark as `retire`

## 4. Canonical Domain Checklists

### 4.1 `iai.one` (Wix Charter Root)

Target role:

- constitutional root
- trust layer
- public meaning of IAI

Checklist:

- [ ] Remove product sprawl from root homepage.
- [ ] Keep only constitutional, trust, and system-level framing.
- [ ] Add clear route to `home.iai.one` as the main ecosystem entry.
- [ ] Add route to `docs.iai.one` and `developer.iai.one` where relevant.
- [ ] Remove any root content that behaves like a feed, dashboard, or app shell.
- [ ] Remove duplicated community/product sections that belong in `app.iai.one`.
- [ ] Confirm root nav does not compete with `home.iai.one`.
- [ ] Confirm SEO metadata positions root as charter / constitution / trust authority.

Exit condition:

- [ ] Root `iai.one` reads as constitutional authority, not as the product monolith.

### 4.2 `home.iai.one` (Portal)

Target role:

- ecosystem router
- onboarding chooser
- migration landing zone for old users

Checklist:

- [ ] Build portal information architecture.
- [ ] Add audience-based entry paths:
  - [ ] new visitor
  - [ ] community member
  - [ ] builder/developer
  - [ ] operator/team
- [ ] Add clear links to `app.iai.one`, `flow.iai.one`, `docs.iai.one`, `developer.iai.one`, `dash.iai.one`.
- [ ] Add legacy-user guidance for users coming from the old community.
- [ ] Add migration-safe CTA copy so old users know where to continue.
- [ ] Add canonical metadata for portal intent.

Exit condition:

- [ ] `home.iai.one` becomes the clear system front door.

### 4.3 `app.iai.one` (Web App + Community)

Target role:

- main product usage surface
- merged old community destination

Checklist:

- [ ] Confirm public homepage/feed is live and stable.
- [ ] Confirm guest routes for public community browsing are working.
- [ ] Confirm login/register/auth callbacks are stable.
- [ ] Confirm profile, post, lesson, and verification public pages are stable.
- [ ] Define which old community content types move here first:
  - [ ] public posts
  - [ ] educational posts
  - [ ] discussion threads
  - [ ] member profiles
  - [ ] groups/programs later
- [ ] Define old-to-new handle/user identity mapping.
- [ ] Define trust/status mapping for migrated community content.
- [ ] Define moderation rules for migrated community content.
- [ ] Add navigation/supporting pages that orient legacy community users.

Exit condition:

- [ ] `app.iai.one` is the living destination for the old and new community.

### 4.4 `flow.iai.one`

Target role:

- workflow builder and execution UI

Checklist:

- [ ] Confirm product role stays limited to workflow surfaces.
- [ ] Confirm no generic root/community content is duplicated here.
- [ ] Define portal handoff from `home.iai.one` to `flow.iai.one`.
- [ ] Define app-to-flow handoff where flows are triggered from community/user actions.
- [ ] Confirm auth/session expectations across `app` and `flow`.

Exit condition:

- [ ] `flow.iai.one` is clearly product-specific and not a duplicate portal.

### 4.5 `api.iai.one`

Target role:

- single public backend authority for core domains

Checklist:

- [ ] Confirm auth endpoints are canonical.
- [ ] Confirm user/profile endpoints are canonical.
- [ ] Confirm content/posts/lessons/verification endpoints are canonical.
- [ ] Confirm community-related domain objects live here by default.
- [ ] Confirm old community migration data model maps into the shared API model.
- [ ] Confirm no duplicate API roots are serving the same core domain objects.
- [ ] Confirm public CORS and allowed origins match current production surfaces.

Exit condition:

- [ ] `api.iai.one` is the single backend truth for app/community/content domains.

### 4.6 `api.flow.iai.one`

Target role:

- flow execution and runtime specialization

Checklist:

- [ ] Confirm route ownership for flow runtime only.
- [ ] Confirm no community/content/auth duplication here unless strictly runtime-specific.
- [ ] Confirm contract boundary with `api.iai.one` is documented.
- [ ] Confirm runtime health, queue, and orchestration endpoints are scoped correctly.

Exit condition:

- [ ] `api.flow.iai.one` supports runtime without fragmenting product truth.

### 4.7 `docs.iai.one` and `developer.iai.one`

Checklist:

- [ ] Move product/system docs to `docs.iai.one`.
- [ ] Move API/developer/integration docs to `developer.iai.one` where needed.
- [ ] Remove docs-like content from wrong surfaces.
- [ ] Add links from root and portal.
- [ ] Define canonical ownership of each doc category.

Exit condition:

- [ ] documentation and developer onboarding are no longer scattered.

### 4.8 `dash.iai.one`, `noos.iai.one`, `cios.iai.one`

Checklist:

- [ ] Confirm they are treated as control surfaces, not main public marketing surfaces.
- [ ] Define access roles and audience for each.
- [ ] Remove first-touch user onboarding assumptions from these domains.
- [ ] Ensure no duplicate portal behavior exists here.

Exit condition:

- [ ] control surfaces are clearly separated from public entry surfaces.

### 4.9 `mail.iai.one`, `cdn.iai.one`, `flows.iai.one`

Checklist:

- [ ] Confirm infra-only role for each.
- [ ] Confirm no public-facing brand confusion.
- [ ] Confirm app/api integrations point to the right infra services.
- [ ] Confirm operational ownership is documented.

Exit condition:

- [ ] infrastructure domains remain infrastructure-only.

## 5. Legacy Community Migration Checklist

### 5.1 User Migration

- [ ] Identify all old community user records.
- [ ] Map legacy users to canonical shared identity model.
- [ ] Preserve handles where possible.
- [ ] Preserve public identity/trust indicators where valid.
- [ ] Define duplicate-account resolution rule.
- [ ] Define inactive-account handling rule.

### 5.2 Content Migration

- [ ] Identify all old community content types.
- [ ] Map each content type into app-native content model.
- [ ] Mark what is imported as-is vs rewritten vs archived.
- [ ] Preserve author attribution where valid.
- [ ] Preserve timestamps where needed.
- [ ] Mark legacy/imported content visibly if needed.

### 5.3 Community Structure Migration

- [ ] Identify old groups/programs/channels.
- [ ] Map them into new groups/programs/community surfaces.
- [ ] Define what launches now in `app.iai.one` versus later in `dash.iai.one`.
- [ ] Define moderation and trust policy for migrated spaces.

### 5.4 Redirect and Communication

- [ ] Create redirect map from old community URLs to new equivalents.
- [ ] Add public migration message for old users.
- [ ] Add onboarding/help content for migrated users.
- [ ] Add FAQ for changed domain structure.

## 6. SEO and Redirect Checklist

- [ ] Define canonical URL for every important legacy page.
- [ ] Add 301 redirect plan for old URLs.
- [ ] Remove duplicate semantic pages across root/portal/app/docs.
- [ ] Preserve high-value indexed pages with safe redirect targets.
- [ ] Update sitemap ownership by domain.
- [ ] Update robots/canonical metadata by domain purpose.

## 7. Technical Cutover Checklist

- [ ] Confirm DNS ownership and routing for all canonical domains.
- [ ] Confirm Cloudflare Pages project ownership for each public surface.
- [ ] Confirm Worker ownership for `api.iai.one` and `api.flow.iai.one`.
- [ ] Confirm production env vars per surface.
- [ ] Confirm auth/session/cookie domain strategy across subdomains.
- [ ] Confirm asset/media paths use `cdn.iai.one` where appropriate.
- [ ] Confirm mail paths use `mail.iai.one` infrastructure correctly.
- [ ] Confirm automation/integration dependencies on `flows.iai.one`.

## 8. Approval Gates

### Gate A - Architecture Classification Complete

- [ ] All old pages/features are classified.
- [ ] All domain roles are frozen.

### Gate B - Content and Redirect Plan Approved

- [ ] Content migration mapping complete.
- [ ] Redirect plan complete.

### Gate C - Community Migration Approved

- [ ] User migration logic agreed.
- [ ] Community content migration logic agreed.

### Gate D - Technical Cutover Ready

- [ ] Domains, deploys, auth, and data dependencies ready.

### Gate E - Legacy Retirement Ready

- [ ] Old surfaces have safe replacements or redirects.
- [ ] No critical user path remains stranded.

## 9. Definition Of Done

Domain migration is complete only when all conditions are true.

- [ ] Root `iai.one` is charter-only.
- [ ] `home.iai.one` is the portal.
- [ ] `app.iai.one` is the merged user/community destination.
- [ ] `flow.iai.one` is the flow product surface.
- [ ] `api.iai.one` and `api.flow.iai.one` have clear non-overlapping authority.
- [ ] Old community is integrated, not abandoned and not duplicated.
- [ ] Redirects and SEO are stable.
- [ ] No major legacy user path points to the wrong surface.
