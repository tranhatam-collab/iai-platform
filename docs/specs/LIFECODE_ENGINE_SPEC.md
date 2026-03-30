# LIFECODE ENGINE SPEC

## 1. MỤC TIÊU

Xây dựng:

**Human Life Intelligence Engine**

## 2. INPUT DATA

**Core**

- `date_of_birth`
- `name` (optional)
- `timezone`

**Extended (optional)**

- behavior patterns
- check-in history
- life events

## 3. OUTPUT

### 3.1 LIFE CODE INDEX

LCI = weighted score (0–100)

### 3.2 DIMENSIONS

| Dimension | Meaning |
|-----------|---------|
| Stability | nhịp sống |
| Clarity | nhận thức |
| Value | output |
| Risk | nguy cơ |

### 3.3 TIMELINE ENGINE

0–99 life timeline

- + yearly
- + monthly

### 3.4 WINDOWS

- Peak window
- Risk window
- Transition window
- Alignment window

## 4. AI ENGINE (CONTROLLED)

AI chỉ làm:

1. summarize
2. detect pattern
3. suggest 3 actions

**KHÔNG:**

- dự đoán tuyệt đối
- đưa quyết định thay user

## 5. COMPUTATION MODULES

- Numerology mapping (1–22)
- Time cycle engine
- Behavior scoring
- Risk model
- Confidence score

## 6. OUTPUT STRUCTURE

```yaml
life_code_profile:
  index
  dimensions
  timeline
  windows
  suggestions
```

## 7. KẾT NỐI

| Layer | Role |
|-------|------|
| App | hiển thị |
| Proof | lưu analysis |
| Flow | trigger analysis |
| API | serve |
| Dash | visualize |
