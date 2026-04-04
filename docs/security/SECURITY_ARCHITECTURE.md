# IAI.ONE — SECURITY ARCHITECTURE

## 1. SECURITY POSITION

IAI.ONE handles life data, behavioral signals, proof records, and long-term analysis.  
Security posture must therefore be:

- privacy-first
- least privilege
- proof-preserving
- auditable by design

---

## 2. TRUST BOUNDARIES

### Boundary A — Public Surfaces

- iai.one
- home.iai.one
- docs.iai.one
- developer.iai.one (public docs only)

Risks:

- spoofed content
- SEO poisoning
- misinformation

Controls:

- static hosting
- strict CSP
- immutable deploys
- signed release trail

### Boundary B — Authenticated User Surfaces

- app.iai.one
- lifecode.iai.one
- dash.iai.one

Risks:

- session theft
- account takeover
- data leakage

Controls:

- secure cookies / token rotation
- MFA optional / required by role
- device/session management
- sensitive route rate limiting

### Boundary C — Internal Execution Layer

- api.iai.one
- api.flow.iai.one
- queues / DOs / jobs

Risks:

- privilege escalation
- malicious workflow execution
- replay attacks

Controls:

- signed internal calls
- scoped service tokens
- idempotency keys
- execution audit logs

### Boundary D — High-Risk Systems

- proof layer
- privacy export/delete
- admin routes
- organization snapshots

Controls:

- dual confirmation for destructive actions
- role separation
- immutable audit logs
- delayed execution for deletion requests

---

## 3. IDENTITY & ACCESS

### Authentication

- Email/password or magic link
- OAuth only if privacy review passes
- Refresh token rotation
- session revocation support

### Authorization

- RBAC + scoped permissions
- Role examples:
  - observer
  - participant
  - contributor
  - protocol_holder
  - admin
  - org_admin
  - internal_service

### Least Privilege

- Public routes separated from authenticated routes
- Internal APIs inaccessible from browser unless proxied safely
- Admin routes isolated by role and environment

---

## 4. DATA CLASSIFICATION

### P0 — Highly Sensitive

- birth date / birth time
- behavioral history
- check-in notes
- privacy requests
- raw AI prompts tied to personal records

Requirements:

- encryption at rest where supported
- application-layer encryption for especially sensitive blobs
- no accidental logging
- no third-party analytics payload inclusion

### P1 — Sensitive

- scores
- risk windows
- proof metadata
- org snapshots

### P2 — Operational

- flow definitions
- run logs
- non-sensitive metrics

### P3 — Public

- docs
- published content
- public product metadata

---

## 5. ENCRYPTION STRATEGY

- TLS everywhere
- Encrypt secret-bearing config in deployment environment
- Application-layer encryption for P0 blobs before DB storage where feasible
- Hash-only storage for verification artifacts when raw storage unnecessary
- Passwords: strong adaptive hash only
- API keys: store hash, never raw key after creation

---

## 6. LOGGING & AUDIT

All sensitive actions must write immutable audit events:

- login / logout
- role grant / revoke
- proof create / revoke / verify
- privacy export / delete
- admin access
- workflow execution of high-risk nodes

Audit log fields:

- actor
- action
- target
- timestamp
- ip
- user agent
- metadata

Do not store secrets or raw personal note content in logs.

---

## 7. SECURE FLOW EXECUTION

Flow engine security requirements:

- Every run gets run_id + trace_id
- Input/output size limits
- Step timeout enforced
- Retry count capped
- High-risk nodes require elevated permission
- All external calls domain-allowlisted if possible
- Webhook signatures validated
- Dead letter queue for repeated failures

---

## 8. PROOF LAYER SECURITY

- Proof creation must be deterministic
- Hash algorithm version stored
- Revocation never deletes historical audit
- Signature chain append-only
- Public proof views expose only approved metadata
- Raw payload access controlled separately from proof existence

---

## 9. AI SAFETY CONTROLS

AI is assistant only, not authority.

Controls:

- store model name + prompt version
- safety flags on generated outputs
- no autonomous destructive actions
- no direct user-facing medical/legal/financial conclusions
- AI suggestions must be framed as suggestions, not commands

---

## 10. PRIVACY OPERATIONS

User rights:

- export data
- delete data
- rectify profile
- restrict visibility

Implementation:

- privacy request queue
- verification step before execution
- deletion is logical + physical where possible
- preserve minimal audit evidence of request handling

---

## 11. INFRASTRUCTURE SECURITY

### Cloudflare

- Access control by environment
- Secrets per worker
- Separate production vs staging
- Rate limiting and WAF on public APIs
- Turnstile only on abuse-prone public endpoints

### VPS / Mail

- isolate mail from app plane
- patching policy documented
- backup encryption
- SSH key-only
- fail2ban / monitoring

---

## 12. BACKUP & RECOVERY

- Daily DB backup
- Versioned object backup
- Weekly restore test
- Separate storage account/zone for critical backups
- Recovery runbook required

RPO target:

- 24h max initially

RTO target:

- 4h to critical services, then improve

---

## 13. INCIDENT RESPONSE

Severity levels:

- Sev1: data exposure / widespread auth failure
- Sev2: proof integrity issue / admin abuse
- Sev3: partial service degradation
- Sev4: non-sensitive defect

Minimum incident runbook:

1. detect
2. contain
3. revoke/rotate
4. assess impact
5. notify affected parties if needed
6. post-incident review
7. preventive patch

---

## 14. NON-NEGOTIABLES

- No ad trackers on authenticated surfaces
- No sale or sharing of life data
- No public indexing of private surfaces
- No hidden dark patterns
- No gamification loops that pressure disclosure
- No direct coupling of personal scores to coercive organizational control

---

## 15. REQUIRED FILES / ARTIFACTS IN REPO

- SECURITY.md
- INCIDENT_RESPONSE.md
- PRIVACY_DATA_MAP.md
- BACKUP_RECOVERY_RUNBOOK.md
- ACCESS_CONTROL_MATRIX.md
- SECRET_ROTATION_POLICY.md
