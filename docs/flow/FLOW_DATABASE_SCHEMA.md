# FLOW_DATABASE_SCHEMA.md

## IAI Flow — Production Database Schema

**Version 1.0**

---

## 0. GOAL

Define the database schema for:

- flow definitions
- executions
- agents
- nodes
- billing
- tenants
- observability metadata

**Database roles:**

**D1:**

- control-plane metadata
- workflow definitions
- execution indexes
- billing records
- tenant configuration

**Durable Objects + SQLite:**

- hot runtime state
- run-local mutable state
- approval/session state

**R2:**

- large payload snapshots
- logs archives
- artifacts
- prompt/result blobs

**Rule:** Do not store large runtime blobs in D1 unless needed for indexing.

**References (platform limits / products):**

- [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)
- [Durable Objects SQLite](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)
- [Cloudflare Queues](https://developers.cloudflare.com/queues/)
- [Stripe Billing Meter](https://docs.stripe.com/api/billing/meter)

---

## 1. SCHEMA PRINCIPLES

1. D1 is the control-plane source of truth
2. Durable Objects hold hot mutable run state
3. R2 stores heavy or archival payloads
4. All critical rows must be auditable
5. Every run and step must be traceable
6. Billing must be reconstructable from immutable usage events

---

## 2. CORE TABLE GROUPS

### 2.1 Identity and Tenancy

- users
- workspaces
- workspace_members
- api_keys
- environments

### 2.2 Flow Authoring

- flows
- flow_versions
- flow_nodes
- flow_edges
- flow_triggers

### 2.3 Runtime and Execution

- runs
- run_steps
- run_artifacts
- approvals
- schedules

### 2.4 Agent Layer

- agents
- agent_versions
- agent_tools
- agent_runs
- agent_handoffs

### 2.5 Node Ecosystem

- registry_nodes
- registry_node_versions
- registry_node_permissions
- registry_node_test_cases

### 2.6 Billing

- plans
- subscriptions
- usage_meters
- usage_events
- invoices_shadow
- credit_ledger

### 2.7 Observability

- traces
- trace_spans
- log_events
- alerts

---

## 3. IDENTITY + TENANCY TABLES

### users

- id (pk)
- email
- display_name
- avatar_url
- status
- created_at
- updated_at

### workspaces

- id (pk)
- slug
- name
- owner_user_id
- plan_id
- region_preference
- billing_account_id
- status
- created_at
- updated_at

### workspace_members

- id (pk)
- workspace_id
- user_id
- role (owner/admin/editor/operator/viewer/billing)
- invited_by_user_id
- joined_at
- status

### api_keys

- id (pk)
- workspace_id
- label
- hashed_key
- scopes_json
- last_used_at
- expires_at
- created_at
- revoked_at

### environments

- id (pk)
- workspace_id
- name (dev/staging/prod/custom)
- slug
- secrets_ref
- status
- created_at

---

## 4. FLOW AUTHORING TABLES

### flows

- id (pk)
- workspace_id
- slug
- name
- description
- current_version_id
- status
- created_by_user_id
- created_at
- updated_at
- archived_at

### flow_versions

- id (pk)
- flow_id
- version_number
- graph_hash
- manifest_json
- published_by_user_id
- created_at
- is_active

### flow_nodes

- id (pk)
- flow_version_id
- node_key
- node_type
- display_name
- config_json
- input_mapping_json
- retry_policy_json
- timeout_ms
- position_x
- position_y

### flow_edges

- id (pk)
- flow_version_id
- source_node_key
- target_node_key
- condition_json
- edge_type

### flow_triggers

- id (pk)
- flow_id
- trigger_type (manual/webhook/schedule/event/api)
- config_json
- status
- created_at

---

## 5. RUNTIME TABLES

### runs

- id (pk)
- workspace_id
- flow_id
- flow_version_id
- environment_id
- trigger_type
- trigger_ref
- status (pending/running/paused/failed/completed/canceled)
- state_object_id
- current_step_key
- parent_run_id nullable
- started_at
- ended_at
- error_summary
- trace_id

### run_steps

- id (pk)
- run_id
- step_key
- step_type
- status
- attempt
- idempotency_key
- started_at
- ended_at
- duration_ms
- input_ref
- output_ref
- error_ref
- cost_micros
- queue_message_id nullable

### run_artifacts

- id (pk)
- run_id
- artifact_type (input/output/log/snapshot/file/prompt/result)
- step_key nullable
- storage_kind (d1/r2/do)
- storage_ref
- content_type
- created_at

### approvals

- id (pk)
- run_id
- step_key
- requested_by
- assigned_to nullable
- policy_key nullable
- status (pending/approved/rejected/expired/canceled)
- reason
- payload_ref
- created_at
- resolved_at

### schedules

- id (pk)
- workspace_id
- flow_id
- cron_expr
- timezone
- status
- last_run_at
- next_run_at
- created_at

---

## 6. AGENT TABLES

### agents

- id (pk)
- workspace_id
- slug
- name
- role_description
- default_model
- default_config_json
- current_version_id
- created_at
- updated_at

### agent_versions

- id (pk)
- agent_id
- version_number
- system_prompt_ref
- tool_policy_json
- handoff_policy_json
- memory_policy_json
- created_at
- is_active

### agent_tools

- id (pk)
- agent_version_id
- tool_key
- tool_type (node/internal/api/search/human)
- config_json
- permission_scope_json

### agent_runs

- id (pk)
- run_id
- step_key
- agent_id
- agent_version_id
- status
- input_ref
- output_ref
- prompt_ref
- tokens_in
- tokens_out
- model_name
- started_at
- ended_at
- cost_micros

### agent_handoffs

- id (pk)
- agent_run_id
- from_agent_id
- to_agent_id
- handoff_reason
- context_ref
- created_at

---

## 7. NODE REGISTRY TABLES

### registry_nodes

- id (pk)
- publisher_workspace_id
- slug
- name
- category
- summary
- latest_version_id
- status
- visibility (private/internal/public/verified-marketplace)
- created_at
- updated_at

### registry_node_versions

- id (pk)
- registry_node_id
- version_number
- manifest_json
- input_schema_json
- output_schema_json
- permissions_json
- handler_ref
- changelog
- created_at
- is_active

### registry_node_permissions

- id (pk)
- registry_node_version_id
- permission_type
- permission_value

### registry_node_test_cases

- id (pk)
- registry_node_version_id
- name
- input_json
- expected_output_json
- status

---

## 8. BILLING TABLES

Stripe meters and meter events should remain the billing source for invoicing, while Flow keeps an internal shadow ledger for product control and support. See [Stripe Billing Meter](https://docs.stripe.com/api/billing/meter).

### plans

- id (pk)
- stripe_price_id
- stripe_meter_id nullable
- slug
- name
- monthly_base_cents
- included_credits
- included_runs
- included_agent_tokens
- overage_policy_json
- status

### subscriptions

- id (pk)
- workspace_id
- stripe_customer_id
- stripe_subscription_id
- plan_id
- status
- current_period_start
- current_period_end
- cancel_at nullable
- created_at
- updated_at

### usage_meters

- id (pk)
- workspace_id
- meter_key (run_count/step_count/agent_tokens/compute_ms/storage_bytes)
- period_start
- period_end
- aggregated_value
- updated_at

### usage_events

- id (pk)
- workspace_id
- run_id nullable
- step_id nullable
- event_name
- meter_key
- quantity
- unit
- source_type
- source_ref
- stripe_meter_event_id nullable
- created_at

### invoices_shadow

- id (pk)
- workspace_id
- stripe_invoice_id nullable
- subtotal_cents
- usage_cents
- tax_cents
- total_cents
- currency
- status
- created_at

### credit_ledger

- id (pk)
- workspace_id
- entry_type (grant/debit/refund/adjustment/expiry)
- credits_delta
- reason
- source_ref
- balance_after
- created_at

---

## 9. OBSERVABILITY TABLES

Workers tracing has platform limitations; Flow should not rely on vendor traces alone—maintain an internal trace model. See [Workers Traces — known limitations](https://developers.cloudflare.com/workers/observability/traces/known-limitations/).

### traces

- id (pk)
- workspace_id
- run_id
- trace_key
- status
- started_at
- ended_at

### trace_spans

- id (pk)
- trace_id
- parent_span_id nullable
- span_type
- span_name
- step_key nullable
- started_at
- ended_at
- attributes_json

### log_events

- id (pk)
- workspace_id
- run_id nullable
- step_key nullable
- level
- message
- context_json
- created_at

### alerts

- id (pk)
- workspace_id
- alert_type
- severity
- target_ref
- status
- opened_at
- closed_at nullable

---

## 10. INDEXING + PARTITIONING RULES

**Indexes required:**

- runs by workspace_id, started_at desc
- runs by status
- run_steps by run_id, step_key
- approvals by status, created_at
- usage_events by workspace_id, created_at
- log_events by run_id, created_at
- schedules by next_run_at, status

**Archive rules:**

- old logs → R2
- large step input/output → R2
- keep D1 for searchability, not raw payload mass

---

## 11. D1 SAFETY RULES

Given D1 query and table limits, keep schemas disciplined:

- avoid giant wide tables
- keep JSON columns purposeful
- avoid giant per-row payloads
- move large blobs to R2
- keep write patterns batch-aware where possible

Reference: [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)

---

## 12. FINAL DIRECTIVE

- **D1** = control plane
- **Durable Objects** = hot state
- **R2** = heavy payload archive

Do not collapse all three concerns into one storage layer.

---

END
