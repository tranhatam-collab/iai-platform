# IAI_ONE_WIX_HOMEPAGE_SPEC_v1

Date: 2026-04-03
Status: Execution-ready Wix implementation spec
Target: `iai.one` root homepage
Role: Constitutional root + trust authority + ecosystem handoff

## 1. Objective

Build the final root homepage for `iai.one` on Wix so that:

- it clearly acts as constitutional authority
- it does not overlap with `home.iai.one` portal role
- it routes people into the ecosystem correctly
- it is ready for production publishing

## 2. Non-Negotiable Role Rules

`iai.one` homepage must be:

- constitutional
- trust-oriented
- category-defining
- routing-aware

`iai.one` homepage must not be:

- a feed
- a community app
- a product dashboard
- a generic startup landing page

Role split must remain explicit:

- `iai.one` = what IAI is and why it exists
- `home.iai.one` = where to go next
- `app.iai.one` = where users actually use the system

## 3. Primary User Intents On Root Homepage

### Intent A - Understand legitimacy

User wants to know:

- is this real and serious?
- what does IAI stand for?

### Intent B - Understand boundaries

User wants to know:

- what this system is and is not
- whether this is safe/trustworthy

### Intent C - Find next destination

User wants to know:

- where to enter the ecosystem

## 4. Homepage IA (Final)

Required section order:

1. Hero (constitutional brand statement)
2. Constitutional Position (why IAI exists)
3. What IAI Defines (charter, architecture, trust)
4. Flagship Systems (high-level only)
5. Ecosystem Surfaces (domain map)
6. Trust and Boundaries (what IAI is not + what it protects)
7. Entry Routing (clear route to portal and system surfaces)
8. Footer Authority Statement

## 5. Copy Specification (Production Draft)

Language lock for root homepage:

- primary: English

### 5.1 Hero

H1:

- IAI — Intelligence · Artistry · International

Subline:

- A constitutional trust layer and ecosystem architecture for systems that improve human life over time.

Supporting lines:

- Not a social network.
- Not a hype platform.
- Not a short-term product campaign.
- A long-term system for clarity, action, and real value.

Hero CTA rules:

- maximum 2 CTAs
- CTA #1: `Read the Constitution` -> `/constitution` (or anchor if single-page)
- CTA #2: `Explore the Ecosystem` -> `https://home.iai.one`

### 5.2 Constitutional Position

Section title:

- Why IAI Exists

Body:

- The world has abundant tools but fragmented direction.
- IAI exists to create a coherent structure where people, teams, and systems can act with clarity and continuity.
- The system must remain truthful, privacy-first, and action-oriented.

### 5.3 What IAI Defines

Section title:

- What IAI Defines

3-column structure:

1. Charter Layer
   - Defines principles, boundaries, and long-term direction.
2. Product Architecture
   - Organizes surfaces into one coherent ecosystem.
3. Trust Standards
   - Enforces proof, privacy, and responsible AI behavior.

### 5.4 Flagship Systems

Section title:

- Flagship Systems

Card A:

- IAI Flow
- Workflow orchestration and execution layer.
- CTA: `Open Flow` -> `https://flow.iai.one`

Card B:

- IAI App
- Community, education, verification, and user-level product usage.
- CTA: `Open App` -> `https://app.iai.one`

Rule:

- high-level only, no deep product sales copy on root homepage

### 5.5 Ecosystem Surfaces

Section title:

- System Surfaces

Required entries:

- Portal -> `home.iai.one`
- App -> `app.iai.one`
- Flow -> `flow.iai.one`
- Docs -> `docs.iai.one`
- Developer -> `developer.iai.one`
- Dashboard -> `dash.iai.one`
- API -> `api.iai.one`

Optional lower-emphasis:

- noos, cios, mail, cdn, flows

### 5.6 Trust and Boundaries

Section title:

- What IAI Is Not

Bullet list:

- Not an attention-extraction platform
- Not a financial solicitation system
- Not a replacement for human judgment
- Not a black-box authority over human life

Second title:

- What IAI Protects

Bullet list:

- Truth over stimulation
- Privacy over exploitation
- Proof over claims
- Long-term continuity over short-term hype

### 5.7 Entry Routing

Section title:

- Choose Your Entry Point

