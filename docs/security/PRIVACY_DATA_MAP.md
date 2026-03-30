# IAI.ONE — PRIVACY DATA MAP

## 1. PURPOSE

This document defines:

- what data IAI collects
- why it is collected
- where it flows
- who can access it
- how it is retained, exported, and deleted

The platform is privacy-first by design. No life data is treated as advertising inventory.

---

## 2. PRIVACY PRINCIPLES

1. Collect only what is needed for the feature.
2. Separate identity from sensitive insight wherever possible.
3. Prefer derived metrics over raw personal narrative when sufficient.
4. Public proof must never imply public raw data.
5. Users must be able to export and request deletion.
6. No silent reuse of personal data for unrelated purposes.
7. Team / organization views must default to aggregation and anonymization.

---

## 3. DATA CATEGORIES

### Category A — Identity Data

**Examples:** email, display name, legal name (if voluntarily provided), auth provider metadata, timezone, locale.

**Purpose:** account access, localization, notifications, role binding.

**Sensitivity:** Medium.

**Stored in:** `users`, `user_profiles`, `user_sessions` (see [DATABASE_FULL_SCHEMA.sql](../database/DATABASE_FULL_SCHEMA.sql)).

---

### Category B — Life Rhythm Data

**Examples:** energy score, sleep hours, sleep quality, stress score, focus hours, relationship score, contribution score, notes.

**Purpose:** weekly check-in, life scores, stability and burnout pattern detection, dashboard display.

**Sensitivity:** High.

**Stored in:** `weekly_checkins`, `life_scores`, `ai_summaries` (derived), `proofs` (hashed or snapshot per policy).

---

### Category C — Behavioral / Reflective Data

**Examples:** notebook entries, reflections, value statements, action commitments, completion history.

**Purpose:** action follow-through, value engine, personal reviews, progress summaries.

**Sensitivity:** High.

**Stored in:** `notebooks`, `action_plans`, `value_canvases`, `value_outputs`.

---

### Category D — LifeCode Inputs

**Examples:** birth date, birth time, timezone, optional name input, optional behavior inputs.

**Purpose:** life pattern analysis, risk windows, alignment windows, report generation.

**Sensitivity:** Very High.

**Stored in:** `lifecode_profiles`, `lifecode_reports`, `lifecode_windows`, `ai_summaries` (derived).

---

### Category E — Proof Data

**Examples:** payload hash, source system, source entity references, proof metadata, signature metadata, verification results.

**Purpose:** trust verification, output authenticity, contribution receipts, audit trail.

**Sensitivity:** Variable — raw payload may be highly sensitive; hash metadata often lower sensitivity.

**Stored in:** `proofs`, `proof_signatures`, `proof_verifications`.

---

### Category F — Group / Program Data

**Examples:** group memberships, mentor assignment, program status, group notes, completion markers.

**Purpose:** community operations, program delivery, mentor coordination.

**Sensitivity:** Medium to High depending on context.

**Stored in:** `practice_groups`, `group_memberships`, `programs`, `program_enrollments`.

---

### Category G — Organization / Team Data

**Examples:** organization member roster, aggregated stability snapshots, participation indexes, focus indexes.

**Purpose:** Team OS, organizational health reporting, trend analysis.

**Sensitivity:** High — must be anonymized where possible.

**Stored in:** `organizations`, `organization_members`, `team_os_snapshots`.

---

### Category H — Technical / Security Data

**Examples:** session tokens (hashed), IP address, user agent, audit logs, API key hashes, request timing.

**Purpose:** security, incident response, fraud or abuse detection, platform reliability.

**Sensitivity:** Medium to High.

**Stored in:** `user_sessions`, `audit_logs`, `api_keys`.

---

### Category I — Content / Public Data

**Examples:** published articles, playbooks, public pages, metadata for docs.

**Purpose:** public site, documentation, education.

**Sensitivity:** Low.

**Stored in:** `content_items`.

---

## 4. DATA FLOW MAP

### Flow A — Identity

User registers → `users` / `user_profiles` / sessions → auth / notification / access control.

### Flow B — Weekly Check-in

User submits weekly form → `weekly_checkins` → `life_scores` derived → optional `ai_summary` → optional action generation → optional proof creation.

### Flow C — Action / Output

User creates action or output → `action_plans` / `value_outputs` → optional flow trigger → optional proof creation → optional dashboard update.

### Flow D — LifeCode

