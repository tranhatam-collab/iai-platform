# IAI FLOW — NODE LIBRARY SPEC

Target: 100+ nodes  
Purpose: Standardize node categories, contracts, and minimum metadata.

## 1. NODE CONTRACT (ALL NODES)

Each node must define:

- node_key
- category
- display_name
- description
- input_schema
- output_schema
- execution_mode (sync / async / queued)
- retry_policy
- timeout_seconds
- secrets_required
- side_effect_level (none / low / high)
- audit_required (yes / no)

---

## 2. NODE CATEGORIES

### A. INPUT / TRIGGERS (12)

1. Manual Trigger
2. Schedule Trigger
3. Webhook Trigger
4. API Trigger
5. Event Bus Trigger
6. Form Submission Trigger
7. Check-in Created Trigger
8. Action Completed Trigger
9. Proof Created Trigger
10. Lifecode Report Generated Trigger
11. Group Enrollment Trigger
12. Organization Snapshot Trigger

### B. FLOW CONTROL (12)

13. If / Else
14. Switch
15. Branch
16. Merge
17. Delay
18. Wait Until Date
19. Retry Block
20. Fail Fast
21. Continue On Error
22. Rate Limit Gate
23. Parallel Split
24. Sequence Gate

### C. DATA TRANSFORM (12)

25. Set Fields
26. Rename Fields
27. Map Object
28. Filter Array
29. Flatten JSON
30. Parse JSON
31. String Template
32. Number Formatter
33. Date Formatter
34. Hash Payload
35. Diff Compare
36. Redact Sensitive Fields

### D. STORAGE / DATABASE (12)

37. Create Record
38. Update Record
39. Upsert Record
40. Delete Record
41. Query Records
42. Raw SQL Read
43. Raw SQL Write
44. D1 Read
45. D1 Write
46. KV Get
47. KV Set
48. R2 Put / Get

### E. USER / IDENTITY (8)

49. Load User
50. Load User Roles
51. Create Join Request
52. Grant Role
53. Revoke Role
54. Create Session Token
55. Send Magic Link
56. Verify Email Status

### F. LIFE OS (10)

57. Create Weekly Check-in
58. Generate Life Scores
59. Detect Burnout Risk
60. Generate 3 Actions
61. Create Action Plan
62. Complete Action Plan
63. Create Notebook Entry
64. Aggregate 12-Week Trend
65. Compute Value Summary
66. Generate Dashboard Snapshot

### G. LIFECODE (10)

67. Build Lifecode Profile
68. Compute Life Code Index
69. Generate Timeline Windows
70. Generate Risk Window
71. Generate Alignment Window
72. Generate Peak Window
73. Generate Transition Window
74. Summarize Lifecode Report
75. Compare Current Scores vs LifeCode
76. Create Lifecode Proof

### H. PROOF LAYER (10)

77. Create Proof
78. Verify Proof
79. Revoke Proof
80. Attach Signature
81. Compare Hash
82. Create Proof From File
83. Create Proof From Output
84. Load Proof History
85. Verify External Artifact
86. Generate Contribution Receipt

### I. AI / MODEL (8)

87. Summarize Text
88. Pattern Detection
89. Suggest 3 Actions
90. Safety Classification
91. Structured Extraction
92. Embedding Generate
93. Semantic Search
94. AI Output Validator

### J. COMMUNICATION (10)

95. Send Email
96. Send Internal Notification
97. Send Digest
98. Send Reminder
99. Create Calendar Event
100. Post Webhook Response
101. Send Slack/Chat Message
102. Send SMS (optional regional)
103. Push App Notification
104. Create Mail Queue Item

### K. TEAM / COMMUNITY (8)

105. Create Group Enrollment
106. Assign Mentor
107. Update Program Progress
108. Create Team Snapshot
109. Compute Org Stability Index
110. Create Group Report
111. Add Community Note
112. Publish Internal Update

### L. OBSERVABILITY / ADMIN (8)

113. Log Event
114. Log Audit Action
115. Emit Metric
116. Health Check
117. Dead Letter Queue Push
118. Retry Queue Push
119. Trace Span Create
120. Alert Admin

---

## 3. NODE METADATA REQUIRED FOR UI

- icon_key
- display_group
- short_help
- long_help
- example_input
- example_output
- tags[]
- docs_url
- danger_level

---

## 4. NODE EXECUTION RULES

- High side-effect nodes require confirmation in builder
- Proof nodes must always log audit events
- AI nodes must store model name + prompt version
- DB write nodes must support idempotency key
- External API nodes must support timeout + retry policy

---

## 5. NODE VERSIONING

Every node version tracks:

- node_key
- semantic_version
- breaking_change_flag
- changelog
- compatibility_notes

---

## 6. MINIMUM DOCS FOR EACH NODE

- Purpose
- When to use
- When NOT to use
- Inputs
- Outputs
- Failure modes
- Example flow placement
