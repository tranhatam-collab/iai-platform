# FLOW_EXECUTION_STATE_MACHINE.md
## IAI Flow — Execution State Machine
## Version 1.0

---

# 0. GOAL

Define the state machine for:
- runs
- steps
- approvals
- agent runs
- schedules

This document is the truth source for execution transitions.
No UI or service may invent custom transitions outside this model.

---

# 1. PRINCIPLES

1. Every state transition must be explicit
2. Invalid transitions must be blocked
3. State changes must be auditable
4. Durable state and D1 index state must remain consistent
5. Queue retries must not create illegal transitions
6. Human approvals are first-class state transitions, not side notes

---

# 2. RUN STATE MACHINE

## 2.1 Run States
- pending
- queued
- running
- paused
- waiting_approval
- waiting_schedule
- failed
- completed
- canceled

## 2.2 State Definitions

### pending
Run created but not yet accepted into execution coordination.

### queued
Run accepted and waiting for execution slot or downstream dispatch.

### running
At least one step is active or the coordinator is actively advancing the run.

### paused
Run intentionally halted by policy, operator, or system condition.

### waiting_approval
Run blocked on one or more approval records.

### waiting_schedule
Run created by scheduling logic but not yet time-eligible, or waiting deferred continuation.

### failed
Run reached terminal failure and will not continue automatically.

### completed
Run finished successfully and terminal actions are complete.

### canceled
Run intentionally terminated and will not continue.

---

## 2.3 Valid Run Transitions

- pending → queued
- queued → running
- running → paused
- running → waiting_approval
- running → waiting_schedule
- running → failed
- running → completed
- running → canceled
- paused → queued
- paused → canceled
- waiting_approval → queued
- waiting_approval → failed
- waiting_approval → canceled
- waiting_schedule → queued
- waiting_schedule → canceled
- failed → queued (only if explicit replay/retry policy allows)
- failed → canceled
- completed → no further execution states
- canceled → no further execution states

---

## 2.4 Invalid Run Transitions (examples)
- completed → running
- canceled → queued
- failed → completed
- pending → completed
- paused → completed without re-entering execution

---

# 3. STEP STATE MACHINE

## 3.1 Step States
- pending
- queued
- running
- waiting_input
- waiting_approval
- retrying
- failed
- completed
- skipped
- canceled

## 3.2 Step Definitions

### pending
Step exists in run graph but not yet eligible for execution.

### queued
Step dispatched and waiting for consumer/executor.

### running
Step actively executing.

### waiting_input
Step is blocked on external/manual/user/system input.

### waiting_approval
Step blocked on approval.

### retrying
Step previously failed but retry is scheduled.

### failed
Step terminal failure unless replay/retry explicitly invoked.

### completed
Step completed and output persisted.

### skipped
Step not executed because branch conditions or prior logic bypassed it.

### canceled
Step intentionally terminated due to run cancellation or operator action.

---

## 3.3 Valid Step Transitions

- pending → queued
- queued → running
- running → completed
- running → waiting_input
- running → waiting_approval
- running → retrying
- running → failed
- running → canceled
- waiting_input → queued
- waiting_input → failed
- waiting_input → canceled
- waiting_approval → queued
- waiting_approval → failed
- waiting_approval → canceled
- retrying → queued
- retrying → failed
- pending → skipped
- queued → canceled
- failed → queued (explicit replay only)
- failed → canceled
- completed → terminal
- skipped → terminal
- canceled → terminal

---

# 4. APPROVAL STATE MACHINE

## 4.1 Approval States
- pending
- assigned
- approved
- rejected
- expired
- canceled

## 4.2 Valid Transitions
- pending → assigned
- pending → approved
- pending → rejected
- pending → expired
- pending → canceled
- assigned → approved
- assigned → rejected
- assigned → expired
- assigned → canceled

Terminal:
- approved
- rejected
- expired
- canceled

## 4.3 Approval Effects on Runs/Steps

When approval enters:
- pending or assigned
related step must become `waiting_approval`
related run may become `waiting_approval` if no other runnable path exists

When approval becomes:
- approved
step re-enters `queued`
run may re-enter `queued`

When approval becomes:
- rejected / expired
step transitions to `failed` or `canceled` according to policy
run transitions according to failure policy

---

# 5. AGENT RUN STATE MACHINE

## 5.1 Agent Run States
- pending
- running
- waiting_tool
- waiting_handoff
- failed
- completed
- canceled

## 5.2 Valid Transitions
- pending → running
- running → waiting_tool
- running → waiting_handoff
- running → failed
- running → completed
- running → canceled
- waiting_tool → running
- waiting_tool → failed
- waiting_tool → canceled
- waiting_handoff → running
- waiting_handoff → failed
- waiting_handoff → canceled

---

# 6. SCHEDULE STATE MACHINE

## 6.1 Schedule States
- active
- paused
- disabled
- error

## 6.2 Valid Transitions
- active → paused
- active → disabled
- active → error
- paused → active
- paused → disabled
- error → active
- error → disabled

Disabled is terminal until manual reactivation.

---

# 7. TRANSITION TRIGGERS

## 7.1 System Triggers
- queue dispatch accepted
- step execution success
- step execution failure
- timeout
- retry timer
- scheduler fire
- artifact write success/failure

## 7.2 Human Triggers
- operator pause
- operator cancel
- approval approve/reject
- manual replay
- manual retry

## 7.3 Policy Triggers
- cost cap hit
- risk policy block
- approval required policy
- environment restriction
- secret/config invalidation

---

# 8. FAILURE POLICIES

Each flow and step may define:
- fail_fast
- continue_on_error
- bounded_retry
- manual_review_required

State machine must respect policy:
- fail_fast may move run directly to failed
- continue_on_error may mark step failed and allow branch continuation
- manual_review_required must enter waiting_approval or paused
- bounded_retry must move step into retrying then queued

---

# 9. REPLAY / RETRY RULES

## Replay
Creates a new execution attempt from:
- failed step
- failed run
- selected checkpoint

Replay must:
- write audit log
- preserve original trace linkage
- create new attempt markers
- not overwrite original artifacts

## Retry
Uses same step identity but increments attempt.
Retry must be idempotent-aware.

---

# 10. CONSISTENCY RULES

For each transition:
1. Durable Object hot state updates
2. D1 index row updates
3. event emitted
4. audit written if privileged or policy-relevant

If partial failure occurs:
- system must retry safe index sync or mark consistency alert

---

# 11. TIMEOUT RULES

Run timeout:
- may fail run or pause run according to policy

Step timeout:
- sets step to failed or retrying according to policy

Approval timeout:
- sets approval to expired
- propagates to step/run as policy defines

---

# 12. STATE MACHINE GUARDS

Before transition, validate:
- current state
- tenant/workspace context
- environment policy
- cost/risk constraints
- approval resolution
- executor ownership
- retry limits

No blind transition writes allowed.

---

# 13. OBSERVABILITY REQUIREMENTS

Every transition must produce:
- old_state
- new_state
- reason
- actor/system source
- timestamp
- run_id / step_id / approval_id
- trace_id

---

# 14. FINAL DIRECTIVE

The state machine is the spine of Flow.
If transitions are ambiguous, the platform becomes impossible to trust, debug, or bill correctly.
