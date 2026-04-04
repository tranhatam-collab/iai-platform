# IAI.ONE — BACKUP & RECOVERY RUNBOOK

## 1. PURPOSE

This runbook defines:

- what must be backed up
- how often backups occur
- how restores are tested
- what recovery sequence to follow during failure

The goal is **verified recoverability**, not compliance theater.

---

## 2. RECOVERY OBJECTIVES

### Initial targets

- **RPO (Recovery Point Objective):** 24 hours maximum
- **RTO (Recovery Time Objective):** 4 hours for critical services (improve over time)

**Critical services:** auth; API core; check-in storage; proofs; flow runtime metadata; lifecode reports; core public site content.

---

## 3. SYSTEMS THAT MUST BE BACKED UP

### A. Databases

User and membership data; weekly check-ins; life scores; action plans; value engine; flows / runs / schedules; proofs / signatures / verifications; lifecode profiles / reports / windows; organization data; privacy requests; audit logs.

### B. Object storage

Exported reports; uploaded media if retained; proof artifacts where applicable; backups of generated documents.

### C. Configuration & infrastructure metadata

Worker config references; env variable inventory (not raw secrets in plain backups); deployment manifests; access control matrices; route maps; schedule definitions.

### D. Documentation / content

Public content items; docs; playbooks; changelogs.

### E. Mail / messaging metadata (if operationally relevant)

Inbound/outbound logs; system notification templates; support mailbox data under policy.

---

## 4. BACKUP CLASSES

### Class 1 — Critical structured data

Users, memberships, check-ins, proofs, lifecode reports, flow definitions.

**Frequency:** daily minimum; more frequent if write volume grows.

### Class 2 — Operational data

Run logs, dashboards, org snapshots, audit logs.

**Frequency:** daily or rolling retention by volume.

### Class 3 — Static / public content

Docs, published pages, playbooks.

**Frequency:** on publish + daily export.

### Class 4 — Disaster recovery metadata

Deployment manifests; service mappings; restore scripts; DNS / routing inventory.

**Frequency:** on change + weekly verification.

---

## 5. BACKUP STORAGE POLICY

At least **two** logically separate storage targets (primary + secondary account/zone).

**Requirements:** versioning; immutable retention where feasible for critical backups; encrypted at rest; access restricted to backup operators.

Do not keep all backups in the same blast radius as production.

---

## 6. BACKUP FREQUENCY BASELINE

- **Daily:** full DB export or snapshot; object storage manifest; critical content; flow definitions export.
- **Weekly:** full backup verification; access/config inventory snapshot.
- **Monthly:** restore drill; retention review; archive integrity check.

---

## 7. RETENTION WINDOWS (suggested baseline)

- Daily backups: 30 days
- Weekly backups: 12 weeks
- Monthly backups: 12 months
- Annual archival: per legal/strategic policy

Audit and proof-related backups may require longer retention — decide explicitly.

---

## 8. WHAT A VALID BACKUP MUST INCLUDE

- timestamp
- environment tag
- schema version / migration state
- checksum / integrity marker
- restore instructions
- owner / operator metadata

A backup without restore metadata is incomplete.

---

## 9. RECOVERY PRIORITY ORDER

### Phase 1 — Trust & access

1. Auth services  
2. User sessions / token issuance  
3. API gateway  
4. Critical security controls  

### Phase 2 — Core data

5. Users / memberships  
6. Weekly check-ins  
7. Life scores  
8. Actions  
9. Proofs  

### Phase 3 — Core function

10. Dashboard data  
11. Flow definitions and schedules  
12. Lifecode reports  
13. Group/program data  

### Phase 4 — Extended surfaces

14. Content / docs  
15. Org snapshots  
16. Historical logs beyond critical baseline  
17. Non-critical media  

---

## 10. RECOVERY SCENARIOS

### Scenario A — Single database corruption

Stop writes if needed; identify corruption window; restore latest clean snapshot to isolated env; verify schema; replay safe events if available; switch traffic after validation.

### Scenario B — Object storage loss

Identify affected buckets/paths; restore manifests; critical artifacts first; validate proof references and report links; rebuild derivatives if needed.

### Scenario C — Accidental deletion of user data

Confirm source and scope; check if legitimate privacy request; restore isolated records if policy allows; preserve audit trail; notify privacy lead if user-sensitive.

### Scenario D — Full environment failure

Restore routing/access; DB from latest verified backup; object storage critical set; redeploy from known-good release; smoke tests; re-enable background jobs; monitor integrity.

### Scenario E — Proof layer integrity concern

Restore proof DB snapshot to isolated verification; compare hashes and signatures; confirm source mappings; restore public verification only after confidence regained.

---

## 11. RESTORE VALIDATION CHECKLIST

**Minimum:**

- can log in; fetch profile; read latest check-ins and life score
- can verify a sample proof; run a low-risk flow; fetch lifecode report
- can export user data; public homepage and docs load

**Organization mode:** org admin dashboard; team snapshots match expected shape; no raw private journals exposed.

---

## 12. RESTORE TEST SCHEDULE

- **Monthly:** restore drill in non-prod; validation checklist; record duration and blockers.
- **Quarterly:** scenario drills (DB corruption, proof concern, partial object loss).
- **Annually:** full DR simulation from backup + infra metadata only.

---

## 13. OPERATOR ROLES

- **Backup Owner** — jobs run; artifacts complete.
- **Restore Owner** — drills and real restores.
- **Security Reviewer** — access restrictions on backup artifacts.
- **Privacy Reviewer** — restores respect deletion/privacy commitments.
- **Platform Lead** — production cutover sign-off after restore.

---

## 14. REQUIRED ARTIFACTS

Backup schedule inventory; restore command inventory; schema version inventory; bucket/path inventory; environment dependency map; latest successful restore report; failed restore log.

---

## 15. DO NOTS

Do not assume backups are valid without restore tests; mix prod and backup credentials casually; restore directly to prod without isolated validation; keep only one copy of critical backups; ignore proof/audit continuity during restore.

---

## 16. FINAL RULE

Backups do not create safety. **Verified restore capability** does.
