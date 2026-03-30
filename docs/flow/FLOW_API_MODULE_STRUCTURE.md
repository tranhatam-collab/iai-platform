# FLOW_API_MODULE_STRUCTURE.md
## IAI Flow — API Module Structure
## Version 1.0

---

# 0. GOAL

Define a clean, scalable, multi-tenant-aware API structure:
- modular
- testable
- auditable
- aligned with domain boundaries
- safe for production scale

---

# 1. GLOBAL STRUCTURE

/api
/modules
/auth
/workspaces
/flows
/runs
/agents
/approvals
/billing
/logs
/alerts
/queue
/registry
/shared
/middleware
/errors
/utils
/types
/validators

---

# 2. MODULE INTERNAL STRUCTURE

Each module must follow:

/module_name
module.routes.ts
module.controller.ts
module.service.ts
module.repository.ts
module.validator.ts
module.types.ts

---

# 3. RESPONSIBILITY SPLIT

## routes
- define endpoints
- attach middleware
- no business logic

## controller
- request/response handling
- call service layer
- format response

## service
- core business logic
- enforce policies
- orchestrate repositories + queue

## repository
- DB access only
- no business logic

## validator
- input schema validation
- fail early

---

# 4. MULTI-TENANT MIDDLEWARE

Must run before all protected routes:

resolveWorkspace()
resolveEnvironment()
resolveUser()
checkPermissions()

Attach to request context:
- workspace_id
- environment_id
- user_id
- role

---

# 5. CORE MODULES

## auth
- POST /auth/login
- GET /auth/me

## workspaces
- GET /workspaces
- POST /workspaces
- PATCH /workspaces/:id

## flows
- GET /flows
- POST /flows
- GET /flows/:id
- POST /flows/:id/publish

## runs
- GET /runs
- POST /runs
- GET /runs/:id
- POST /runs/:id/cancel
- POST /runs/:id/retry

## approvals
- GET /approvals
- POST /approvals/:id/approve
- POST /approvals/:id/reject

## billing
- GET /billing/summary
- GET /billing/ledger

## logs
- GET /logs

## alerts
- GET /alerts
- POST /alerts/:id/resolve

---

# 6. SERVICE RULES

- must enforce:
  - workspace isolation
  - environment policy
  - cost limits
  - approval triggers

- must emit events when:
  - run created
  - step completed
  - approval requested
  - usage recorded

---

# 7. ERROR SYSTEM

Standard error shape:

{
code: string,
message: string,
context?: object,
trace_id: string
}

---

# 8. FINAL DIRECTIVE

API must be:
- predictable
- tenant-safe
- debuggable

No quick logic inside routes.
All logic must be in services.
