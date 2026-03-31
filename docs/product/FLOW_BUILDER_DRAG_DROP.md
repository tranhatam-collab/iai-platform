# FLOW_BUILDER_DRAG_DROP.md
## IAI — Flow Builder (Lightweight n8n-style)
## Version 1.0

---

# 0. GOAL

Visual workflow builder:

- drag node
- connect edges
- run flow

---

# 1. CORE LIB

Use:
- React Flow (lightweight)

---

# 2. COMPONENTS

<FlowCanvas />
<NodePanel />
<ConfigPanel />

---

# 3. NODE TYPES

- trigger
- action
- logic
- agent
- output

---

# 4. USER FLOW

1. drag node
2. connect nodes
3. configure
4. save
5. run

---

# 5. NODE CONFIG UI

Each node:
- input fields
- mapping
- preview

---

# 6. EXECUTION

Click "Run":
-> send graph to backend
-> backend executes

---

# 7. STATE

Store:
- nodes
- edges
- config

---

# 8. FINAL DIRECTIVE

Builder must:
- fast
- simple
- not overwhelm user
