# ARCHITECTURE_DECISIONS_LOG

Date: 2026-03-27  
Status: Initial ADR register for approval

## ADR-001: Monorepo Boundary

Decision:

- Use a single monorepo structure with `apps`, `packages`, `workers`, `infrastructure`, `docs`.

Why:

- Shared contracts, shared CI, and reduced integration drift.

Impact:

- Requires strict ownership boundaries and dependency policies.

Status: Proposed

## ADR-002: API Contract-First

Decision:

- Freeze OpenAPI contracts before major module implementation.

Why:

- Prevent front-end/back-end divergence and reduce rework.

Impact:

- Requires contract review gate in P1.

Status: Proposed

## ADR-003: Runtime State Model

Decision:

- Treat execution state and agent state as separate runtime concerns.

Why:

- Improves isolation, debuggability, and resilience.

Impact:

- Requires explicit state handoff contracts in P2.

Status: Proposed

## ADR-004: Provenance as Platform Primitive

Decision:

- Every governed output requires provenance metadata and verification pathway.

Why:

- Trust and compliance are core differentiators.

Impact:

- Adds mandatory verification checks to product flows.

Status: Proposed

## ADR-005: Charter Guardrails in Execution Path

Decision:

- Apply guardrails at runtime action boundary, not just UI layer.

Why:

- UI-only controls are bypassable and insufficient for governance.

Impact:

- Requires policy engine test coverage in P3.

Status: Proposed

## ADR-006: Progressive Module Rollout

Decision:

- Release product modules independently with per-module acceptance gates.

Why:

- Reduces blast radius and improves learning cycle.

Impact:

- More release overhead, but higher confidence.

Status: Proposed

## ADR-007: Security and Compliance Before Scaleout

Decision:

- Production hardening and compliance acceptance are mandatory before regional scaling.

Why:

- Prevents unstable scaling and regulatory exposure.

Impact:

- Scale timeline depends on P6 completion quality.

Status: Proposed

## ADR-008: Evidence-Based Phase Closure

Decision:

- Phase closure requires measurable artifacts (tests, reports, docs, approvals).

Why:

- Prevents subjective completion claims.

Impact:

- Adds review workload but improves delivery integrity.

Status: Proposed

## Open Decisions Still Missing

- Final environment separation model and release branching strategy.
- Final data retention policy for audit/provenance artifacts.
- Certification scoring model and governance thresholds.
- Enterprise tenant isolation model.
- Regional replication strategy and failover policy.

## Approval Protocol

- Proposed -> Accepted or Rejected by designated approver.
- Any Accepted ADR supersedes conflicting older decisions.
- Changes after acceptance require an ADR update entry.
