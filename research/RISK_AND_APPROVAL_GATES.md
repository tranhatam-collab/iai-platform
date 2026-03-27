# RISK_AND_APPROVAL_GATES

Date: 2026-03-27  
Status: Initial risk register and gate framework

## 1. Risk Register

## R-001: Scope Creep Across Phases

- Severity: High
- Probability: High
- Risk: Uncontrolled additions delay core platform stabilization.
- Mitigation: Change requests require impact note + owner approval.
- Owner: Product + Delivery

## R-002: Contract Drift

- Severity: High
- Probability: Medium
- Risk: Frontend/backend mismatch and rework.
- Mitigation: Contract freeze in P1 and compatibility checks per module.
- Owner: Tech Lead

## R-003: Runtime Reliability Instability

- Severity: High
- Probability: Medium
- Risk: Execution failures under load reduce trust.
- Mitigation: Retry/timeout/idempotency policies + load test gates.
- Owner: Runtime Lead

## R-004: Provenance Integrity Gaps

- Severity: High
- Probability: Medium
- Risk: Incomplete trust chain undermines governance claims.
- Mitigation: Mandatory provenance checks and audit tests in P3.
- Owner: Trust/Compliance Lead

## R-005: Security Exposure

- Severity: Critical
- Probability: Medium
- Risk: Misconfiguration or weak controls create incidents.
- Mitigation: Hardening checklist, threat modeling, runbooks, pre-scale review.
- Owner: Security Lead

## R-006: Low Product Traction

- Severity: High
- Probability: High
- Risk: Feature output without adoption signal.
- Mitigation: Instrument funnel early, module acceptance tied to usage signals.
- Owner: Product/Growth

## R-007: Operational Unreadiness

- Severity: High
- Probability: Medium
- Risk: Team cannot safely run production at scale.
- Mitigation: Incident drills, SLOs, on-call policies in P6.
- Owner: Platform/Ops

## R-008: Compliance Drift

- Severity: High
- Probability: Medium
- Risk: Governance posture diverges from implementation.
- Mitigation: Periodic compliance checkpoints and audit export tests.
- Owner: Compliance Lead

## 2. Approval Gates by Phase

## Gate G0 (for P0 closure)

Must-have:

- Scope matrix approved.
- ADR baseline reviewed.
- Risk register initialized with owners.

Decision:

- Approve P1 start / Request rework.

## Gate G1 (for P1 closure)

Must-have:

- Contract baseline approved.
- Migration workflow validated.
- CI baseline passing.

Decision:

- Approve P2 start / Request rework.

## Gate G2 (for P2 closure)

Must-have:

- Runtime end-to-end demo passes.
- Reliability test report accepted.
- Telemetry dashboards validated.

Decision:

- Approve P3 start / Request rework.

## Gate G3 (for P3 closure)

Must-have:

- Provenance verification tests passed.
- Guardrail policy tests passed.
- Audit trace completeness confirmed.

Decision:

- Approve P4 start / Request rework.

## Gate G4 (for P4 closure)

Must-have:

- Each core module accepted independently.
- Cross-module compatibility verified.
- Product telemetry in place.

Decision:

- Approve P5 start / Request rework.

## Gate G5 (for P5 closure)

Must-have:

- Mobile MVP accepted.
- Mobile reliability and funnel metrics validated.

Decision:

- Approve P6 start / Request rework.

## Gate G6 (for P6 closure)

Must-have:

- Security hardening complete.
- Runbooks and compliance package accepted.
- Production readiness Go/No-Go approved.

Decision:

- Approve P7 start / Request rework.

## Gate G7 (for P7 closure)

Must-have:

- Regional rollout checklist complete.
- KPI operations cadence active with owners.
- Scale risks within accepted thresholds.

Decision:

- Program complete / Enter next planning cycle.

## 3. Approval Record Template

- Gate ID:
- Phase:
- Date:
- Approver:
- Decision: Approved / Rework
- Blocking issues:
- Required follow-up:

## 4. What Was Missing and Now Added

- Explicit risk ownership per high-impact risk.
- Non-skippable gate criteria per phase.
- Mandatory evidence requirements before gate approval.
- Clear approve/rework decisions at every gate.
