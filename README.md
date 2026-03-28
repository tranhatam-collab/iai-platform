# IAI Platform

Central execution repository for the next complete version of the IAI ecosystem.

This repo is used to prepare, validate, and deliver upgraded implementations based on the approved blueprint and planning documents in `research/`.

## Critical Directive

- Do **not** modify live production systems on `*.iai.one` directly from ad-hoc changes.
- All implementation work must be done in this repository via controlled branches and pull requests.
- Follow approved phase gates before moving to the next implementation step.

## Program Goal

Build a constitutional, trust-first AI platform with:

- charter guardrails,
- provenance by default,
- reliable runtime orchestration,
- scalable product modules across web, API, and mobile.

## Repository Structure

```text
iai-platform/
├── apps/
├── workers/
├── packages/
├── infrastructure/
├── n8n-flows/
├── scripts/
└── research/
```

## Source of Truth Documents

Primary references live in `research/`:

- `IAI_ONE_MASTER_BLUEPRINT_v1.0_2026.md`
- `IAI_ONE_COMPLETE_DEV_BLUEPRINT_v4.0_2026.md`
- `IAI_ONE_TECH_STACK_MASTER_v5.0_2026.md`
- `IAI_ONE_HOMEPAGE_FULL_DEV_SPEC_v1.0_2026.md`
- `MASTER_EXECUTION_PLAN.md`
- `PHASED_BACKLOG_P0_P7.md`
- `ARCHITECTURE_DECISIONS_LOG.md`
- `RISK_AND_APPROVAL_GATES.md`

## Execution Rules for Dev Team

Mandatory flow for every phase:

1. Plan
2. Code
3. Test
4. Demo
5. Approve
6. Merge

Delivery constraints:

- One phase = one PR (no batching across phases).
- No scope expansion without explicit approval.
- Required to merge:
  - CI pass
  - tests pass
  - KPI tracking active
  - reviewer approval comment (`Approved Hx`)

## Phase Sequence

- `P0`: planning baseline and gate approval
- `P1`: foundation platform
- `P2`: runtime orchestration
- `P3`: provenance + guardrails
- `P4`: product modules rollout
- `P5`: mobile super-app integration
- `P6`: hardening and compliance
- `P7`: scaleout and operations cadence

## Homepage Delivery Track

Homepage implementation follows the approved sequence:

- `H0`: scope freeze
- `H1`: IA/content contract
- `H2`: UI shell and states
- `H3`: data contracts and fallback
- `H4`: SEO/schema/performance
- `H5`: trust embedding
- `H6`: release readiness

## Getting Started (Local)

```bash
npm install
```

Use project-specific scripts from `package.json`, `scripts/`, and workspace package folders as needed.

## Branching and Review

- Keep `main` stable.
- Use feature branches for each approved phase or track (example: `feature/homepage-v1`).
- Open PR with:
  - scope statement,
  - changed files list,
  - test evidence,
  - rollout/rollback notes.

## Status

Current repository state contains planning-complete documentation and is ready for approval-driven implementation.
