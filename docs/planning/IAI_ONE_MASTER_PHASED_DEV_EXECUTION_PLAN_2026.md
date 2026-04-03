# IAI.ONE Master Phased Dev Execution Plan 2026

Date: 2026-03-27  
Scope: Planning and approval-first execution (no coding before approval)

## 1) Executive Direction

This is the single official execution plan to move from the current IAI foundation into a full Constitutional AI OS buildout.

Execution rule:

- No implementation starts until phase approval is granted.
- Development proceeds phase-by-phase (`P0` -> `P7`).
- Each phase closes with testing evidence, review, and explicit sign-off.

## 2) Program Objectives

- Convert blueprint documents into a controlled delivery program.
- Build a trust-first, provenance-native, Cloudflare-scaled platform.
- Establish repeatable release and governance process for all modules.
- Reach production readiness before aggressive scale.

## 3) Phase Model (P0-P7)

## P0 - Planning and Approval Gate

Purpose:

- Consolidate all planning artifacts into one execution baseline.
- Freeze scope, architecture assumptions, and decision ownership.

Deliverables:

- Scope matrix: feature -> module -> owner -> dependency.
- Architecture decision log (ADR list).
- Risk register with mitigation and rollback paths.
- Definition of Done per phase.

Approval Gate:

- Stakeholder sign-off on scope and sequencing.

---

## P1 - Foundation Platform

Purpose:

- Establish delivery foundations for safe and fast iteration.

Deliverables:

- Monorepo topology and module boundaries.
- Environment strategy (dev/staging/prod).
- Initial D1 schemas and migration flow.
- OpenAPI baseline and SDK boundary.
- CI baseline (lint/test/build/deploy checks).

Approval Gate:

- Sign-off on architecture baseline and environment model.

---

## P2 - Core Runtime and Orchestration

Purpose:

- Implement robust execution runtime for workflows and agents.

Deliverables:

- Flow Runtime V2 baseline.
- Dynamic execution integration strategy.
- Durable Objects state model (execution + agent state).
- Queue/workflow handling for long tasks.
- Runtime observability metrics baseline.

Approval Gate:

- End-to-end execution demo and reliability test pass.

---

## P3 - Provenance and Charter Guardrails

Purpose:

- Enforce trust and governance as platform primitives.

Deliverables:

- Provenance chain model (hash/CID/attestation references).
- Verification API behavior contract.
- Charter guardrails integrated into execution path.
- Auditable logging strategy.

Approval Gate:

- Validation of reject/allow rules and provenance verification flow.

---

## P4 - Product Surface Expansion

Purpose:

- Deliver core product modules in the closed-loop flywheel.

Target Product Set:

1. Provenance marketplace module.
2. Community node builder.
3. Charter simulator.
4. Agent marketplace/registry.
5. NOOS transparent fund module.
6. Certification module.
7. Enterprise gateway MVP.

Deliverables:

- MVP scope and acceptance for each module.
- Shared UX/system contracts across modules.
- Telemetry coverage and module-level docs.

Approval Gate:

- Per-module acceptance sign-off (not batched).

---

## P5 - Mobile Super-App and Growth Loop

Purpose:

- Close the user loop across charter, learning, orchestration, trust, and participation.

Deliverables:

- Mobile app MVP shell and shared API contract.
- Session/auth and trust indicators on mobile UX.
- Funnel instrumentation and referral/share loop baseline.

Approval Gate:

- UX and funnel review sign-off.

---

## P6 - Hardening, Compliance, and Enterprise Readiness

Purpose:

- Achieve secure, observable, supportable production posture.

Deliverables:

- Security hardening checklist completion.
- Incident runbooks and operational controls.
- Compliance reporting path (audit export ready).
- SLO/SLA candidate baselines.

Approval Gate:

- Production readiness review and Go/No-Go decision.

---

## P7 - Scaleout and Operating Cadence

Purpose:

- Expand regionally with controlled quality and economics.

Deliverables:

- Regional rollout sequence and dependency checklist.
- KPI operating cadence and governance cycle.
- Revenue instrumentation and performance dashboards.

Approval Gate:

- Scale milestone review and expansion approval.

## 4) Mandatory Phase Workflow

Every phase must follow this exact flow:

1. Plan details finalized (tasks, dependencies, timeline).
2. Stakeholder approval granted.
3. Implementation starts.
4. Testing and validation report produced.
5. Review and acceptance completed.
6. Phase closed before next phase starts.

## 5) Control Rules

- Do not skip phases.
- Do not parallelize uncontrolled work across future phases.
- Do not merge implementation without acceptance criteria evidence.
- Keep docs and implementation status synchronized.

## 6) Core KPIs by Program Stage

- Delivery KPIs: cycle time, pass rate, rollback rate.
- Reliability KPIs: success rate, latency profile, incident count.
- Trust KPIs: provenance coverage, verification success rate, policy rejection accuracy.
- Product KPIs: activation, retention, module adoption.
- Scale KPIs: MAU growth, enterprise conversion, operating efficiency.

## 7) Current Status

- Program status: `READY_FOR_P0_APPROVAL`
- Coding status: `ON_HOLD_UNTIL_APPROVAL`
- Next action: review and approve P0 scope pack.

## 8) Approval Record Template

- Phase:
- Date:
- Approver:
- Decision: Approved / Rework
- Notes:
- Exit criteria confirmed: Yes / No

---

This file is the single master execution reference for phased development governance.
