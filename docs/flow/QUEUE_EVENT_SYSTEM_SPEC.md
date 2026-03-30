# QUEUE_EVENT_SYSTEM_SPEC.md

## IAI Flow — Queue and Event System Specification

**Version 1.0**

---

## 0. GOAL

Design the asynchronous event backbone for:

- run dispatch
- retries
- fan-out
- logs
- notifications
- billing events
- agent handoffs

Queues provide reliable buffering; messages are retained until successfully consumed. Design consumers as **idempotent** (at-least-once semantics in practice).

**References:**

- [Cloudflare Queues](https://developers.cloudflare.com/queues/)
- [Stripe Billing Meter](https://docs.stripe.com/api/billing/meter)

---

## 1. PRINCIPLES

1. Every major state change emits an event
2. Events are immutable
3. Consumers must be idempotent
4. Retry logic is consumer-safe
5. Queue is the async backbone, not the source of truth
6. D1/DO remain the truth, queue delivers work

---

## 2. EVENT CATEGORIES

### Runtime events

- run.created
- run.started
- run.paused
- run.resumed
- run.completed
- run.failed
- step.started
- step.completed
- step.failed

### Agent events

- agent.run.started
- agent.run.completed
- agent.tool.called
- agent.handoff.created

### Approval events

- approval.requested
- approval.approved
- approval.rejected
- approval.expired

### Billing events

- usage.recorded
- credits.debited
- invoice.shadow.updated

### Notification events

- user.notify
- workspace.alert
- webhook.dispatch

---

## 3. QUEUE TOPOLOGY

### flow-execution-queue

Dispatch step execution and child jobs.

### flow-events-queue

Fan-out domain events to downstream consumers.

### billing-queue

Usage aggregation, Stripe meter event submission.

### notifications-queue

Email, webhook, Slack, in-app notifications.

### logs-queue

Batch log persistence and export.

---

## 4. MESSAGE ENVELOPE

Every queue message must include:

- message_id
- event_name
- event_version
- occurred_at
- workspace_id
- run_id nullable
- step_key nullable
- actor_type nullable
- actor_ref nullable
- payload
- idempotency_key
- trace_id

---

## 5. PRODUCER RULES

Producer must:

1. write authoritative state first
2. enqueue event second
3. include idempotency_key
4. never assume immediate delivery
5. never use queue as only record of truth

---

## 6. CONSUMER RULES

Consumer must:

1. validate message shape
2. check idempotency_key
3. read current source-of-truth state if needed
4. process safely
5. ack only on success
6. write failure logs on error

---

## 7. EXAMPLE FLOW: step completed

1. Step handler finishes
2. Durable state updated
3. D1 run_steps updated
4. `step.completed` event enqueued
5. Event consumer:
   - updates analytics
   - triggers next step fan-out if needed
   - records billing usage
   - emits notification if policy requires

---

## 8. FAN-OUT RULE

Never put every downstream side effect in the main execution path.

Use event fan-out to separate:

- critical path
- billing
- notifications
- analytics
- archival logs

---

## 9. RETRY STRATEGY

Treat delivery as **at-least-once** from the application’s perspective: consumers must survive duplicate delivery safely.

**Retry categories:**

- transient external failure → retry
- malformed message → dead-letter/log
- business conflict → inspect state, often no retry
- billing sync failure → retry with bounded backoff

---

## 10. DEAD LETTER POLICY

If a message repeatedly fails:

- move to dead-letter store/log
- create alert
- expose in dash queue-inspection UI

---

## 11. EVENT VERSIONING

- Event names are stable
- Payloads are versioned

Format:

- event_name = `step.completed`
- event_version = `1`

Never break old consumers silently.

---

## 12. BILLING EVENT FLOW

1. step completed
2. usage event generated
3. billing-queue consumer aggregates
4. meter event sent to Stripe when needed
5. internal shadow ledger updated

Use Stripe meters and meter events as the invoicing-grade usage sink. See [Stripe Billing Meter](https://docs.stripe.com/api/billing/meter).

---

## 13. LOG EVENT FLOW

1. runtime produces logs
2. logs buffered
3. logs-queue batches to D1/R2
4. dash queries indexed summary, not raw giant payloads

---

## 14. ALERTING

Create alerts for:

- queue backlog too large
- repeated consumer failure
- billing sync failure
- approval stuck beyond SLA
- workflow failure spikes

---

## 15. FINAL DIRECTIVE

Queues are the async circulatory system.  
Do not overload the synchronous execution path with everything.

---

END