3 route blocks:

1. Explore the ecosystem -> `home.iai.one`
2. Use the products -> `app.iai.one`, `flow.iai.one`
3. Build on IAI -> `docs.iai.one`, `developer.iai.one`

Special migration line:

- If you are coming from the previous community, continue in `app.iai.one`.

### 5.8 Footer Statement

Required statement:

- IAI defines the structure.
- Products operate within it.
- Communities grow around it.

Include:

- copyright
- root and key domain links

## 6. Wix Layout Specification

### 6.1 Layout Frame

- max content width: 1200–1280px
- generous vertical spacing (88–120px per section)
- single-column narrative with grid blocks where needed
- avoid dense card walls above the fold

### 6.2 Header

Required header items:

- Charter
- Ecosystem
- Trust
- Enter (`home.iai.one`)

Header CTA:

- Open Portal -> `home.iai.one`

### 6.3 Footer

Footer groups:

- Root: `iai.one`
- Entry: `home.iai.one`
- Products: `app.iai.one`, `flow.iai.one`
- Build: `docs.iai.one`, `developer.iai.one`
- Operate: `dash.iai.one`, `api.iai.one`

## 7. Visual Direction (Wix)

Direction:

- authoritative
- minimal
- editorial-tech

Palette guidance:

- dark foundation (obsidian/ink)
- restrained metallic accent (gold)
- one cool signal accent (cyan or equivalent)

Typography guidance:

- one strong display style for headings
- one readable body style
- avoid default generic looking system style if possible

Motion guidance:

- subtle section reveal only
- avoid excessive micro-animations

## 8. SEO and Metadata Requirements

### Homepage meta

- title: `IAI — Intelligence · Artistry · International`
- description: constitutional trust layer and ecosystem architecture
- canonical: `https://iai.one`

### OG

- OG title aligned with root authority
- OG description aligned with constitutional positioning
- OG image with root visual identity

### Structured data

- Organization schema for IAI
- Website schema for root domain

### Technical

- sitemap includes root homepage
- robots allow indexing of public root pages
- no duplicate canonical conflicts with `home.iai.one` or `app.iai.one`

## 9. CTA Routing Rules (Strict)

Allowed primary CTAs on root homepage:

- `home.iai.one`
- `app.iai.one`
- `flow.iai.one`
- `docs.iai.one`
- `developer.iai.one`

Priority order for public entry:

1. `home.iai.one`
2. `app.iai.one`
3. `flow.iai.one`

Rule:

- Root must prefer routing into `home.iai.one` for discovery.
- It may still directly link to `app` and `flow` in sections where context is clear.

## 10. Legacy-to-Canonical Mapping For Root

On root homepage rewrite, apply these mapping rules:

- any feed-like section -> move out of root, route to `app.iai.one`
- any portal routing grid not constitutional -> move emphasis to `home.iai.one`
- any deep docs-like section -> route to `docs.iai.one`
- any developer onboarding details -> route to `developer.iai.one`

## 11. QA Checklist Before Publish

### Role Integrity

- [ ] Root reads as constitutional authority
- [ ] Root does not read as app/portal clone

### Routing Integrity

- [ ] `home.iai.one` is clearly positioned as ecosystem entry
- [ ] old community users are routed toward `app.iai.one`

### Content Integrity

- [ ] no hype language
- [ ] no contradictory message vs constitution/manifest
- [ ] no random product feature sprawl

### UX Integrity

- [ ] mobile and desktop readability
- [ ] visible CTA hierarchy
- [ ] consistent spacing and typography

### SEO Integrity

- [ ] metadata configured
- [ ] OG image valid
- [ ] canonical URL correct

## 12. Definition Of Done

The `iai.one` Wix homepage is complete only when:

- [ ] constitutional identity is clear in first screen
- [ ] trust boundaries are explicit
- [ ] ecosystem surfaces are clearly mapped
- [ ] route to `home.iai.one` is obvious
- [ ] route to `app.iai.one` and `flow.iai.one` is clear
- [ ] old community user pathway is acknowledged
- [ ] root/app/portal role confusion is removed

## 13. Final Instruction For Implementation

Build this page as a constitutional root homepage first.

If a component does not reinforce constitutional authority, trust boundary, or clean ecosystem routing, remove it.
