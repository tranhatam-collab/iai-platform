# FLOW + PROOF ENGINE SPEC

## 1. MỤC TIÊU

Xây dựng Execution + Verification Layer cho toàn bộ hệ IAI:

- Mọi action → chạy qua Flow
- Mọi output → ghi vào Proof
- Mọi dữ liệu → truy vết được

## 2. KIẾN TRÚC

```
User Action
   ↓
App (Life OS)
   ↓
Flow Engine (flow.iai.one)
   ↓
Execution Coordinator (Durable Object)
   ↓
Result
   ↓
Proof Engine (api.iai.one)
   ↓
Stored + Verifiable
```

## 3. FLOW ENGINE — MODULES

### 3.1 Flow Definition

- `id`
- `name`
- `trigger_type` (manual / scheduled / event)
- `steps[]`
- `retry_policy`
- `timeout`

### 3.2 Step Structure

- `step_id`
- `type` (api / ai / compute / delay)
- `input_schema`
- `output_schema`
- `executor`

### 3.3 Execution Lifecycle

`pending → running → success / failed → logged`

### 3.4 Execution Coordinator (Durable Object)

Responsibilities:

- giữ state từng execution
- retry logic
- step transition
- timeout control
- logging

## 4. PROOF ENGINE

### 4.1 MỤC ĐÍCH

Tạo:

**Proof Layer = Trust Layer của toàn hệ**

### 4.2 PROOF OBJECT

- `proof_id`
- `user_id`
- `source` (app / flow / api)
- `type` (action / output / analysis)
- `hash`
- `data_snapshot`
- `timestamp`
- `signature` (optional)
- `visibility`

### 4.3 HASH STRATEGY

- SHA-256 toàn payload
- Không lưu raw data nếu nhạy cảm
- Lưu: hash, metadata, reference

### 4.4 PROOF TYPES

| Type | Description |
|------|-------------|
| `checkin` | user weekly data |
| `action` | user committed action |
| `output` | work result |
| `analysis` | AI / LifeCode output |
| `workflow` | Flow execution |

### 4.5 VERIFY FLOW

Input: `proof_id` OR file  
→ fetch proof  
→ re-hash  
→ compare  
→ return valid / invalid

## 5. API CONTRACT

`POST /flow/run`

- `flow_id`
- `input`
- `user_id`

`GET /flow/status/:id`

`POST /proof/create`

- `type`
- `data`
- `source`

`GET /proof/:id`

`POST /proof/verify`

## 6. KẾT NỐI HỆ

| System | Integration |
|--------|-------------|
| App | trigger flow |
| Flow | generate proof |
| Dash | visualize proof |
| Docs | explain schema |
| Developer | SDK |
