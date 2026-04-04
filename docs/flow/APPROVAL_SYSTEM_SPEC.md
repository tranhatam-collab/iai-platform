# APPROVAL_SYSTEM_SPEC.md
## IAI Flow — Approval System Specification
## Version 1.0

---

# 0. GOAL

Define the approval subsystem for:
- human-in-the-loop steps
- sensitive actions
- cost/risk gating
- compliance workflows
- policy-based execution pause/resume

Approvals are not comments or notes.
They are executable control objects that affect runtime state.

---

# 1. PURPOSE OF APPROVALS

Approvals exist when a workflow cannot or should not continue automatically.

Examples:
- high-cost run
- destructive external action
- sensitive data release
- regulated business action
- legal review
- human judgment checkpoint

---

# 2. APPROVAL OBJECT MODEL

Each approval must include:
- approval_id
- workspace_id
- run_id
- step_key
- status
- requested_by
- assigned_to
- policy_key
- reason
- payload_ref
- created_at
- resolved_at
- resolution_note
- expires_at

---

# 3. APPROVAL STATES

- pending
- assigned
- approved
- rejected
- expired
- canceled

State transitions must follow `FLOW_EXECUTION_STATE_MACHINE.md`.

---

# 4. APPROVAL TRIGGERS

## 4.1 Explicit Node Requirement
A flow step is configured as approval-required.

## 4.2 Policy Trigger
Approval generated due to:
- cost threshold
- environment rule
- role restriction
- compliance tag
- external risk score

## 4.3 System Trigger
Approval created by runtime when:
- anomaly detected
- repeated retries exhausted
- proof mismatch found
- destructive action about to run

---

# 5. APPROVAL TYPES

### Manual Step Approval
Human must review before step continues.

### Policy Approval
Triggered by workspace or environment policy.

### Cost Approval
Triggered when estimated cost exceeds threshold.

### Security Approval
Triggered for secret changes, admin actions, or sensitive route execution.

### Data Release Approval
Triggered before data export, public proof exposure, or external disclosure.

### Compliance Approval
Triggered by regulated or enterprise policy packs.

---

# 6. APPROVAL PAYLOAD DESIGN

Approval payload must be:
- enough to decide
- not larger than necessary
- safe to preview
- referenceable from artifacts

Payload structure should include:
- subject summary
- flow context
- risk summary
- expected next action
- potential side effects
- direct links to run / step / artifacts

Do not embed giant raw payloads directly in D1 approval rows.
Use payload_ref for heavy details.

---

# 7. ASSIGNMENT MODEL

Approvals may be:
- unassigned
- directly assigned to a user
- assigned to a role pool
- assigned by policy key

Examples:
- `billing_admin`
- `security_admin`
- `workspace_owner`
- `specific_user_id`

---

# 8. SLA / EXPIRY MODEL

Each approval type may define:
- target response SLA
- expiry duration
- escalation path

Examples:
- normal approval: 24h
- high-cost run: 2h
- production destructive action: 30m
- compliance/legal review: 72h

On expiry:
- approval status = expired
- related step/run follows configured expiry policy

---

# 9. APPROVAL UI REQUIREMENTS

Approval list must show:
- age
- severity/risk
- assigned_to
- policy origin
- run and flow context
- environment
- workspace

Approval detail must show:
- concise subject summary
- reason
- payload preview
- related artifacts
- potential consequences
- approve / reject buttons
- audit note box

No approval UI should require opening raw JSON first just to understand context.

---

# 10. POLICY ENGINE INTEGRATION

Policies should be definable at:
- workspace level
- environment level
- flow level
- node level

Policy examples:
- if estimated_cost > threshold → approval required
- if environment = prod AND node = destructive_api_call → approval required
- if data_visibility changes from private to public → approval required
- if proof_revocation requested → dual approval required

---

# 11. DUAL-CONTROL CASES

The following should support dual approval or second confirmation:
- proof revocation
- org-wide export
- destructive prod workflow
- secret changes affecting prod
- large billing adjustment
- public release of sensitive artifact

Dual control model:
- requester cannot be sole approver
- second approval recorded separately
- final resolution only after both approvals

---

# 12. APPROVAL EFFECT ON RUNTIME

When approval requested:
- step enters `waiting_approval`
- run may enter `waiting_approval`

When approved:
- step returns to `queued`
- run resumes if no other blockers exist

When rejected:
- step fails or cancels according to policy
- run fails / pauses / cancels according to policy

When expired:
- policy determines fail / cancel / escalate

---

# 13. AUDIT REQUIREMENTS

Every approval event must log:
- who requested
- why
- who assigned
- who approved/rejected
- when
- what notes were added
- what state transition occurred in run/step

No silent approval resolution.

---

# 14. NOTIFICATION RULES

Approval events may trigger:
- in-app notification
- email
- Slack/chat webhook
- escalation alert after SLA breach

Notification queue should be async, not in critical execution path.

---

# 15. SECURITY RULES

- only authorized reviewers can resolve approvals
- assignment must be tenant-scoped
- approval payload preview must honor visibility rules
- raw secrets or hidden tokens must never appear in approval payloads
- reject reason may be mandatory for some approval types

---

# 16. METRICS

Track:
- approvals created per day
- approvals by type
- average time to approve
- rejection rate
- expiry rate
- SLA breaches
- approvals blocking top revenue or critical flows

These metrics feed Dash and Ops review.

---

# 17. FUTURE SUPPORT

Future enhancements may include:
- approval templates
- policy packs
- mobile approval UX
- delegated approver chains
- legal signature integration
- multi-party quorum approval

Do not build all of these now, but keep schema and state machine compatible.

---

# 18. FINAL DIRECTIVE

Approval is not an interruption.
It is a designed control layer that makes automation safe enough to trust.
