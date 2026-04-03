# IAI.ONE ECOSYSTEM CANONICAL 2026

Date: 2026-04-03
Status: Canonical pre-dev reference
Applies to: all next development inside this repo

## 1. Decision

From this point forward, the entire build is for the new `iai.one` ecosystem only.

This means:

- `iai.one` is the constitutional root brand.
- All product, app, docs, workflow, runtime, and operations surfaces must align to the `iai.one` domain system below.
- Old `iai.one` structures that do not fit this system are to be replaced, redirected, or absorbed.
- The old community is not discarded. It must be merged into the new ecosystem as retained users, public content, and community flows inside the new app and portal surfaces.

There must be one ecosystem, one brand system, and one backend truth.

## 2. Canonical Domain Map

This is the approved target map.

| Domain | Platform | Canonical Role | Public / Private | Notes |
| --- | --- | --- | --- | --- |
| `iai.one` | Wix | Charter / Constitution / root trust layer | Public | Root brand and philosophical authority. No product complexity here. |
| `home.iai.one` | Cloudflare Pages | Main portal / entry router | Public | Primary navigation layer into all major system surfaces. |
| `app.iai.one` | Cloudflare Pages + Next.js | Main product web app | Mixed | Core user experience: feed, lessons, verification, profiles, community, member journeys. |
| `flow.iai.one` | Cloudflare Pages | Workflow builder product surface | Private-first | Flow UI, builder, templates, execution entry. |
| `api.iai.one` | Cloudflare Worker | Main backend REST API | Internal + browser-consumed | Single public backend authority for app/domain services. |
| `api.flow.iai.one` | Cloudflare Worker | Flow runtime / execution API | Internal + product | Dedicated API surface for flow engine and execution runtime. |
| `docs.iai.one` | Cloudflare Pages | Product and system documentation | Public | Product docs, architecture docs, guides, specs. |
| `dash.iai.one` | Cloudflare Pages | Dashboard / operator surface | Private | Operational, user, org, analytics, and control dashboards. |
| `developer.iai.one` | Cloudflare Pages | Developer portal | Public | API docs, SDK docs, integration docs, technical onboarding. |
| `noos.iai.one` | Cloudflare Pages | Civilization OS / AI layer | Private or staged public | Strategic higher-order intelligence surface, not the first user entry point. |
| `cios.iai.one` | Cloudflare Pages | AI control layer | Private | Control plane / advanced orchestration layer, later-stage maturity. |
| `mail.iai.one` | Hetzner VPS / Mailcow | Mail infrastructure | Internal | Mail delivery and multi-domain communication backbone. |
| `cdn.iai.one` | Cloudflare CDN | Static asset and media delivery | Public infra | Shared media/static delivery layer. |
| `flows.iai.one` | n8n | Automation backbone | Internal | Internal automation, background workflows, notifications, ops, syncs. |

## 3. Authority Model

The system must operate with clear authority boundaries.

- `iai.one` defines meaning, principles, trust position, and constitutional layer.
- `home.iai.one` routes people into the right surface.
- `app.iai.one` is the default user destination for actual usage.
- `flow.iai.one` is the workflow product surface.
- `api.iai.one` is the default backend authority for core application domains.
- `api.flow.iai.one` is the runtime authority for flow execution.
- `docs.iai.one` and `developer.iai.one` explain the system; they do not replace it.
- `dash.iai.one`, `noos.iai.one`, and `cios.iai.one` are control surfaces, not first-touch marketing surfaces.

## 4. Replacement Rule For Old IAI.ONE

The old `iai.one` site is no longer the product center.

It must be replaced by the new architecture as follows:

- Root `iai.one` becomes the Charter / Constitution site on Wix.
- Product discovery and routing move to `home.iai.one`.
- Product usage moves to `app.iai.one`, `flow.iai.one`, and related subdomains.
- Documentation and developer orientation move to `docs.iai.one` and `developer.iai.one`.
- Old pages that try to mix philosophy, community, product, and operations into one surface should be split and redirected into the correct domain.

Canonical rule:

- `iai.one` explains what IAI is.
- `home.iai.one` explains where to go.
- `app.iai.one` is where users actually do things.

## 5. Legacy Community Integration Rule

The old community must be kept, but not as a separate parallel system.

It must be absorbed into the new ecosystem in these forms:

- legacy members become users, contributors, mentors, or groups inside `app.iai.one`
- old public posts, discussions, and educational content become migrated or republished community content
- legacy community entry links should route into `home.iai.one` or directly to relevant public/community surfaces in `app.iai.one`
- old community logic should not remain on a disconnected legacy site if the same function now belongs in `app.iai.one`

Approved integration target for old community:

- public community content -> `app.iai.one`
- member activity / profiles / trust / discussion -> `app.iai.one`
- group and program coordination -> `app.iai.one` and later `dash.iai.one`
- public onboarding from old audience -> `home.iai.one`

Non-approved approach:

- keeping one old community website alive as a second truth
- duplicating users across old and new systems without migration plan
- splitting content governance across multiple unrelated roots

## 6. Canonical Product Positioning By Surface

