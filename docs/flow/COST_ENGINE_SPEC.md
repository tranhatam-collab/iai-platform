# COST_ENGINE_SPEC.md

## IAI Flow — Cost Engine and Billing Logic

**Version 1.0**

---

## 0. GOAL

Define how Flow calculates:

- per-step cost
- per-run cost
- per-agent cost
- monthly usage
- credits
- overages
- invoice shadow totals

**References:**

- [Stripe usage-based billing / pricing](https://docs.stripe.com/billing/subscriptions/usage-based/pricing-plans)
- [Stripe Billing Meter API](https://docs.stripe.com/api/billing/meter)

---

## 1. PRICING PRINCIPLE

Users should never feel billing is mysterious.

Billing must be:

- explainable
- auditable
- reconstructable
- visible in dash per run and per workspace

---

## 2. BILLABLE DIMENSIONS

### A. Run count

Each completed or started run counts against plan quota.

### B. Step executions

Each executed step consumes credits.

### C. Agent tokens

Input and output tokens from model usage.

### D. Compute time

Optional internal metric for premium plans.

### E. Storage

Optional later for large artifact/storage-heavy customers.

---

## 3. INTERNAL COST UNITS

Use one internal normalized unit: **`microcredits`**

Reason:

- price many dimensions consistently
- support free tier and enterprise custom pricing
- keep UI simple

**Example conversion:**

- 1 basic step = 100 microcredits
- 1 agent step = model-cost-derived microcredits
- 1,000 tokens = X microcredits (plan-defined)
- 1 approval step = low or zero microcredits depending on plan

---

## 4. STEP COST MODEL

Each step records:

- base_cost_micros
- variable_cost_micros
- total_cost_micros

### Base cost

Depends on step type: API, transform, delay, logic, human, agent.

### Variable cost

Depends on:

- token usage
- external API markups if applicable
- execution duration tier
- premium node usage

---

## 5. RUN COST MODEL

**Run total** =

sum(step total costs)  
+ orchestration overhead  
+ agent token costs  
+ premium integrations markups if any

Store on:

- run_steps.cost_micros
- runs.total_cost_micros (derived or denormalized)

---

## 6. BILLING PLAN MODEL

### Free

- limited runs
- limited step count
- limited agent tokens
- modest queue throughput

### Pro

- higher quotas
- usage-based overage enabled

### Team

- pooled usage
- workspace billing
- approval/history/log retention

### Enterprise

- custom ceilings
- reserved capacity
- premium support
- optional private routing/compliance features

---

## 7. METER MAPPING TO STRIPE

Recommended Stripe meters:

- run_count
- step_count
- agent_tokens
- premium_node_executions

Each billable internal event may map to one Stripe meter event.

---

## 8. CREDIT LEDGER MODEL

Credit ledger entry types:

- monthly_grant
- usage_debit
- promo_grant
- refund_credit
- manual_adjustment
- expiry

**Rules:**

- ledger is append-only
- balance is derivable
- support team can explain every adjustment

---

## 9. BILLING UI REQUIREMENTS (dash.iai.one)

### Workspace summary

- plan
- current period
- credits remaining
- projected overage

### Run detail

- total cost
- cost breakdown by step
- agent token usage
- premium node usage

### Billing analytics

- top expensive flows
- top expensive nodes
- usage by environment
- usage trend over time

---

## 10. ALERTS

Alert users when:

- 50% quota used
- 80% quota used
- 100% quota reached
- projected overage exceeds threshold
- billing sync failed

---

## 11. RECONCILIATION

**Daily job:**

- recalculate internal usage summary
- compare with Stripe meter submission count
- flag drift
- create billing alert if mismatch exceeds threshold

---

## 12. REFUNDS + ADJUSTMENTS

Use credit ledger, not raw invoice hacks, for most goodwill adjustments.

**Reasons:**

- failed run caused by platform fault
- duplicate charge due to replay bug
- support-approved credit restoration

---

## 13. COST SAFETY RULES

- cap run cost per run where possible
- cap agent loops
- cap token usage per agent step
- require approval for high-cost runs if policy enabled

---

## 14. FINAL DIRECTIVE

Billing must be traceable from:

**workspace → run → step → usage event → ledger → invoice**

If you cannot explain a charge, the system is broken.

---

END
