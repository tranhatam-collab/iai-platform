# UI_PRODUCTION_REACT_DASHBOARD.md
## IAI — Production Dashboard (React)
## Version 1.0

---

# 0. STACK

- React + Vite
- TailwindCSS
- Zustand (state)
- Recharts (charts)
- Fetch API

---

# 1. APP STRUCTURE

/src  
  /components  
  /pages  
  /store  
  /api  
  App.jsx  
  main.jsx  

---

# 2. MAIN LAYOUT

<AppLayout>

  <Sidebar />

  <Main>

    <Topbar />

    <Content />

  </Main>

</AppLayout>

---

# 3. SIDEBAR

Items:

- Home
- Life
- Timeline
- Flows
- Approvals
- Logs
- Billing

---

# 4. HOME PAGE

## COMPONENTS

<MetricsGrid />

<ActionList />

<RecentRuns />

---

# 5. METRICS GRID

4 cards:

- Clarity
- Stability
- Value
- Legacy

Each:
- number
- trend %
- mini chart

---

# 6. LIFE PAGE

<LifeChart />

<RiskAlert />

<DetailStats />

---

# 7. FLOWS PAGE

<Grid>
  <FlowCard />
</Grid>

---

# 8. RUN DETAIL

<TimelineSteps />
<IOPanel />
<CostPanel />

---

# 9. STORE (Zustand)

useStore = {
user,
metrics,
runs,
flows
}

---

# 10. FINAL DIRECTIVE

UI must:
- load < 1s
- zero clutter
- action-first
