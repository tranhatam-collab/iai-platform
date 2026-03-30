# IAI.ONE Platform — documentation index

| Area | Path |
|------|------|
| Production DB schema | [database/DATABASE_FULL_SCHEMA.sql](database/DATABASE_FULL_SCHEMA.sql) |
| API routes (v1) | [api/API_ROUTES_FULL_SPEC.md](api/API_ROUTES_FULL_SPEC.md) |
| Flow node library (100+ nodes) | [flow/FLOW_NODE_LIBRARY_SPEC.md](flow/FLOW_NODE_LIBRARY_SPEC.md) |
| Flow + dash — D1 schema (control plane) | [flow/FLOW_DATABASE_SCHEMA.md](flow/FLOW_DATABASE_SCHEMA.md) |
| Flow — queues & events | [flow/QUEUE_EVENT_SYSTEM_SPEC.md](flow/QUEUE_EVENT_SYSTEM_SPEC.md) |
| Flow — cost & billing | [flow/COST_ENGINE_SPEC.md](flow/COST_ENGINE_SPEC.md) |
| Flow — multi-tenant | [flow/MULTI_TENANT_ARCHITECTURE.md](flow/MULTI_TENANT_ARCHITECTURE.md) |
| Flow — DEV checklist tuần 1–4 (flow / api / dash) | [flow/DEV_ACTION_FILE_FLOW_WEEK_1_TO_4.md](flow/DEV_ACTION_FILE_FLOW_WEEK_1_TO_4.md) |
| Dash runtime app spec | [flow/DASH_IAI_ONE_RUNTIME_APP_SPEC.md](flow/DASH_IAI_ONE_RUNTIME_APP_SPEC.md) |
| Dash screen-by-screen copy | [flow/DASH_SCREEN_BY_SCREEN_COPY.md](flow/DASH_SCREEN_BY_SCREEN_COPY.md) |
| Flow execution state machine | [flow/FLOW_EXECUTION_STATE_MACHINE.md](flow/FLOW_EXECUTION_STATE_MACHINE.md) |
| Approval system spec | [flow/APPROVAL_SYSTEM_SPEC.md](flow/APPROVAL_SYSTEM_SPEC.md) |
| Stripe meter integration spec | [flow/STRIPE_METER_INTEGRATION_SPEC.md](flow/STRIPE_METER_INTEGRATION_SPEC.md) |
| Flow API module structure | [flow/FLOW_API_MODULE_STRUCTURE.md](flow/FLOW_API_MODULE_STRUCTURE.md) |
| Run artifact storage spec | [flow/RUN_ARTIFACT_STORAGE_SPEC.md](flow/RUN_ARTIFACT_STORAGE_SPEC.md) |
| Queue consumer idempotency spec | [flow/QUEUE_CONSUMER_IDEMPOTENCY_SPEC.md](flow/QUEUE_CONSUMER_IDEMPOTENCY_SPEC.md) |
| Multi-agent orchestration runtime | [flow/AGENT_ORCHESTRATION_RUNTIME.md](flow/AGENT_ORCHESTRATION_RUNTIME.md) |
| LifeCode engine integration | [flow/LIFECODE_ENGINE_INTEGRATION.md](flow/LIFECODE_ENGINE_INTEGRATION.md) |
| Proof of Reality integration | [flow/PROOF_OF_REALITY_INTEGRATION.md](flow/PROOF_OF_REALITY_INTEGRATION.md) |
| Security architecture | [security/SECURITY_ARCHITECTURE.md](security/SECURITY_ARCHITECTURE.md) |
| Access control matrix (RBAC + scope) | [security/ACCESS_CONTROL_MATRIX.md](security/ACCESS_CONTROL_MATRIX.md) |
| Privacy data map | [security/PRIVACY_DATA_MAP.md](security/PRIVACY_DATA_MAP.md) |
| Incident response plan | [ops/INCIDENT_RESPONSE.md](ops/INCIDENT_RESPONSE.md) |
| Backup & recovery runbook | [ops/BACKUP_RECOVERY_RUNBOOK.md](ops/BACKUP_RECOVERY_RUNBOOK.md) |
| Flow + Proof / LifeCode specs (earlier) | [specs/](specs/) |
| Homepage copy | [homepage/](homepage/) |

**Execution stack (reference):** [Cloudflare Workflows](https://developers.cloudflare.com/workflows/) (durable execution; inherits Workers limits), [Queues](https://developers.cloudflare.com/queues/), [Durable Objects](https://developers.cloudflare.com/durable-objects/), [D1](https://developers.cloudflare.com/d1/).
