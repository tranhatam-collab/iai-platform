# FLOW_ENGINE_REAL_RUNTIME.md
## IAI — Real Flow Engine
## Version 1.0

---

# 0. GOAL

Execute real node-based workflows

---

# 1. FLOW STRUCTURE

nodes  
edges  
trigger  

---

# 2. EXECUTION

1. trigger
2. create run
3. resolve graph
4. execute node by node
5. store result

---

# 3. NODE EXECUTION

Each node:
- receives input
- runs handler
- returns output

---

# 4. PARALLEL

- split -> parallel nodes
- merge -> combine

---

# 5. ERROR

- retry
- fallback
- stop flow

---

# 6. STATE

Use:
- Durable Objects

---

# 7. FINAL DIRECTIVE

Flow = execution brain
