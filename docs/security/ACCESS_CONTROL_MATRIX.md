# IAI.ONE — ACCESS CONTROL MATRIX

## 1. PURPOSE

This document defines the role-based and scope-based access rules across the IAI system.

**Goals:**

- prevent privilege creep
- separate visibility from authority
- protect sensitive life data
- ensure no single role accumulates unchecked power

This matrix applies to:

- public surfaces
- authenticated user surfaces
- internal execution systems
- admin and governance routes
- proof and privacy operations

---

## 2. ACCESS MODEL

IAI uses a combined model:

- **RBAC:** Role-Based Access Control
- **Scope control:** Feature / route / object-level permissions
- **Context control:** Personal / group / org / internal system

A user may have:

- one membership state
- one or more roles
- one or more scoped permissions

Membership state does not automatically grant elevated permissions.

---

## 3. PRIMARY ACTOR TYPES

### A. Public Visitor

Unauthenticated. Can only access public, indexed or intentionally public surfaces.

### B. Authenticated User

Has verified identity and a session. Can access personal dashboard and self-owned records only.

### C. Observer

Reads and explores. No authority over others. No admin capability.

### D. Participant

May submit check-ins, actions, notebooks, value records, and join defined programs/groups.

### E. Long-Term Contributor

May access deeper contribution surfaces and selected internal structures where explicitly granted.

### F. Protocol Holder

May review system language, standards, and integrity surfaces, but does not gain default control over operations.

### G. Mentor / Steward

Local or group-level facilitator role. Can operate within scoped groups only.

### H. Organization Admin

Admin within a specific organization. Does not gain global admin rights.

### I. System Admin

Operational administrator for platform services.

### J. Security / Privacy Admin

Restricted role for privacy requests, incident handling, and high-risk administrative actions.

### K. Internal Service

Machine identity used by internal systems like flow engine, proof engine, scheduled jobs.

---

## 4. MEMBERSHIP STATE VS ROLE

### Membership State

Describes presence:

- observer
- participant
- long_term_contributor
- protocol_holder

### Role

Describes permission:

- user
- mentor
- steward
- org_admin
- system_admin
- privacy_admin
- internal_service

**Rule:** Membership state is descriptive. Role is executable.

Do not infer admin capability from membership state.

---

## 5. ACCESS DOMAINS

### Domain 1 — Public Content

Examples: iai.one, home.iai.one, docs public pages, public content library.

### Domain 2 — Personal Life OS

Examples: app.iai.one dashboard, weekly check-ins, personal actions, notebooks, value engine, lifecode personal profile.

### Domain 3 — Community / Group Spaces

Examples: practice groups, programs, mentor coordination, internal community updates.

### Domain 4 — Organization / Team OS

Examples: org member management, anonymized team snapshots, org-level reports.

### Domain 5 — Flow Builder & Runtime

Examples: flow definitions, run history, schedules, runtime logs.

### Domain 6 — Proof Layer

Examples: proof creation, verification, revocation, signatures, proof visibility management.

### Domain 7 — Privacy & Security

Examples: privacy export requests, deletion requests, audit logs, incident console.

### Domain 8 — Platform Admin

Examples: user moderation, role assignment, system health, queue health, deployment settings (if exposed internally).

---

## 6. PERMISSION CATEGORIES

- **Read** — view a resource
- **Create** — create a resource
- **Update** — modify a resource
- **Delete** — remove or archive a resource
- **Execute** — trigger a run, workflow, verification, or privileged system action
- **Approve** — formally approve a request or state transition
- **Revoke** — disable access, revoke proof, revoke session, or invalidate artifacts
- **Audit** — view logs and trace system history

---

## 7. ROLE MATRIX (HIGH LEVEL)

| Role / Area | Public Content | Personal Life OS | Group Space | Org Space | Flow | Proof | Privacy | Admin |
|-------------|----------------|------------------|-------------|-----------|------|-------|---------|-------|
| Public Visitor | Read public only | No | No | No | No | Verify public proof only | No | No |
| Authenticated User | Read | Read/Create/Update own | Limited if enrolled | No | Trigger personal approved flows only | Create own / read own | Submit own request | No |
| Observer | Read | Limited own only | No or read-only if allowed | No | No by default | Verify public / read own | Submit own request | No |
| Participant | Read | Full own | Participate scoped | No by default | Run scoped flows | Create/read own proofs | Submit own request | No |
| Long-Term Contributor | Read | Full own | Contribute scoped | Possible delegated access | Run/manage scoped flows | Create/read scoped proofs | Submit own request | No |
| Protocol Holder | Read standards | Own only | Optional read on standards spaces | No by default | No default runtime authority | Read integrity surfaces if granted | No default | No default |
| Mentor / Steward | Read | Own only | Read/update assigned group | No by default | Run assigned group flows if granted | Create/read group proofs if granted | No | No |
| Org Admin | Read | Own only | Optional | Manage organization only | Run org-level approved flows | Read org-level proofs if policy allows | No | No global |
| System Admin | Read | No default personal data browsing without need | Scoped admin | Scoped admin | Full platform flow admin | Read/manage proofs except sensitive revocations may require second role | No default privacy authority | Yes |
| Privacy Admin | Read | Need-based only | Need-based only | Need-based only | No default | Read proof metadata if needed | Full privacy request authority | Limited |
| Internal Service | No browser access | Service-only | Service-only | Service-only | Execute internal | Create system proofs | No human access | Service-only |

