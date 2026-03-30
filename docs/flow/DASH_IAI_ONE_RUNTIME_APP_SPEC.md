# DASH_IAI_ONE_RUNTIME_APP_SPEC.md
## IAI Flow / Dash — Runtime Application Specification
## Version 1.0

---

# 0. GOAL

Define the runtime-facing dashboard application for:
- operators
- builders
- workspace admins
- billing admins
- approval reviewers

Dash is not a marketing surface.
Dash is the operational control plane UI for real runs, real queues, real approvals, and real billing visibility.

---

# 1. DESIGN PRINCIPLES

1. Truth over polish
2. Real data only
3. Workspace-aware at all times
4. Environment-aware at all times
5. Fast operator comprehension
6. No hidden state transitions
7. Every critical number must drill down to evidence

---

# 2. PRIMARY USER TYPES

## Workspace Owner
Needs:
- workspace summary
- plan/billing overview
- critical run health
- team visibility
- approval backlog
- usage/overage risk

## Admin / Operator
Needs:
- execution state visibility
- queue health
- failure triage
- replay / cancel / inspect
- alert handling

## Editor / Builder
Needs:
- recent flows
- last run results
- validation status
- publish history
- node-level diagnostics

## Billing Admin
Needs:
- usage analytics
- credit ledger
- invoice shadow
- meter drift
- overage warnings

## Approval Reviewer
Needs:
- pending approvals
- policy context
- payload snapshot
- approve / reject / expire

---

# 3. GLOBAL APP FRAME

## 3.1 Top Bar
Must always show:
- workspace switcher
- environment switcher
- current user
- current plan
- alert badge
- queue health indicator

## 3.2 Left Navigation
Core sections:
- Overview
- Runs
- Flows
- Approvals
- Queue Health
- Logs
- Billing
- Alerts
- Settings

Optional later:
- Agents
- Registry
- Templates
- Marketplace
- Compliance

## 3.3 Global Search
Search across:
- run ID
- flow name
- step key
- approval ID
- alert ID
- workspace object slug

---

# 4. OVERVIEW SCREEN

## Goal
Provide the operator with a 30-second truth picture.

## Required panels

### Workspace Snapshot
- active plan
- current environment
- runs today
- success rate
- queue backlog
- active approvals
- projected usage status

### Recent Run Activity
- last 20 runs
- status
- duration
- cost
- trigger type
- initiated by

### Alerts Summary
- open critical alerts
- queue issues
- billing drift alerts
- approval SLA breaches

### Cost Snapshot
- current period usage
- credits remaining
- projected overage
- most expensive flows

### Approval Snapshot
- pending count
- oldest pending age
- approvals by policy

### Queue Snapshot
- execution queue depth
- events queue depth
- billing queue depth
- notifications queue depth
- logs queue depth

---

# 5. RUNS SCREEN

## Goal
Primary operator screen for execution truth.

## Table columns
- run_id
- flow_name
- environment
- trigger_type
- status
- current_step
- started_at
- duration_ms
- total_cost
- trace_id

## Filters
- status
- flow
- environment
- trigger type
- date range
- actor
- high-cost only
- failed only

## Run row actions
- open detail
- cancel run
- retry failed run (policy-gated)
- export run summary
- copy run id / trace id

---

# 6. RUN DETAIL SCREEN

## Sections

### Run Header
- run_id
- flow
- version
- workspace
- environment
- trigger source
- status
- started / ended
- total cost
- trace id

### Step Timeline
Each step shows:
- step key
- step type
- status
- attempts
- duration
- cost
- queue message id if relevant
- artifact refs
- error summary if failed

### Input / Output
- small payload preview inline
- large payload reference to artifact viewer
- content type
- source ref

### Events
List relevant emitted events:
- step.started
- step.completed
- usage.recorded
- approval.requested
- notifications sent

### Cost Breakdown
- orchestration overhead
- each step cost
- agent token cost
- premium node cost

### Operator Actions
- replay single step (if policy allows)
- cancel pending downstream
- mark for investigation
- create alert
- attach internal note

---

# 7. FLOWS SCREEN

