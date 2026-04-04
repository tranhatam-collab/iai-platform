# IAI_ONE_WIX_BUILD_CHECKLIST_OWNER_ETA

Date: 2026-04-03
Status: Owner + ETA execution board
Based on: `IAI_ONE_WIX_BUILD_CHECKLIST.md`

## 1. Team Owner Map

Use these owner codes in all tasks.

- `PO` = Product Owner
- `CL` = Content Lead
- `DL` = Design Lead
- `WX` = Wix Builder / Web Implementer
- `SEO` = SEO Specialist
- `QA` = QA Lead
- `OPS` = Ops / Domain / Infra

If you want named assignment, replace codes with real names in this file.

## 2. Milestone Timeline

- `M1` Content + visual lock complete: 2026-04-05
- `M2` Wix build complete (staging): 2026-04-07
- `M3` SEO + QA complete: 2026-04-08
- `M4` Publish + 24h verification complete: 2026-04-10

## 3. Detailed Task Board (Owner + ETA)

| ID | Task | Owner | Start | ETA | Status |
| --- | --- | --- | --- | --- | --- |
| A1 | Confirm H1 and root role statement | PO + CL | 2026-04-03 | 2026-04-03 | `[ ]` |
| A2 | Lock final copy for all 8 sections | CL + PO | 2026-04-03 | 2026-04-04 | `[ ]` |
| A3 | Lock CTA labels + destination links | PO + CL | 2026-04-04 | 2026-04-04 | `[ ]` |
| B1 | Lock palette, typography, spacing system | DL | 2026-04-03 | 2026-04-04 | `[ ]` |
| B2 | Lock CTA/card/heading/footer component styles | DL + WX | 2026-04-04 | 2026-04-05 | `[ ]` |
| B3 | Remove excessive template animations | DL + WX | 2026-04-05 | 2026-04-05 | `[ ]` |
| C1 | Build full section structure in Wix | WX | 2026-04-05 | 2026-04-06 | `[ ]` |
| C2 | Build header and mobile-safe nav | WX | 2026-04-05 | 2026-04-06 | `[ ]` |
| C3 | Build all section blocks with locked copy | WX + CL | 2026-04-06 | 2026-04-07 | `[ ]` |
| C4 | Build footer groups and authority statement | WX | 2026-04-07 | 2026-04-07 | `[ ]` |
| D1 | Validate core CTA routes | QA + WX | 2026-04-07 | 2026-04-07 | `[ ]` |
| D2 | Validate all surface links (domain map) | QA + OPS | 2026-04-07 | 2026-04-07 | `[ ]` |
| D3 | Validate legacy-community routing line and target | QA + PO | 2026-04-07 | 2026-04-07 | `[ ]` |
| E1 | Set homepage title/description/canonical | SEO + WX | 2026-04-07 | 2026-04-08 | `[ ]` |
| E2 | Configure OG title/description/image | SEO + DL + WX | 2026-04-07 | 2026-04-08 | `[ ]` |
| E3 | Validate robots/sitemap/canonical conflicts | SEO + OPS | 2026-04-08 | 2026-04-08 | `[ ]` |
| F1 | Role QA (root authority, no app/portal overlap) | PO + QA | 2026-04-08 | 2026-04-08 | `[ ]` |
| F2 | UX QA desktop/mobile + hierarchy | QA + DL | 2026-04-08 | 2026-04-08 | `[ ]` |
| F3 | Consistency QA vs constitution/manifest | PO + CL | 2026-04-08 | 2026-04-08 | `[ ]` |
| F4 | Routing QA final pass | QA + OPS | 2026-04-08 | 2026-04-08 | `[ ]` |
| G1 | Final sign-off (content, design, product) | PO + CL + DL | 2026-04-08 | 2026-04-08 | `[ ]` |
| G2 | Publish on Wix + live smoke test | WX + OPS | 2026-04-09 | 2026-04-09 | `[ ]` |
| G3 | 24h post-publish verification | QA + SEO + OPS | 2026-04-09 | 2026-04-10 | `[ ]` |

## 4. Critical Path

Critical path tasks that must not slip:

1. `A2` lock copy
2. `B1` lock visual system
3. `C3` build all sections with approved content
4. `E1` and `E2` metadata/OG setup
5. `F1` role QA
6. `G2` publish

## 5. Daily Update Format

Use this update block each day:

```text
Date:
Done:
In progress:
Blocked:
Need decision:
ETA change (if any):
```

## 6. Escalation Rules

- If `A2` is not done by 2026-04-04 -> escalate to PO immediately.
- If `B1` is not done by 2026-04-04 -> pause Wix build to avoid redesign churn.
- If `E1/E2` are not done by 2026-04-08 -> no publish.
- If `F1` fails role QA -> no publish.

## 7. Publish Gate (Hard)

Publish only when all are true:

- [ ] All tasks A1 to F4 marked `[x]`
- [ ] No blocker item remains `[!]`
- [ ] PO approves root role integrity
- [ ] QA approves routing integrity
- [ ] SEO approves metadata integrity