---

## 8. OBJECT-LEVEL RULES

### 8.1 User-Owned Data

Examples: check-ins, actions, notebooks, value canvas, lifecode profile.

**Rule:** Only owner may read/update by default. Admins do not gain automatic read access without explicit operational reason and audit trail.

### 8.2 Group-Owned Data

Examples: group progress, mentor notes, program progress.

**Rule:** Visible only to the user, assigned mentor/steward, and group-level facilitators where justified.

### 8.3 Organization Data

Examples: team snapshots, org reports, member lists.

**Rule:** Visible to org admins and permitted members only. No cross-organization access.

### 8.4 Proof Records

**Rule:** Proof existence and proof payload visibility are separate permissions.

Possible states: private, team, public proof only.

### 8.5 Audit Logs

**Rule:** Only system admin and security/privacy admin. Never visible to ordinary users.

---

## 9. ROUTE ACCESS POLICY

### Public routes

Accessible without session: homepage, charter, public docs, public content, public proof verification where intended.

### Authenticated self-service routes

Accessible with active session: `/dashboard`, `/checkins`, `/actions`, `/notebooks`, `/value-engine`, `/lifecode/profile`, `/privacy/export`, `/privacy/delete`.

### Role-gated routes

Examples: `/groups/:id/manage`, `/programs/:id/mentor`, `/org/:id/admin`, `/flows/:id/edit`, `/flows/:id/publish`.

### Admin-only routes

Examples: `/admin/audit`, `/admin/system-health`, `/admin/roles`, `/admin/queues`.

### Privacy-admin-only routes

Examples: `/admin/privacy/requests`, `/admin/privacy/export-jobs`, `/admin/privacy/delete-jobs`.

---

## 10. HIGH-RISK ACTIONS REQUIRING SECONDARY CONTROL

The following actions require elevated review or dual control:

- proof revocation
- bulk role assignment
- privacy delete execution
- org-wide data export
- disabling a user account with existing proofs
- changing visibility from private to public-proof-only for sensitive records
- system-wide flow schedule activation
- modifying security policy settings

**Minimum requirement:** secondary confirmation OR second privileged role OR delayed execution with audit trail.

---

## 11. NO-POWER-ACCUMULATION RULES

To align with IAI principles:

1. No role should imply social superiority.
2. Protocol Holder does not imply operational command.
3. Membership state does not imply platform authority.
4. Organization Admin cannot escalate to system admin through interface action.
5. Privacy Admin cannot edit product content unless separately assigned.
6. System Admin cannot silently browse personal life data without audited reason.
7. Proof creation and proof revocation should be separated where feasible.

---

## 12. ACCESS REQUEST / GRANT POLICY

Every elevated grant must record:

- who granted it
- why
- when it starts
- when it ends
- review date

Temporary grants are preferred over permanent grants.

---

## 13. SESSION & DEVICE CONTROL

**Minimum controls:**

- revoke current session
- revoke all sessions
- list recent devices
- notify on suspicious new device
- short-lived access token + rotatable refresh token

**Admin session requirements:**

- stronger session TTL
- re-auth for sensitive actions
- optional MFA mandatory for privileged roles

---

## 14. AUDIT REQUIREMENTS

The following must always be audited:

- login / logout
- role grant / revoke
- proof create / revoke
- privacy request state changes
- admin route access
- flow publish
- flow schedule activation
- org admin invite / remove

---

## 15. IMPLEMENTATION REQUIREMENTS FOR DEV

DEV must deliver:

1. Central permission middleware
2. Route-level policy map
3. Object ownership check utility
4. Scoped admin checks
5. Dual-control utility for high-risk actions
6. Full audit logging on privileged events
7. Role review screen for security/privacy admins

---

## 16. FINAL RULE

Access in IAI is granted to preserve integrity, not to accumulate power.
