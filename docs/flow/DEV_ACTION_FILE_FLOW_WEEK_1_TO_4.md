# IAI Flow — Build Checklist (Week 1 → Week 4)

**Version 1.0** · Phạm vi: `flow.iai.one` · `api.flow.iai.one` · `dash.iai.one`

---

## GOAL

Trong 4 tuần đầu, team phải khóa được 6 thứ:

1. D1 schema chuẩn production  
2. API domain structure rõ ràng  
3. Queue + event backbone chạy thật  
4. Runtime execution có workspace/environment context  
5. Cost fields đi xuyên suốt run → step → usage  
6. Dash đọc được dữ liệu thật tối thiểu  

Không mở rộng UI sâu trước khi 6 thứ này sống thật.

---

## GLOBAL RULES

- Không build “full feature” trước khi control-plane sống  
- Không đưa payload lớn vào D1  
- Không làm queue consumer non-idempotent  
- Không để object runtime nào thiếu `workspace_id`  
- Không làm billing kiểu ước lượng mơ hồ  
- Không làm UI giả dữ liệu  

---

# WEEK 1 — LOCK SCHEMA + DOMAIN BOUNDARIES

## Objective

Khóa schema, domain, migration order, và source of truth.

---

## 1.1 Database

### MUST DO

- [ ] Tạo migration đầu tiên từ `FLOW_DATABASE_SCHEMA.md`  
- [ ] Chia schema thành domain migration files:  
  - [ ] identity_tenancy  
  - [ ] flow_authoring  
  - [ ] runtime_execution  
  - [ ] agents  
  - [ ] node_registry  
  - [ ] billing  
  - [ ] observability  
- [ ] Chuẩn hóa naming:  
  - [ ] snake_case cho table/column  
  - [ ] text id strategy thống nhất  
- [ ] Thêm indexes bắt buộc:  
  - [ ] runs(workspace_id, started_at)  
  - [ ] runs(status)  
  - [ ] run_steps(run_id, step_key)  
  - [ ] approvals(status, created_at)  
  - [ ] usage_events(workspace_id, created_at)  

### MUST VERIFY

- [ ] Migrate clean từ DB rỗng  
- [ ] Không vượt giới hạn D1 vô lý  
- [ ] Không có table nào nhét blob lớn  

---

## 1.2 Source of Truth Lock

### MUST DO

- [ ] Viết file `SOURCE_OF_TRUTH.md`  
- [ ] Ghi rõ:  
  - [ ] D1 = control plane  
  - [ ] Durable Objects = hot mutable run state  
  - [ ] R2 = artifacts / heavy payloads  
  - [ ] Queue = async delivery, không phải truth  

---

## 1.3 API Domain Split

### MUST DO

- [ ] Tạo module folders:  
  - [ ] `/routes/auth`  
  - [ ] `/routes/workspaces`  
  - [ ] `/routes/flows`  
  - [ ] `/routes/runs`  
  - [ ] `/routes/agents`  
  - [ ] `/routes/proofs`  
  - [ ] `/routes/billing`  
  - [ ] `/routes/alerts`  
- [ ] Mỗi domain có:  
  - [ ] route file  
  - [ ] service file  
  - [ ] repository file  
  - [ ] validator/schema file  

### MUST VERIFY

- [ ] Không route nào truy cập DB trực tiếp nếu chưa qua service/repository  
- [ ] Không trộn auth logic vào flow logic  

---

## 1.4 Multi-tenant Lock

### MUST DO

- [ ] Thêm `workspace_id` vào mọi object runtime bắt buộc  
- [ ] Thêm `environment_id` vào:  
  - [ ] runs  
  - [ ] schedules  
  - [ ] flow promotions  
- [ ] Viết middleware resolve tenant context  

### MUST VERIFY

- [ ] Không route nào trả dữ liệu cross-workspace  
- [ ] Không run nào thiếu workspace context  

---

# WEEK 2 — RUNTIME + QUEUE + EVENT ENVELOPE

## Objective

