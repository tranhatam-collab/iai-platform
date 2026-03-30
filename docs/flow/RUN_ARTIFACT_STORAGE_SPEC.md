# RUN_ARTIFACT_STORAGE_SPEC.md
## IAI Flow — Artifact Storage Specification
## Version 1.0

---

# 0. GOAL

Define how all execution data is stored:
- inputs
- outputs
- logs
- prompts
- files
- snapshots

---

# 1. STORAGE LAYERS

## D1
- metadata only
- references to artifacts

## R2
- large payloads
- logs
- media
- prompt/result blobs

## Durable Objects
- hot runtime state

---

# 2. ARTIFACT TYPES

- input
- output
- log
- snapshot
- file
- prompt
- result
- error

---

# 3. STORAGE DECISION RULE

IF payload < 10KB → D1 allowed  
IF payload >= 10KB → R2 only

---

# 4. ARTIFACT MODEL

artifact_id
run_id
step_key
artifact_type
storage_kind (d1 | r2 | do)
storage_ref
content_type
created_at

---

# 5. STORAGE REF FORMAT

## D1
- inline JSON

## R2
- bucket/key format:
  workspace_id/run_id/step_key/artifact_type/timestamp.json

---

# 6. WRITE FLOW

1. step executes
2. payload generated
3. decide storage
4. write to R2 or D1
5. insert artifact row
6. attach ref to run_steps

---

# 7. READ FLOW

1. fetch artifact metadata
2. detect storage_kind
3. fetch from D1 or R2
4. return formatted response

---

# 8. LOG HANDLING

- short logs → D1
- long logs → R2
- always indexed in D1

---

# 9. SECURITY

- enforce workspace isolation
- signed URLs for R2
- no public access by default

---

# 10. RETENTION

- logs older than X → archive
- artifacts compressible
- optional purge policy per workspace

---

# 11. FINAL DIRECTIVE

Artifacts are the memory of execution.

Never lose them.
Never overload D1 with them.
