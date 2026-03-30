# SYSTEM_UNIFICATION_ARCHITECTURE.md
## IAI — Unified System Architecture (Single Engine)
## Version 1.0

---

# 0. GOAL

Unify entire IAI ecosystem into ONE coherent system:

- Flow (execution)
- Agent (intelligence)
- LifeCode (human layer)
- Proof (trust layer)
- Dash (control UI)
- API (control plane)

-> ONE ENGINE  
-> ONE DATA MODEL  
-> ONE EXECUTION TRUTH

---

# 1. CURRENT PROBLEM

System is fragmented:
- flow.iai.one
- app.iai.one
- dash.iai.one
- api.iai.one
- noos / cios / lifecode

Problems:
- duplicated logic
- inconsistent state
- unclear ownership
- scaling risk
- hard debugging

---

# 2. TARGET ARCHITECTURE

            ┌────────────────────┐
            │   IAI SUPER CORE   │
            │ (Unified Engine)   │
            └────────────────────┘
                     │
 ┌───────────────────┼───────────────────┐
 │                   │                   │

Execution Layer   Intelligence Layer   Human Layer
(Flow)             (Agents)           (LifeCode)
│                   │                   │
└───────────┬───────┴───────────┬──────┘
            │                   │
        Trust Layer          Control Layer
        (Proof)              (Dash/API)

---

# 3. UNIFIED CORE

## Core Engine Responsibilities

- run orchestration
- state management
- agent coordination
- artifact handling
- billing tracking
- proof generation
- event emission

---

# 4. UNIFIED OBJECT MODEL

All objects must map into:

- workspace
- environment
- run
- step
- agent
- artifact
- proof
- user
- lifecycle timeline (LifeCode)

---

# 5. EXECUTION PIPELINE

trigger -> run -> steps -> agents -> outputs -> proof -> billing -> logs

Everything flows through this.

---

# 6. EVENT SYSTEM = CENTRAL NERVOUS SYSTEM

Everything emits events:
- run.created
- step.completed
- agent.handoff
- proof.created
- usage.recorded

---

# 7. SINGLE SOURCE OF TRUTH

- D1 = metadata
- DO = runtime state
- R2 = artifacts
- Queue = delivery

NO DUPLICATE STATE.

---

# 8. MODULE COLLAPSE RULE

These MUST be unified:
- flow engine
- agent engine
- lifecycle engine
- proof engine

Do NOT run as separate systems.

---

# 9. API UNIFICATION

Single API gateway:

api.iai.one/v1/*

Routes:
- /flows
- /runs
- /agents
- /lifecode
- /proof
- /billing
- /alerts

---

# 10. UI LAYER

- home.iai.one -> portal
- app.iai.one -> user app
- dash.iai.one -> operator

All call same backend.

---

# 11. FINAL DIRECTIVE

If system is not unified -> cannot scale.

If unified -> becomes infrastructure.
