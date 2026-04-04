# STRIPE_METER_INTEGRATION_SPEC.md
## IAI Flow — Stripe Meter Integration Specification
## Version 1.0

---

# 0. GOAL

Define how Flow integrates Stripe metered billing for:
- usage-based plans
- meter events
- subscription linkage
- shadow invoice reconciliation
- credit-aware product control

Stripe remains the invoicing-grade billing rail.
Flow maintains an internal shadow ledger for explainability, support, and product control.

---

# 1. PRINCIPLES

1. Stripe is the billing authority for invoiced usage
2. Internal usage events remain required for product truth
3. Every billed dimension must map cleanly from runtime events
4. Billing must be reconstructable from workspace → run → step → usage_event → meter submission
5. Failed meter submissions must be detectable and replayable safely

---

# 2. METERED BILLING MODEL

## Stripe-side concepts used
- Products
- Prices
- Meters
- Meter events
- Subscriptions
- Invoices

## Flow-side concepts used
- plans
- subscriptions
- usage_events
- usage_meters
- invoices_shadow
- credit_ledger

---

# 3. BILLABLE DIMENSIONS TO SUPPORT FIRST

### Meter 1 — run_count
Count each billable run according to policy.

### Meter 2 — step_count
Count each billable step execution.

### Meter 3 — agent_tokens
Track aggregated input + output token usage.

### Meter 4 — premium_node_executions
Count execution of premium marketplace or advanced nodes.

Optional later:
- storage_bytes
- compute_ms
- webhook_dispatch_volume

---

# 4. PLAN MODEL

Each plan must define:
- monthly_base_cents
- included_runs
- included_steps or equivalent credits
- included_agent_tokens
- overage pricing rules
- premium node policy
- hard limits vs soft limits

Plan examples:
- Free
- Pro
- Team
- Enterprise

The app UI must not expose opaque billing math.

---

# 5. WORKSPACE BILLING LINKAGE

Each workspace must store:
- stripe_customer_id
- stripe_subscription_id
- active_plan_id
- billing status
- current billing period boundaries

Personal users may bill directly through a personal workspace.
Organizations bill through organization workspaces.

---

# 6. USAGE EVENT CREATION RULES

Usage events are generated from runtime truth, not UI clicks.

## Trigger sources
- run.created or run.started
- step.completed
- agent.run.completed
- premium node execution
- optional storage aggregation jobs

Each usage event must include:
- workspace_id
- run_id nullable
- step_id nullable
- meter_key
- quantity
- unit
- source_type
- source_ref
- idempotency key
- created_at

---

# 7. INTERNAL AGGREGATION

Flow must aggregate usage internally into:
- usage_meters (period bucket summaries)
- credit_ledger (actual product-level debits)
- invoices_shadow (support-facing invoice approximation / mirror)

This internal aggregation is not a replacement for Stripe invoicing.
It is the product's explainability and control layer.

---

# 8. STRIPE METER EVENT SUBMISSION FLOW

## Step-by-step

1. Runtime event occurs
2. Internal `usage_event` row written
3. `billing-queue` receives `usage.recorded`
4. Billing consumer transforms event into Stripe meter event payload
5. Submit to Stripe
6. Store Stripe meter event reference on usage event where applicable
7. Update reconciliation status

Do not submit to Stripe synchronously in the critical execution path.

---

# 9. IDEMPOTENCY RULES

Because queue/event systems may retry:
- every usage_event must have a stable idempotency key
- Stripe submission wrapper must prevent duplicate meter event sends where possible
- reconciliation must detect duplicate internal or external submissions

Idempotency key suggestions:
- workspace_id + run_id + step_id + meter_key + canonical_attempt

---

# 10. CREDIT LEDGER LOGIC

Flow should maintain an internal credit ledger:
- monthly_grant
- usage_debit
- promo_grant
- refund_credit
- manual_adjustment
- expiry

Reasons:
- user-facing balance visibility
- support adjustments
- free-tier control
- pre-invoice warnings

Ledger must be append-only.

---

# 11. SHADOW INVOICE MODEL

`invoices_shadow` is a derived internal object used for:
- support explanation
- workspace dashboard visibility
- projected billing
- drift detection vs Stripe invoice

Fields should include:
- subtotal_cents
- usage_cents
- tax_cents
- total_cents
- currency
- status
- linked stripe invoice id if available

---

# 12. RECONCILIATION

A daily reconciliation job must:
1. aggregate internal usage by period and meter
2. compare with Stripe meter submissions and invoice preview/invoice data as available
3. flag mismatches
4. create billing alert if drift exceeds threshold

Drift examples:
- internal usage exists, Stripe event missing
- Stripe event duplicate
- internal count differs from invoiced quantity
- plan period mismatch

---

# 13. BILLING FAILURE SCENARIOS

## A. Stripe submission failed
Action:
- keep internal usage event
- mark unsynced
- retry via billing queue
- alert if backlog exceeds threshold

## B. Duplicate submission suspected
Action:
- quarantine event for review
- do not blindly resend

## C. Workspace hits quota before Stripe confirmation
Action:
- trust internal ledger for product control
- Stripe catches up through async sync

## D. Refund due to platform fault
Action:
- write credit_ledger refund_credit
- optionally issue Stripe credit note / invoice adjustment through billing ops

---

# 14. DASHBOARD REQUIREMENTS

Billing UI must show:

## Current Period
- plan
- period dates
- included quota
- used quota
- projected overage

## Meter Views
- run_count
- step_count
- agent_tokens
- premium nodes

## Cost Breakdown
- top expensive flows
- top expensive runs
- top expensive nodes
- trend over time

## Sync Health
- last Stripe sync
- unsynced events count
- drift alert state

---

# 15. ALERTING

Create alerts for:
- meter submission failures
- unsynced usage backlog
- projected overage threshold crossed
- plan hard limit reached
- reconciliation drift beyond threshold
- repeated duplicate/idempotency conflict

---

# 16. SECURITY / COMPLIANCE RULES

- Stripe keys must be environment-scoped
- billing routes role-gated
- no raw secret exposure in logs or Dash
- billing_admin role separate from system_admin where possible
- all billing adjustments auditable

---

# 17. TEST CASES DEV MUST COVER

1. single run → single usage event → single meter submission
2. retried step does not double bill incorrectly
3. failed queue consumer eventually syncs usage
4. premium node execution bills correctly
5. free plan hard limit blocks further runs according to policy
6. invoice shadow matches expected totals
7. refund/adjustment updates ledger and UI correctly

---

# 18. FUTURE SUPPORT

Later support may include:
- prepaid credits
- enterprise committed spend
- cost centers
- child workspace rollup billing
- reseller / agency billing
- usage caps by environment

Do not overbuild now; preserve schema compatibility.

---

# 19. FINAL DIRECTIVE

Stripe should invoice.
Flow should explain, control, and verify every charge.
If users cannot trace a bill back to real execution, trust will fail.
