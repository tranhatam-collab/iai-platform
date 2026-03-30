-- IAI.ONE PLATFORM — PRODUCTION DATABASE SCHEMA
-- Purpose:
-- Core schema for Life OS App, Flow Engine, Proof Layer, LifeCode Engine,
-- Membership / Access, and operational analytics.
-- Notes:
-- 1) Keep PII minimal.
-- 2) Sensitive raw payloads should be encrypted at application layer.
-- 3) Use soft delete where appropriate.
-- 4) Timestamps stored in UTC ISO or integer epoch consistently.

PRAGMA foreign_keys = ON;

-- =========================================================
-- 1. USERS / IDENTITY
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  email_verified INTEGER DEFAULT 0,
  password_hash TEXT,
  auth_provider TEXT,               -- local / google / magic_link / internal
  status TEXT NOT NULL DEFAULT 'active', -- active / paused / disabled / deleted
  locale TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  display_name TEXT,
  legal_name TEXT,
  country_code TEXT,
  city TEXT,
  birth_date TEXT,
  avatar_url TEXT,
  bio TEXT,
  consent_version TEXT,
  privacy_level TEXT DEFAULT 'private', -- private / team / public-proof-only
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_token_hash TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  last_seen_at TEXT,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- =========================================================
-- 2. ACCESS / MEMBERSHIP / ROLES
-- =========================================================

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,        -- observer / participant / contributor / protocol_holder / admin
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  granted_by TEXT,
  granted_reason TEXT,
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

CREATE TABLE IF NOT EXISTS memberships (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  state TEXT NOT NULL, -- observer / participant / long_term_contributor / protocol_holder
  recognized_at TEXT,
  recognized_by TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);

CREATE TABLE IF NOT EXISTS join_requests (
  id TEXT PRIMARY KEY,
  email TEXT,
  user_id TEXT,
  source TEXT,                      -- public_join / internal_invite / migration
  intent_text TEXT,
  status TEXT NOT NULL DEFAULT 'submitted', -- submitted / under_review / approved / rejected / archived
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_join_requests_status ON join_requests(status);

-- =========================================================
-- 3. LIFE OS — CHECK-INS / ACTIONS / SCORES
-- =========================================================

CREATE TABLE IF NOT EXISTS weekly_checkins (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  week_key TEXT NOT NULL,           -- 2026-W05
  energy_score INTEGER,
  sleep_hours REAL,
  sleep_quality_score INTEGER,
  stress_score INTEGER,
  focus_hours REAL,
  work_output_score INTEGER,
  learning_hours REAL,
  relationship_score INTEGER,
  contribution_score INTEGER,
  notes TEXT,
  submitted_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, week_key)
);

CREATE INDEX IF NOT EXISTS idx_weekly_checkins_user_id ON weekly_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_checkins_week_key ON weekly_checkins(week_key);

