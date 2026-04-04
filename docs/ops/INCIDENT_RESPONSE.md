# IAI.ONE — INCIDENT RESPONSE PLAN

## 1. PURPOSE

This document defines the minimum incident response process for:

- security breaches
- privacy failures
- proof integrity issues
- system-wide operational failures
- abuse of privileged access

**Objectives:** contain fast, protect people, preserve evidence, recover safely, learn and harden.

---

## 2. INCIDENT SEVERITY LEVELS

### SEV1 — Critical

**Examples:** confirmed exposure of sensitive personal data; account takeover at scale; proof integrity failure affecting trust layer; auth system compromise; admin credential compromise; deletion or corruption of critical production data.

**Expected response:** immediate; all relevant operators engaged; containment first.

### SEV2 — High

**Examples:** partial exposure risk; repeated unauthorized access in limited scope; organization data leakage risk; flow engine causing destructive unintended actions; privacy request process compromised.

**Expected response:** within hours; isolate affected system area.

### SEV3 — Moderate

**Examples:** service degradation; limited feature abuse; proof verification inconsistencies without confirmed compromise; non-sensitive route outage.

**Expected response:** same day; fix and monitor.

### SEV4 — Low

**Examples:** logging issues; non-sensitive bug; cosmetic security hardening need; suspicious but unconfirmed event.

**Expected response:** schedule fix; document pattern.

---

## 3. INCIDENT TYPES

1. Identity / authentication incident
2. Data exposure incident
3. Proof integrity incident
4. Workflow abuse incident
5. Admin misuse incident
6. AI safety incident
7. Infrastructure outage incident
8. Privacy request mishandling incident

---

## 4. RESPONSE TEAM ROLES

- **Incident Lead** — coordinates response, priority calls, owns timeline.
- **Security Lead** — containment, investigation, credential rotation, system risk.
- **Privacy Lead** — personal data impact and user notification obligations.
- **Platform Lead** — application behavior, deployment rollback, recovery.
- **Communications Lead** — internal/external messaging if needed.
- **Evidence Recorder** — incident log, timeline, decisions, artifacts.

*Note:* Small teams may combine roles; responsibilities must still be explicitly assigned.

---

## 5. RESPONSE PHASES

### Phase 1 — Detect

**Trigger sources:** monitoring alert; unusual audit logs; user report; failed proof verification anomaly; abnormal auth pattern; data integrity mismatch.

**Immediate actions:** classify severity; open incident record; identify affected systems.

### Phase 2 — Contain

**Objectives:** stop ongoing harm; preserve evidence; prevent spread.

**Possible actions:** revoke sessions; disable affected API keys; pause flows/schedules; lock high-risk routes; isolate workers/services; degraded mode.

### Phase 3 — Assess

**Questions:** what happened; who/what is affected; what data classes; is incident ongoing; what evidence; what obligations.

### Phase 4 — Eradicate

Remove malicious access; patch; rotate credentials; restore trusted config; remove malicious flows or compromised artifacts.

### Phase 5 — Recover

Restore production safely; validate critical paths; monitor for recurrence; re-enable services gradually.

### Phase 6 — Review

Timeline; root cause; impact; control failures; corrective actions; preventive hardening.

---

## 6. FIRST 30 MINUTES CHECKLIST

1. Create incident ID
2. Assign Incident Lead
3. Snapshot evidence: logs, affected route, actor/session IDs, timestamps
4. Stop obvious ongoing abuse if safe
5. Decide severity
6. Disable only what is necessary
7. Avoid destroying evidence
8. Start written timeline

---

## 7. INCIDENT LOG TEMPLATE

Each incident record must contain:

- incident ID
- title
- severity
- detected at / by
- systems affected
- current status
- timeline of actions
- decisions made
- users/orgs potentially affected
- evidence locations
- postmortem owner

---

## 8. CONTAINMENT PLAYBOOKS

### 8.1 Auth Compromise

Revoke all sessions for affected accounts; rotate refresh signing secret if systemic; require password reset or re-auth; inspect admin actions during compromise window.

### 8.2 API Key Leak

Revoke key; identify all calls; assess data touched; issue replacement if needed.

### 8.3 Proof Integrity Issue

Freeze public proof verification if trust uncertain; mark affected proofs under review; compare hashes, source refs, signatures; preserve hash lineage; do not silently delete evidence.

### 8.4 Workflow Abuse

Disable offending flow; stop schedules; inspect step outputs and external calls; identify side effects; notify operators if needed.

### 8.5 Privacy Exposure

Identify exposed categories; determine if raw P0/P1 involved; stop route/access path; prepare user notice if required; log legal obligations if applicable.

---

## 9. NOTIFICATION RULES

### Internal notification

Required for: all SEV1, all SEV2, any admin misuse, any proof integrity incident.

### User notification

Required when: personal data may have been exposed; proof outcomes relied upon may be invalid; account access compromised; deletion/export integrity affected.

**Principles:** factual, minimal but clear, no speculation, include next steps for user.

### External / public statement

Only if: broad user impact; trust layer impact; public proof verification impact; legal requirement.

---

## 10. EVIDENCE HANDLING

**Do:** preserve logs; snapshot configs; copy relevant DB records; record hashes of evidence files; immutable storage where possible.

**Do not:** overwrite logs unnecessarily; delete suspicious records before copying; change timestamps manually; run normal cleanup on affected data without review.

---

## 11. RECOVERY VALIDATION CHECKLIST

Before closing:

- auth works; sensitive routes gated; keys rotated
- core app flows tested; proof verification tested; dashboards accurate
- no repeated suspicious activity; user messaging completed if required

---

## 12. POSTMORTEM REQUIRED FIELDS

1. Summary  
2. Root cause  
3. Trigger  
4. Impact  
5. Detection gaps  
6. Response timeline  
7. What worked / failed  
8. Immediate fixes  
9. Long-term changes  
10. Owner and due dates  

---

## 13. SPECIAL RULES FOR IAI

1. Privacy incidents involving life data = higher severity than ordinary SaaS.
2. Proof integrity incidents affect platform trust — never minimize.
3. AI incidents: distinguish bad suggestion vs privacy leak vs autonomous unwanted action.
4. Org/Team OS incidents: protect individuals from coercive misuse of data.

---

## 14. MINIMUM DEV / OPS REQUIREMENTS

Centralized logs; request IDs and trace IDs; audit logs; session revocation; API key revocation; feature flags / kill switches; flow disable switch; backup restore ability.

---

## 15. FINAL RULE

Contain first. Preserve evidence. Protect people. Repair trust slowly and truthfully.