### `iai.one`

Purpose:

- charter
- constitution
- trust position
- core identity of IAI

Must contain:

- brand meaning
- constitutional language
- trust boundaries
- high-level route into the ecosystem

Must not become:

- a full web app
- a crowded feed
- a mixed admin portal
- a generic landing page stuffed with every feature

### `home.iai.one`

Purpose:

- portal
- onboarding router
- ecosystem entry map
- product chooser

Must contain:

- clear paths to app, flow, docs, developer, dashboard
- audience-based entry points
- migration-friendly routing for legacy users

### `app.iai.one`

Purpose:

- primary user product
- community layer
- education + truth layer
- member activity and identity

Current and near-term fit:

- homepage/feed
- public pages
- lessons
- verification
- profiles
- community content
- groups/programs over time

This is the right place to merge the old community.

### `flow.iai.one`

Purpose:

- workflow builder
- automation design
- execution orchestration UI

### `api.iai.one`

Purpose:

- authentication
- users
- content
- lessons
- posts
- verification
- groups/programs
- shared domain services

Rule:

- Core browser-facing product domains should prefer `api.iai.one/v1/*`.

### `api.flow.iai.one`

Purpose:

- runtime execution
- flow runs
- queue processing
- orchestration state
- internal and product execution APIs

Rule:

- flow runtime stays separated at API level, but not as a separate product truth.

### `docs.iai.one`

Purpose:

- public docs
- specs
- standards
- architecture references

### `dash.iai.one`

Purpose:

- operator dashboard
- org views
- analytics
- moderation
- internal and advanced member control

### `developer.iai.one`

Purpose:

- developer onboarding
- integration docs
- API references
- SDK and examples

### `noos.iai.one`

Purpose:

- higher-order civilization OS / intelligence layer

Rule:

- do not treat it as the main public product before app, flow, and dash are stable.

### `cios.iai.one`

Purpose:

- advanced AI control layer

Rule:

- later-stage control surface, not launch-first scope.

## 7. Single Backend Truth

For implementation, backend truth must stay unified.

- `api.iai.one` is the single public backend authority for core domains.
- `api.flow.iai.one` supports runtime specialization for flow execution.
- Shared identity, trust, content, and user state must not fragment across random services.
- Public app/community content should not depend on multiple conflicting backend roots.

Practical rule:

- one user identity model
- one content model
- one membership model
- one audit model
- one proof/trust model

## 8. Navigation Standard

Approved ecosystem navigation:

- root meaning -> `iai.one`
- general entry -> `home.iai.one`
- use the platform -> `app.iai.one`
- build workflows -> `flow.iai.one`
- read docs -> `docs.iai.one`
- build integrations -> `developer.iai.one`
- operate/manage -> `dash.iai.one`

No future page should violate this map without an explicit architecture decision.

## 9. Legacy Migration Directives

Before next major dev wave, assume the following migration rules.

### Content Migration

- old homepage copy that belongs to constitutional identity -> move to `iai.one`
- old general navigation/product marketing -> move to `home.iai.one`
- old community posts/content -> move to `app.iai.one`
- old developer/how-to material -> move to `docs.iai.one` or `developer.iai.one`

### User Migration

- existing community users should map into the shared identity model
- do not create a separate legacy auth silo if avoidable
- preserve handles, public identity, and community trust where possible

### SEO / Redirect Migration

- old URLs must resolve to the correct new canonical surface
- avoid duplicate pages with the same semantic purpose on multiple subdomains
- keep root brand authority at `iai.one`
- keep product intent on the correct subdomain instead of overloading the root

## 10. Immediate Dev Rules

All next development should follow these rules.

1. Build only for the approved `iai.one` ecosystem map in this document.
2. Treat `app.iai.one` as the default surface for community + public product usage.
3. Treat the old community as a migration input, not a separate long-term destination.
4. Do not create new random subdomains or duplicate product surfaces.
5. Do not move product complexity back onto root `iai.one`.
6. Do not split backend truth across multiple unrelated APIs for the same domain objects.
7. If a feature is unclear, place it according to role:
   - meaning/constitution -> `iai.one`
   - routing/onboarding -> `home.iai.one`
   - user usage/community -> `app.iai.one`
   - workflows -> `flow.iai.one`
   - ops/control -> `dash.iai.one`, `noos.iai.one`, `cios.iai.one`

## 11. Non-Negotiable Clarification

This repo is not building a random collection of projects.

It is building the completed `iai.one` ecosystem in its best and most coherent version.

That includes:

- replacing the old `iai.one` structure where needed
- preserving and integrating the old community where valuable
- converging everything into one coherent system

Final canonical statement:

`iai.one` is the root authority.
`home.iai.one` is the portal.
`app.iai.one` is the living community and user product.
`flow.iai.one` is the execution product.
`api.iai.one` and `api.flow.iai.one` are the backend authorities.
Everything else supports this system.

## 12. Pre-Dev Directive

Before any next large implementation block, use this file as the canonical scope reference.

If another older document conflicts with this file on domain role, migration direction, or surface ownership, this file wins unless explicitly superseded by a newer approved canonical file.