CREATE TABLE IF NOT EXISTS life_scores (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  source_checkin_id TEXT,
  period_type TEXT NOT NULL,        -- weekly / monthly / quarterly
  period_key TEXT NOT NULL,         -- 2026-W05 / 2026-02 / 2026-Q1
  clarity_score REAL,
  stability_score REAL,
  value_score REAL,
  legacy_score REAL,
  deviation_score REAL,
  burnout_risk_score REAL,
  confidence_score REAL,
  generated_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (source_checkin_id) REFERENCES weekly_checkins(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_life_scores_user_period ON life_scores(user_id, period_type, period_key);

CREATE TABLE IF NOT EXISTS action_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  source_checkin_id TEXT,
  week_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,                    -- stability / clarity / value / legacy
  priority INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'planned', -- planned / active / completed / skipped / archived
  due_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (source_checkin_id) REFERENCES weekly_checkins(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_action_plans_user_id ON action_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_action_plans_status ON action_plans(status);

CREATE TABLE IF NOT EXISTS notebooks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  entry_type TEXT NOT NULL,         -- journal / review / lesson / reflection
  title TEXT,
  body TEXT,
  visibility TEXT DEFAULT 'private',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notebooks_user_id ON notebooks(user_id);

-- =========================================================
-- 4. VALUE ENGINE
-- =========================================================

CREATE TABLE IF NOT EXISTS value_canvases (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Default Value Engine',
  value_statement TEXT,
  target_audience TEXT,
  delivery_method TEXT,
  measurement_method TEXT,
  current_constraints TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_value_canvases_user_id ON value_canvases(user_id);

CREATE TABLE IF NOT EXISTS value_outputs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  canvas_id TEXT,
  output_type TEXT,                 -- work / content / product / mentoring / delivery
  title TEXT NOT NULL,
  description TEXT,
  output_date TEXT,
  measurable_value REAL,
  measurement_unit TEXT,
  status TEXT DEFAULT 'recorded',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (canvas_id) REFERENCES value_canvases(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_value_outputs_user_id ON value_outputs(user_id);

-- =========================================================
-- 5. FLOW ENGINE
-- =========================================================

CREATE TABLE IF NOT EXISTS flows (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT,
  workspace_id TEXT,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  version INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft', -- draft / active / archived
  trigger_type TEXT NOT NULL,       -- manual / schedule / event / api
  definition_json TEXT NOT NULL,
  input_schema_json TEXT,
  output_schema_json TEXT,
  visibility TEXT DEFAULT 'private',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_flows_owner_user_id ON flows(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_flows_status ON flows(status);

CREATE TABLE IF NOT EXISTS flow_versions (
  id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  definition_json TEXT NOT NULL,
  changelog TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (flow_id) REFERENCES flows(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_flow_versions_unique ON flow_versions(flow_id, version);

CREATE TABLE IF NOT EXISTS flow_runs (
  id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL,
  triggered_by_user_id TEXT,
  trigger_source TEXT,              -- app / api / scheduler / internal
  source_entity_type TEXT,          -- checkin / action / proof / manual
  source_entity_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending / running / success / failed / cancelled
  input_json TEXT,
  output_json TEXT,
  error_json TEXT,
  started_at TEXT,
  finished_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (flow_id) REFERENCES flows(id) ON DELETE CASCADE,
  FOREIGN KEY (triggered_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_flow_runs_flow_id ON flow_runs(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);

CREATE TABLE IF NOT EXISTS flow_run_steps (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  step_key TEXT NOT NULL,
  step_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  input_json TEXT,
  output_json TEXT,
  error_json TEXT,
  started_at TEXT,
  finished_at TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (run_id) REFERENCES flow_runs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_flow_run_steps_run_id ON flow_run_steps(run_id);

CREATE TABLE IF NOT EXISTS flow_schedules (
  id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL,
  cron_expression TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  status TEXT NOT NULL DEFAULT 'active',
  next_run_at TEXT,
  last_run_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (flow_id) REFERENCES flows(id) ON DELETE CASCADE
);

-- =========================================================
-- 6. PROOF LAYER
-- =========================================================

CREATE TABLE IF NOT EXISTS proofs (
  id TEXT PRIMARY KEY,
  proof_type TEXT NOT NULL,         -- checkin / action / output / analysis / workflow / media
  source_system TEXT NOT NULL,      -- app / flow / api / lifecode / external
  source_entity_type TEXT,
  source_entity_id TEXT,
  user_id TEXT,
  payload_hash TEXT NOT NULL,
  payload_snapshot_json TEXT,
  metadata_json TEXT,
  visibility TEXT DEFAULT 'private', -- private / team / public_proof_only
  status TEXT DEFAULT 'valid',      -- valid / revoked / superseded
  created_at TEXT NOT NULL,
  revoked_at TEXT,
  revoked_reason TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_proofs_user_id ON proofs(user_id);
CREATE INDEX IF NOT EXISTS idx_proofs_source_entity ON proofs(source_entity_type, source_entity_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_proofs_payload_hash ON proofs(payload_hash);

CREATE TABLE IF NOT EXISTS proof_signatures (
  id TEXT PRIMARY KEY,
  proof_id TEXT NOT NULL,
  signer_type TEXT NOT NULL,        -- system / user / org / legal / media
  signer_id TEXT,
  signature_method TEXT NOT NULL,   -- internal / external / detached
  signature_value TEXT NOT NULL,
  signed_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (proof_id) REFERENCES proofs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_proof_signatures_proof_id ON proof_signatures(proof_id);

CREATE TABLE IF NOT EXISTS proof_verifications (
  id TEXT PRIMARY KEY,
  proof_id TEXT NOT NULL,
  verified_by_user_id TEXT,
  verification_method TEXT NOT NULL, -- id_lookup / file_rehash / api_check
  result TEXT NOT NULL,              -- valid / invalid / partial
  details_json TEXT,
  verified_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (proof_id) REFERENCES proofs(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_proof_verifications_proof_id ON proof_verifications(proof_id);

-- =========================================================
-- 7. LIFECODE ENGINE
-- =========================================================

CREATE TABLE IF NOT EXISTS lifecode_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  input_birth_date TEXT,
  input_birth_time TEXT,
  input_timezone TEXT,
  input_name TEXT,
  profile_version TEXT,
  source_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lifecode_profiles_user_id ON lifecode_profiles(user_id);

CREATE TABLE IF NOT EXISTS lifecode_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT,
  report_type TEXT NOT NULL,        -- snapshot / deep / master / timeline
  life_code_index REAL,
  stability_index REAL,
  clarity_index REAL,
  value_index REAL,
  risk_index REAL,
  confidence_score REAL,
  report_json TEXT NOT NULL,
  generated_by TEXT,                -- system / ai / analyst
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (profile_id) REFERENCES lifecode_profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_lifecode_reports_user_id ON lifecode_reports(user_id);

CREATE TABLE IF NOT EXISTS lifecode_windows (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL,
  window_type TEXT NOT NULL,        -- peak / risk / transition / alignment
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  label TEXT,
  score REAL,
  notes TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (report_id) REFERENCES lifecode_reports(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lifecode_windows_report_id ON lifecode_windows(report_id);

CREATE TABLE IF NOT EXISTS ai_summaries (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  source_type TEXT NOT NULL,        -- checkin / report / timeline / dashboard
  source_id TEXT,
  model_name TEXT,
  prompt_version TEXT,
  summary_text TEXT NOT NULL,
  suggestions_json TEXT,
  safety_flags_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_summaries_user_id ON ai_summaries(user_id);

-- =========================================================
-- 8. COMMUNITY / GROUPS / PROGRAMS
-- =========================================================

CREATE TABLE IF NOT EXISTS practice_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  country_code TEXT,
  timezone TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS group_memberships (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'member',       -- member / mentor / steward
  status TEXT DEFAULT 'active',
  joined_at TEXT NOT NULL,
  left_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (group_id) REFERENCES practice_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_group_memberships_user_id ON group_memberships(user_id);

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,        -- 90_day_v1 / weekly_reset / team_os_pilot
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS program_enrollments (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',     -- active / completed / paused / dropped
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_program_enrollments_program_id ON program_enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_program_enrollments_user_id ON program_enrollments(user_id);

-- =========================================================
-- 9. CONTENT / DOCS / PLAYBOOKS
-- =========================================================

CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  content_type TEXT NOT NULL,       -- article / playbook / case / trend_report / page
  title TEXT NOT NULL,
  summary TEXT,
  body_markdown TEXT,
  locale TEXT DEFAULT 'en',
  status TEXT DEFAULT 'draft',      -- draft / published / archived
  canonical_url TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_items_type_status ON content_items(content_type, status);

-- =========================================================
-- 10. ENTERPRISE / TEAM OS
-- =========================================================

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  country_code TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS organization_members (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'member',       -- owner / admin / manager / member
  status TEXT DEFAULT 'active',
  joined_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON organization_members(organization_id);

CREATE TABLE IF NOT EXISTS team_os_snapshots (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  period_key TEXT NOT NULL,
  stability_index REAL,
  burnout_risk_index REAL,
  focus_index REAL,
  participation_index REAL,
  anonymized_payload_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_team_os_snapshots_unique ON team_os_snapshots(organization_id, period_key);

-- =========================================================
-- 11. AUDIT / SECURITY / PRIVACY
-- =========================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT,
  actor_type TEXT NOT NULL,         -- user / system / admin / api_key
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

CREATE TABLE IF NOT EXISTS privacy_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  request_type TEXT NOT NULL,       -- export / delete / rectify / restrict
  status TEXT DEFAULT 'submitted',  -- submitted / processing / completed / rejected
  details_json TEXT,
  submitted_at TEXT NOT NULL,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_privacy_requests_user_id ON privacy_requests(user_id);

CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  owner_type TEXT NOT NULL,         -- user / org / system
  owner_id TEXT NOT NULL,
  label TEXT,
  key_hash TEXT NOT NULL,
  scopes_json TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  expires_at TEXT,
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_api_keys_owner ON api_keys(owner_type, owner_id);
