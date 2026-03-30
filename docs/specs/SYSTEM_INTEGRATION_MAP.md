# SYSTEM INTEGRATION MAP

## 1. TOÀN BỘ LUỒNG

```
User
↓
App (app.iai.one)
↓
API (api.iai.one)
↓
Flow (flow.iai.one)
↓
Execution
↓
Proof (api.iai.one)
↓
Dash (dash.iai.one)
↓
LifeCode (lifecode.iai.one)
```

## 2. EVENT TRIGGERS

| Event | Action |
|-------|--------|
| Check-in | trigger analysis |
| Action commit | create proof |
| Output created | proof + flow |
| Risk detected | alert |

## 3. DATA FLOW

User Input → API → DB  
→ Flow → Compute  
→ Proof → Store  
→ Dash → Visualize

## 4. SINGLE SOURCE OF TRUTH

👉 tất cả đi qua:

**api.iai.one**