User enters birth/time data → `lifecode_profile` → analysis engine → `lifecode_report` → windows → optional proof / summary.

### Flow E — Team OS

Users participate under organization context → anonymized aggregation → team snapshots → org dashboard. No direct manager view into raw personal journal/check-in content by default.

---

## 5. STORAGE RULES BY CATEGORY

| Category | Raw Storage Allowed | Derived Storage Allowed | Public Exposure |
|----------|---------------------|-------------------------|-----------------|
| Identity | Yes | Yes | No |
| Life Rhythm | Yes, restricted | Yes | No |
| Behavioral / Reflective | Yes, restricted | Yes | No |
| LifeCode Inputs | Yes, highly restricted | Yes | No |
| Proof Data | Hash yes, raw selective | Yes | Proof metadata only if intended |
| Group / Program | Yes, scoped | Yes | No |
| Organization / Team | Aggregated preferred | Yes | No |
| Technical / Security | Yes | Yes | No |
| Public Content | Yes | Yes | Yes |

---

## 6. ACCESS RULES SUMMARY

### User may access

- own identity data
- own check-ins
- own actions
- own notebooks
- own value engine
- own lifecode profile/reports
- own privacy requests
- own proofs unless otherwise configured

### Group mentors / stewards may access

- scoped group operational data
- program progress relevant to their role
- not full raw personal reflections by default

### Organization admins may access

- org roster
- aggregated Team OS metrics
- org-level reports
- not default access to raw personal notes or full personal life data

### System / privacy admins may access

- only what is required for operation, security, or privacy handling
- all such access must be auditable

---

## 7. RETENTION POLICY (BASELINE)

### Identity Data

Retain while account active. Delete or anonymize upon approved deletion request unless legal/security hold applies.

### Weekly Check-ins / Life Scores

Retain until user deletes account or requests selective deletion, unless retained in minimal derived aggregate form that cannot identify user.

### Notebooks / Reflections

Retain until deleted by user or full account deletion.

### LifeCode Inputs / Reports

Retain until deleted by user or account deletion. Highly sensitive; should support selective removal.

### Proof Data

Proof hashes and minimal audit trails may need longer retention for integrity, even if raw payload is removed. Must disclose this clearly.

### Audit Logs

Retain according to security policy and legal need. Prefer fixed retention windows with secure archival.

### Organization Data

Retain while organization account active, then archive or delete under policy.

---

## 8. EXPORT POLICY

User export must include:

- profile
- check-ins
- life scores
- actions
- notebooks
- value engine data
- lifecode reports
- proofs owned by user
- privacy request history (optional)
- machine-readable JSON
- human-readable PDF where relevant

Export must **not** include:

- internal security notes
- other users’ data
- internal system-only logs

---

## 9. DELETION POLICY

**Deletion request types:** selective content delete, full account delete, proof visibility change, organization removal.

**Implementation:**

1. verify requester
2. create privacy request record
3. mark affected records
4. perform logical delete
5. perform physical delete where possible
6. preserve minimal audit evidence of the request handling
7. confirm completion to requester

**Special note:** Proof system may preserve hash-level audit evidence while deleting raw associated payload.

---

## 10. AI DATA USE POLICY

**AI may process:** check-in summaries, trend summaries, lifecode summaries, action suggestion prompts.

**AI must not:**

- be trained on raw personal data without explicit and separate consent
- expose user data to public contexts
- make autonomous life decisions for users
- produce hidden profiling for ad or sales targeting

**Store:** model name, prompt version, output safety flags, minimal prompt trace if needed for audit.

---

## 11. ORGANIZATIONAL PRIVACY RULES (Team OS)

- default to anonymous or aggregated insights
- no manager-level raw diary access
- no coercive use of life scores
- no hidden ranking of individual employees
- participation and consent model must be explicit

---

## 12. PUBLIC PROOF RULES

**Public proof may expose:** proof ID, timestamp, type, source category, verification status, optional non-sensitive metadata.

**Public proof must not expose:** sensitive check-in details, birth data, private notes, hidden organization internals, raw payloads unless explicitly intended.

---

## 13. PRIVACY ARTIFACTS DEV MUST MAINTAIN

- Data inventory table
- Retention schedule
- Export field map
- Deletion execution flow
- Admin access justification log
- Third-party processor list
- Model/provider processing register for AI calls

---

## 14. FINAL RULE

Life data is not engagement inventory. In IAI, privacy is not a feature — it is part of the system’s moral boundary.
