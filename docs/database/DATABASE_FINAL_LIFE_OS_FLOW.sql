-- DATABASE_FINAL_LIFE_OS_FLOW.sql
-- Version 1.0

-- USERS
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT,
  created_at TEXT
);

-- WORKSPACES
CREATE TABLE workspaces (
  id TEXT PRIMARY KEY,
  name TEXT
);

-- LIFE CHECK-IN
CREATE TABLE life_checkins (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  energy INTEGER,
  sleep INTEGER,
  stress INTEGER,
  focus INTEGER,
  work_clarity INTEGER,
  relationships INTEGER,
  contribution INTEGER,
  created_at TEXT
);

-- LIFE METRICS
CREATE TABLE life_metrics (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  clarity REAL,
  stability REAL,
  value REAL,
  legacy REAL,
  created_at TEXT
);

-- FLOWS
CREATE TABLE flows (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at TEXT
);

-- RUNS
CREATE TABLE runs (
  id TEXT PRIMARY KEY,
  flow_id TEXT,
  user_id TEXT,
  status TEXT,
  started_at TEXT,
  ended_at TEXT
);

-- RUN STEPS
CREATE TABLE run_steps (
  id TEXT PRIMARY KEY,
  run_id TEXT,
  step_key TEXT,
  status TEXT,
  input TEXT,
  output TEXT
);

-- AGENTS
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT
);

-- PROOF
CREATE TABLE proofs (
  id TEXT PRIMARY KEY,
  run_id TEXT,
  hash TEXT,
  created_at TEXT
);

-- BILLING
CREATE TABLE usage_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  run_id TEXT,
  cost REAL,
  created_at TEXT
);