## Table columns
- flow name
- slug
- current version
- status
- trigger types
- last run
- run volume 7d
- failure rate 7d
- avg cost per run
- owner

## Actions
- open flow
- inspect versions
- publish version
- archive flow
- clone flow
- open schedules

## Must surface
- unpublished changes
- draft vs active clearly separated
- environment promotion state

---

# 8. APPROVALS SCREEN

## Goal
Single place to operate human-in-the-loop steps.

## Table columns
- approval_id
- run_id
- step_key
- requested_by
- assigned_to
- policy_key
- status
- created_at
- age
- workspace

## Filters
- status
- assigned_to
- policy
- age > SLA
- environment

## Approval detail
Must show:
- payload preview
- reason
- source flow
- related run context
- related user context if allowed
- policy explanation

## Actions
- approve
- reject
- expire
- reassign
- attach reviewer note

Approval actions must write audit log.

---

# 9. QUEUE HEALTH SCREEN

## Goal
Operational truth for async system health.

## For each queue show:
- queue name
- pending depth
- oldest message age
- recent throughput
- recent failures
- dead-letter count
- consumer health

## Actions
- inspect queue stats
- inspect failed batches
- open alerts
- pause related scheduler if needed

## Warnings
- backlog thresholds
- repeated poison messages
- billing queue lag
- notification queue lag
- logs queue saturation

---

# 10. LOGS SCREEN

## Goal
Fast triage, not giant raw dump.

## Default view
- level
- timestamp
- run_id
- step_key
- message
- workspace
- context summary

## Filters
- level
- run_id
- flow
- date range
- event type
- high-cost runs
- failed runs

## Detail drawer
- full context json
- trace links
- related artifacts
- related approval
- related usage event

Large logs should be summarized here and archived to R2 when needed.

---

# 11. BILLING SCREEN

## Goal
Billing must be visible, explainable, and drillable.

## Panels

### Current Period Summary
- plan
- period dates
- credits granted
- credits used
- remaining credits
- projected overage

### Meter Summary
- run_count
- step_count
- agent_tokens
- premium_node_executions

### Cost Trend
- daily usage trend
- top expensive flows
- top expensive nodes
- cost by environment

### Ledger
- grants
- debits
- refunds
- adjustments
- expiry

### Invoice Shadow
- subtotal
- usage
- tax
- total
- reconciliation state

### Stripe Sync Health
- last sync time
- mismatch count
- drift threshold status

---

# 12. ALERTS SCREEN

## Table columns
- severity
- alert_type
- target_ref
- status
- opened_at
- age
- workspace

## Actions
- acknowledge
- assign
- resolve
- link to run / queue / billing / approval
- escalate

## Must support
- alert comment timeline
- root cause tag
- post-incident link

---

# 13. SETTINGS SCREEN

## Sections
- workspace settings
- environment settings
- api keys
- role management
- rate limits
- retention policy
- notification settings
- billing controls

Sensitive changes require higher permission and audit logs.

---

# 14. VISUAL STATUS SYSTEM

Use consistent status colors / chips:
- pending
- running
- paused
- failed
- completed
- canceled
- active
- archived
- drift
- critical

Never rely on color alone; always include text labels.

---

# 15. REQUIRED DRILL-DOWN RULE

Every summary card must click through to underlying truth:
- run count → filtered runs
- approval count → approvals list
- cost total → billing detail
- queue backlog → queue health screen
- alert count → alerts screen

No dead cards.

---

# 16. MOBILE / RESPONSIVE RULE

Dash is desktop-first, but must remain usable on tablet.
Mobile may be read-only for:
- overview
- alerts
- approvals summary
- recent runs

Do not attempt full builder UX on mobile in this phase.

---

# 17. PERFORMANCE RULES

- list virtualization for large logs/runs
- default date windows
- lazy load heavy drill-downs
- do not fetch large payloads until detail open
- summary endpoints should be optimized for Dash use

---

# 18. FINAL DIRECTIVE

Dash must act like an operator cockpit.
If a workspace has failures, cost spikes, queue issues, or stuck approvals, Dash must show them in under 10 seconds and let the operator drill to truth.