Làm cho flow chạy được theo pipeline thật, có queue, có event, có trạng thái chuẩn.

---

## 2.1 Event Envelope

### MUST DO

- [ ] Tạo chuẩn `EventEnvelope`  
- [ ] Fields bắt buộc:  
  - [ ] message_id  
  - [ ] event_name  
  - [ ] event_version  
  - [ ] occurred_at  
  - [ ] workspace_id  
  - [ ] run_id  
  - [ ] step_key  
  - [ ] payload  
  - [ ] idempotency_key  
  - [ ] trace_id  

### MUST VERIFY

- [ ] Tất cả producer dùng chung envelope  
- [ ] Không có custom event shape lung tung  

---

## 2.2 Queue Topology

### MUST DO

- [ ] Tạo queues:  
  - [ ] flow-execution-queue  
  - [ ] flow-events-queue  
  - [ ] billing-queue  
  - [ ] notifications-queue  
  - [ ] logs-queue  
- [ ] Tạo consumer tương ứng  
- [ ] Khóa rule:  
  - [ ] authoritative state update trước  
  - [ ] enqueue sau  

### MUST VERIFY

- [ ] Consumer idempotent  
- [ ] Ack only on success  
- [ ] Retry bounded  
- [ ] Dead-letter path có log  

---

## 2.3 Runtime State Machine

### MUST DO

- [ ] Chuẩn hóa `runs.status`  
  - [ ] pending  
  - [ ] running  
  - [ ] paused  
  - [ ] failed  
  - [ ] completed  
  - [ ] canceled  
- [ ] Chuẩn hóa `run_steps.status`  
- [ ] Tạo transition guard  
- [ ] Tạo ExecutionCoordinator interface cho Durable Object  

### MUST VERIFY

- [ ] Không step nào nhảy trạng thái trái logic  
- [ ] Run failed thì next step không tự chạy  

---

## 2.4 Artifacts

### MUST DO

- [ ] Tạo artifact writer abstraction:  
  - [ ] write small metadata → D1  
  - [ ] write large payload → R2  
- [ ] Chuẩn hóa `input_ref`, `output_ref`, `error_ref`  

### MUST VERIFY

- [ ] Không output/prompt lớn nhét trực tiếp vào D1  
- [ ] Mọi `run_steps` đọc được artifact ref chuẩn  

---

# WEEK 3 — COST ENGINE + USAGE EVENTS + BILLING SHADOW

## Objective

Gắn usage thật vào execution thật. Billing phải explainable từ ngày đầu.

---

## 3.1 Cost Fields

### MUST DO

- [ ] Thêm `cost_micros` vào:  
  - [ ] run_steps  
  - [ ] agent_runs  
- [ ] Thêm `total_cost_micros` vào `runs`  
- [ ] Tạo utility tính:  
  - [ ] base step cost  
  - [ ] variable token cost  
  - [ ] orchestration overhead  

### MUST VERIFY

- [ ] Mỗi run tính ra tổng cost  
- [ ] Mỗi step có breakdown tối thiểu  

---

## 3.2 Usage Events

### MUST DO

- [ ] Tạo `usage_events` producer từ:  
  - [ ] run.created / completed  
  - [ ] step.completed  
  - [ ] agent.run.completed  
  - [ ] premium node use  
- [ ] Chuẩn meter keys:  
  - [ ] run_count  
  - [ ] step_count  
  - [ ] agent_tokens  
  - [ ] premium_node_executions  

### MUST VERIFY

- [ ] Không duplicate usage khi retry step  
- [ ] Mọi usage event có source_ref  

---

## 3.3 Billing Queue Consumer

### MUST DO

- [ ] Tạo billing consumer  
- [ ] Aggregate về:  
  - [ ] usage_meters  
  - [ ] credit_ledger  
  - [ ] invoices_shadow  
- [ ] Chuẩn reconciliation job daily  

### MUST VERIFY

- [ ] Có thể trace từ:  
  - [ ] workspace  
  - [ ] run  
  - [ ] step  
  - [ ] usage_event  
  - [ ] ledger  
