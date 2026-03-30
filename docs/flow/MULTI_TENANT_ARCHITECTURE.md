# MULTI_TENANT_ARCHITECTURE.md

## IAI Flow — Multi-Tenant Architecture

**Version 1.0**

---

## 0. GOAL

Define how Flow serves:

- individuals
- teams
- enterprises
- agencies
- white-label operators

without cross-tenant leakage and without re-architecting later.

---

## 1. TENANCY MODEL

**Primary tenancy unit:** `workspace`

A workspace owns:

- flows
- runs
- agents
- nodes
- billing
- secrets
- environments
- logs
- approvals

Users belong to one or more workspaces with roles.

---

## 2. ISOLATION PRINCIPLES

1. Every row must belong to a workspace unless globally public
2. Secrets are always workspace-scoped or environment-scoped
3. Runs never cross tenant boundaries
4. Logs and traces must be query-scoped by workspace
5. Billing is workspace-scoped
6. Public marketplace assets are shared by publication, not by raw ownership leakage

---

## 3. ACCESS MODEL

**User roles:**

- owner
- admin
- editor
- operator
- viewer
- billing_admin

Permissions evaluated by:

- workspace role
- environment role
- asset ownership where needed

---

## 4. ENVIRONMENT MODEL

Within a workspace:

- dev
- staging
- prod
- optional custom environments

Each environment can have:

- different secrets
- different rate limits
- different billing flags
- different flow versions promoted

---

## 5. SECRET MANAGEMENT

Secrets scoped by:

- workspace
- environment
- optional flow/node override

Never expose raw secrets to client UI.

---

## 6. TENANT-AWARE EXECUTION

Each run must carry:

- workspace_id
- environment_id
- actor_id
- billing context
- policy context

Durable Object state keys and queue messages must always include workspace context.

---

## 7. SHARED ASSETS VS PRIVATE ASSETS

### Private assets

- flows
- runs
- secrets
- internal nodes
- logs

### Shared assets

- public node templates
- marketplace nodes
- public docs
- verified reusable examples

Shared assets must be copied/versioned or referenced safely—never edited across tenant boundaries accidentally.

---

## 8. WHITE-LABEL / AGENCY MODEL (future)

- parent account manages multiple child workspaces
- agency can deploy flows for clients
- strict boundary between template ownership and client runtime ownership

Do not build this first, but preserve schema support.

---

## 9. BILLING BY TENANT

Billing account belongs to workspace.  
Users do not own billing individually unless workspace is personal.

Enterprise later may require:

- centralized billing across multiple workspaces
- cost center tags
- environment-level budgets

---

## 10. RATE LIMITING BY TENANT

Rate limits enforced by:

- workspace plan
- environment
- API key
- concurrency policy

---

## 11. DATA RESIDENCY / REGION PREP

Schema should preserve even if not fully implemented:

- region_preference
- compliance tags
- retention policy by tenant

---

## 12. AUDIT MODEL

Every sensitive action should record:

- workspace_id
- actor_user_id
- action_type
- target_ref
- timestamp
- result

**Especially required for:**

- secret changes
- billing changes
- approval actions
- flow publishing
- role changes

---

## 13. TENANT-AWARE DASH UX (dash.iai.one)

User must be able to:

- switch workspace
- switch environment
- see which workspace they are in at all times
- see billing scope clearly
- avoid accidental prod actions

---

## 14. TENANT-AWARE NODE REGISTRY

**Registry visibility modes:**

- private to workspace
- internal to organization
- public marketplace
- verified public

Allows a node ecosystem without breaking tenant isolation.

---

## 15. TENANT MIGRATION / EXPORT

Prepare for:

- export flow definitions
- import templates
- duplicate flow to another workspace
- clone from staging to prod

All export/import must preserve:

- version history where needed
- schema validity
- secret placeholder integrity

---

## 16. FINAL DIRECTIVE

Build multi-tenancy now at the schema and permission level.  
Do not postpone tenancy thinking until after growth.

Retrofitting tenant isolation later is expensive and dangerous.

---

END
