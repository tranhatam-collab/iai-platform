# QUEUE_CONSUMER_IDEMPOTENCY_SPEC.md
## IAI Flow — Queue Consumer Idempotency
## Version 1.0

---

# 0. GOAL

Ensure all queue consumers are safe under:
- retries
- duplicates
- partial failures

---

# 1. PRINCIPLE

Queue delivery = at least once  
→ consumers MUST be idempotent

---

# 2. IDEMPOTENCY KEY

Every message must include:
- idempotency_key

Format:
workspace_id + run_id + step_key + event_type

---

# 3. PROCESS FLOW

Consumer must:

1. check idempotency store
2. if processed → skip
3. process logic
4. mark as processed

---

# 4. STORAGE

Idempotency table:

idempotency_key
processed_at
result_hash

---

# 5. RETRY CASES

## transient failure
→ retry safe

## duplicate delivery
→ ignored

## partial write
→ detect + re-run safely

---

# 6. SAFE OPERATIONS

Allowed:
- insert if not exists
- upsert
- append logs

Avoid:
- destructive overwrite
- non-guarded updates

---

# 7. BILLING PROTECTION

- usage_event must not duplicate
- cost must not double count

---

# 8. APPROVAL PROTECTION

- approval must not duplicate
- approval resolution must be single

---

# 9. LOGGING

Every consumer must log:
- message_id
- idempotency_key
- outcome

---

# 10. FINAL DIRECTIVE

If idempotency is broken:
→ billing breaks
→ state breaks
→ trust collapses
