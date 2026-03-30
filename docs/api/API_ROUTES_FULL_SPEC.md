# IAI.ONE — API ROUTES FULL SPEC

## 1. API PRINCIPLES

- Single public backend authority: `api.iai.one`
- Flow runtime may expose sub-routes via `api.flow.iai.one`
- All endpoints versioned: `/v1/...`
- JSON only
- Auth via Bearer token / session / signed internal calls
- Rate limits by route class
- Every mutating route writes to `audit_logs`

---

## 2. AUTH & IDENTITY

### POST /v1/auth/register

Create account or initiate invite-based setup.

Request:

- email
- password OR auth_provider_token
- locale
- timezone

Response:

- user
- session
- verification_state

### POST /v1/auth/login

Request:

- email
- password

Response:

- access_token
- refresh_token
- user

### POST /v1/auth/logout

Invalidate current session/token.

### GET /v1/auth/me

Return current user identity + roles + membership state.

### POST /v1/auth/verify-email

### POST /v1/auth/request-magic-link

### POST /v1/auth/refresh

---

## 3. JOIN / MEMBERSHIP / ROLES

### POST /v1/join-requests

Create public or guided join request.

Request:

- email
- intent_text
- source

Response:

- join_request_id
- status

### GET /v1/join-requests/:id

### PATCH /v1/join-requests/:id/review

Admin only.

Request:

- status
- review_notes

### GET /v1/membership/me

Return:

- membership state
- roles
- recognized_at

### POST /v1/membership/recognize

Admin / system only.

### GET /v1/roles/me

Return active roles and scoped permissions.

---

## 4. LIFE OS — CHECK-INS / SCORES / ACTIONS

### POST /v1/checkins/weekly

Create weekly check-in.

Request:

- week_key
- energy_score
- sleep_hours
- sleep_quality_score
- stress_score
- focus_hours
- work_output_score
- learning_hours
- relationship_score
- contribution_score
- notes

Response:

- checkin_id
- generated_scores
- suggested_actions

### GET /v1/checkins/weekly/:week_key

### GET /v1/checkins/history

Query:

- from
- to
- limit

### GET /v1/life-scores/latest

### GET /v1/life-scores/timeline

Query:

- period_type
- from
- to

### POST /v1/actions

Create action plan item.

Request:

- week_key
- title
- description
- category
- due_at

### PATCH /v1/actions/:id

### POST /v1/actions/:id/complete

### GET /v1/actions

Query:

- status
- week_key

### GET /v1/dashboard

Return:

- latest_scores
- 12-week trend
- alerts
- active_actions
- latest_proofs
- latest_lifecode_summary

---

## 5. NOTEBOOK / JOURNAL

### POST /v1/notebooks

### GET /v1/notebooks

### GET /v1/notebooks/:id

### PATCH /v1/notebooks/:id

### DELETE /v1/notebooks/:id

---

## 6. VALUE ENGINE

### POST /v1/value-canvas

### GET /v1/value-canvas

### PATCH /v1/value-canvas/:id

### POST /v1/value-outputs

Create measurable output record.

### GET /v1/value-outputs

Query:

- from
- to
- output_type

### GET /v1/value-engine/summary

Return:

- current canvas
- recent outputs
- aggregated measurable value

---

## 7. FLOW ENGINE

### POST /v1/flows

Create flow definition.

### GET /v1/flows

### GET /v1/flows/:id

### PATCH /v1/flows/:id

### POST /v1/flows/:id/publish

### POST /v1/flows/:id/archive

### POST /v1/flow-runs

Run flow.

Request:

- flow_id
- input
- source_entity_type
- source_entity_id

Response:

- run_id
- status

### GET /v1/flow-runs/:id

### GET /v1/flow-runs/:id/steps

### POST /v1/flow-runs/:id/cancel

### POST /v1/flow-schedules

### GET /v1/flow-schedules

### PATCH /v1/flow-schedules/:id

### DELETE /v1/flow-schedules/:id

---

## 8. PROOF LAYER

### POST /v1/proofs

Create proof from source entity or raw payload.

Request:

- proof_type
- source_system
- source_entity_type
- source_entity_id
- payload_snapshot
- metadata
- visibility

Response:

- proof_id
- payload_hash
- created_at

### GET /v1/proofs/:id

### GET /v1/proofs

Query:

- proof_type
- source_entity_type
- source_entity_id
- user_id

### POST /v1/proofs/verify

Request:

- proof_id OR raw_payload

Response:

- result
- computed_hash
- stored_hash
- verification_details

### POST /v1/proofs/:id/revoke

Admin / legal / system only.

### POST /v1/proofs/:id/sign

Request:

- signer_type
- signature_method
- signature_value

### GET /v1/proofs/:id/signatures

### GET /v1/proofs/:id/verifications

---

## 9. LIFECODE ENGINE

### POST /v1/lifecode/profile

Create/update lifecode input profile.

Request:

- birth_date
- birth_time
- timezone
- input_name
- optional_extended_inputs

### GET /v1/lifecode/profile

### POST /v1/lifecode/analyze

Generate report.

Request:

- report_type (snapshot / deep / master / timeline)

Response:

- report_id
- indexes
- windows
- ai_summary

### GET /v1/lifecode/reports

### GET /v1/lifecode/reports/:id

### GET /v1/lifecode/reports/:id/windows

### GET /v1/lifecode/timeline

Query:

- granularity (year / month)
- from_age
- to_age

---

## 10. COMMUNITY / GROUPS / PROGRAMS

### GET /v1/groups

### GET /v1/groups/:id

### POST /v1/groups/:id/join

### POST /v1/groups/:id/leave

### GET /v1/programs

### GET /v1/programs/:id

### POST /v1/programs/:id/enroll

### POST /v1/programs/:id/complete-step

---

## 11. CONTENT / DOCS

### GET /v1/content

Query:

- content_type
- locale
- status
- slug

### GET /v1/content/:slug

---

## 12. TEAM OS / ORGANIZATIONS

### POST /v1/organizations

### GET /v1/organizations/:id

### POST /v1/organizations/:id/invite

### GET /v1/organizations/:id/members

### GET /v1/team-os/:organization_id/snapshots

### POST /v1/team-os/:organization_id/snapshots

---

## 13. PRIVACY / EXPORT / DELETION

### POST /v1/privacy/export

### POST /v1/privacy/delete

### GET /v1/privacy/requests

### GET /v1/privacy/requests/:id

---

## 14. ADMIN / AUDIT

### GET /v1/admin/audit-logs

Filters:

- actor_user_id
- action
- target_type
- from
- to

### GET /v1/admin/system-health

### GET /v1/admin/queue-health

### GET /v1/admin/flow-stats

### GET /v1/admin/proof-stats

---

## 15. API RESPONSE STANDARD

Success:

- ok: true
- data
- meta (optional)

Error:

- ok: false
- error:
  - code
  - message
  - details (optional)

---

## 16. ACCESS CLASSES

- Public
- Authenticated user
- Role-gated
- Organization admin
- Internal system
- Superadmin

Each route must be tagged with one class in implementation.