- [ ] Không có charge nào không giải thích được  

---

## 3.4 Plan Enforcement

### MUST DO

- [ ] Tạo usage guard:  
  - [ ] free plan run cap  
  - [ ] step cap  
  - [ ] token cap  
- [ ] Tạo alert threshold:  
  - [ ] 50%  
  - [ ] 80%  
  - [ ] 100%  

### MUST VERIFY

- [ ] Free tier không vượt trần âm thầm  
- [ ] Hết quota không phá DB state  

---

# WEEK 4 — DASH MINIMUM TRUTH + ALERTING + HARDENING

## Objective

Dash phải đọc dữ liệu thật, không giả lập; operator thấy được hệ đang sống ra sao.

---

## 4.1 Dash Minimum Data Surfaces

### MUST DO

- [ ] Build API cho Dash:  
  - [ ] workspace summary  
  - [ ] recent runs  
  - [ ] run detail  
  - [ ] step detail  
  - [ ] queue health  
  - [ ] approval queue  
  - [ ] billing summary  
  - [ ] alerts  
- [ ] Mỗi panel đọc từ D1 / aggregates thật  

### MUST VERIFY

- [ ] Không hardcode mock data  
- [ ] Số run / cost / alert khớp DB  

---

## 4.2 Alert Engine

### MUST DO

- [ ] Tạo alert rules cho:  
  - [ ] queue backlog spike  
  - [ ] repeated consumer failure  
  - [ ] billing drift  
  - [ ] approval SLA breach  
  - [ ] workflow failure spike  
- [ ] Ghi alerts vào table `alerts`  

### MUST VERIFY

- [ ] Alert không spam  
- [ ] Alert đóng / mở có trạng thái rõ  

---

## 4.3 Approvals

### MUST DO

- [ ] Approval request flow:  
  - [ ] create  
  - [ ] list  
  - [ ] approve  
  - [ ] reject  
  - [ ] expire  
- [ ] Link approval vào run + step  

### MUST VERIFY

- [ ] Run paused đúng khi approval pending  
- [ ] Approve xong run resume đúng  

---

## 4.4 Security / Hardening Baseline

### MUST DO

- [ ] Áp middleware tenant scope mọi route  
- [ ] Áp audit log cho:  
  - [ ] flow publish  
  - [ ] role change  
  - [ ] approval action  
  - [ ] secret change  
  - [ ] billing change  
- [ ] Áp rate limit cho public/abuse-prone routes  
- [ ] Kiểm tra secrets không lộ ở client  

### MUST VERIFY

- [ ] Không query cross-workspace  
- [ ] Không admin action nào không có audit  

---

# END-OF-WEEK ACCEPTANCE CRITERIA

## End of Week 1

- [ ] DB migrate sạch  
- [ ] Domain/module split rõ  
- [ ] Tenant context khóa xong  

## End of Week 2

- [ ] 1 flow chạy qua queue được  
- [ ] step state machine đúng  
- [ ] artifact refs sống thật  

## End of Week 3

- [ ] 1 run có cost breakdown thật  
- [ ] usage events tạo đúng  
- [ ] shadow billing đọc được  

## End of Week 4

- [ ] Dash hiển thị dữ liệu thật  
- [ ] queue health + alerts chạy  
- [ ] approval loop sống  
- [ ] audit/security baseline hoạt động  

---

# DO NOT DO IN WEEKS 1–4

- [ ] Không build marketplace trước  
- [ ] Không build white-label trước  
- [ ] Không polish UI sâu trước  
- [ ] Không thêm quá nhiều node loại “nice to have”  
- [ ] Không làm AI planner phức tạp khi execution core chưa ổn  

---

# AFTER WEEK 4 — READY TO START

Chỉ sau khi xong tuần 1–4 mới mở tiếp:

- richer node library  
- agent orchestration sâu  
- stripe metering sync production  
- marketplace / templates  
- enterprise controls  
- advanced dash UX  

---

# FINAL DIRECTIVE

Weeks 1–4 are not for impressive demos.  
They are for making the system trustworthy under load.
