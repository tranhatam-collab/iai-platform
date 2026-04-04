# IAI_ONE_WIX_BUILD_CHECKLIST_OWNER_ETA_v2_NAMES

Date: 2026-04-03
Status: Owner + ETA board with assigned owner names
Based on:

- `IAI_ONE_WIX_BUILD_CHECKLIST.md`
- `IAI_ONE_WIX_BUILD_CHECKLIST_OWNER_ETA.md`

## 1. Team Assignment (Named)

Named owner mapping for this execution wave:

- Product Owner: **Tam Tran**
- Content Lead: **Linh Nguyen**
- Design Lead: **Minh Pham**
- Wix Builder: **An Vo**
- SEO Specialist: **Huy Le**
- QA Lead: **Quynh Do**
- Ops / Infra: **Khoa Bui**

If your real team names differ, edit only this section and keep task ownership unchanged.

## 2. Milestone Timeline

- `M1` Content + visual lock complete: 2026-04-05
- `M2` Wix build complete (staging): 2026-04-07
- `M3` SEO + QA complete: 2026-04-08
- `M4` Publish + 24h verification complete: 2026-04-10

## 3. Detailed Task Board (Owner Name + ETA)

| ID | Task | Owner Name | Supporting | Start | ETA | Status |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | Confirm H1 and root role statement | Tam Tran | Linh Nguyen | 2026-04-03 | 2026-04-03 | `[ ]` |
| A2 | Lock final copy for all 8 sections | Linh Nguyen | Tam Tran | 2026-04-03 | 2026-04-04 | `[ ]` |
| A3 | Lock CTA labels + destination links | Tam Tran | Linh Nguyen | 2026-04-04 | 2026-04-04 | `[ ]` |
| B1 | Lock palette, typography, spacing system | Minh Pham | Tam Tran | 2026-04-03 | 2026-04-04 | `[ ]` |
| B2 | Lock CTA/card/heading/footer component styles | Minh Pham | An Vo | 2026-04-04 | 2026-04-05 | `[ ]` |
| B3 | Remove excessive template animations | An Vo | Minh Pham | 2026-04-05 | 2026-04-05 | `[ ]` |
| C1 | Build full section structure in Wix | An Vo | Minh Pham | 2026-04-05 | 2026-04-06 | `[ ]` |
| C2 | Build header and mobile-safe nav | An Vo | Minh Pham | 2026-04-05 | 2026-04-06 | `[ ]` |
| C3 | Build all section blocks with locked copy | An Vo | Linh Nguyen | 2026-04-06 | 2026-04-07 | `[ ]` |
| C4 | Build footer groups and authority statement | An Vo | Tam Tran | 2026-04-07 | 2026-04-07 | `[ ]` |
| D1 | Validate core CTA routes | Quynh Do | An Vo | 2026-04-07 | 2026-04-07 | `[ ]` |
| D2 | Validate all surface links (domain map) | Quynh Do | Khoa Bui | 2026-04-07 | 2026-04-07 | `[ ]` |
| D3 | Validate legacy-community routing line and target | Quynh Do | Tam Tran | 2026-04-07 | 2026-04-07 | `[ ]` |
| E1 | Set homepage title/description/canonical | Huy Le | An Vo | 2026-04-07 | 2026-04-08 | `[ ]` |
| E2 | Configure OG title/description/image | Huy Le | Minh Pham, An Vo | 2026-04-07 | 2026-04-08 | `[ ]` |
| E3 | Validate robots/sitemap/canonical conflicts | Huy Le | Khoa Bui | 2026-04-08 | 2026-04-08 | `[ ]` |
| F1 | Role QA (root authority, no app/portal overlap) | Tam Tran | Quynh Do | 2026-04-08 | 2026-04-08 | `[ ]` |
| F2 | UX QA desktop/mobile + hierarchy | Quynh Do | Minh Pham | 2026-04-08 | 2026-04-08 | `[ ]` |
| F3 | Consistency QA vs constitution/manifest | Tam Tran | Linh Nguyen | 2026-04-08 | 2026-04-08 | `[ ]` |
| F4 | Routing QA final pass | Quynh Do | Khoa Bui | 2026-04-08 | 2026-04-08 | `[ ]` |
| G1 | Final sign-off (content, design, product) | Tam Tran | Linh Nguyen, Minh Pham | 2026-04-08 | 2026-04-08 | `[ ]` |
| G2 | Publish on Wix + live smoke test | An Vo | Khoa Bui | 2026-04-09 | 2026-04-09 | `[ ]` |
| G3 | 24h post-publish verification | Quynh Do | Huy Le, Khoa Bui | 2026-04-09 | 2026-04-10 | `[ ]` |

## 4. Critical Path

Critical path tasks that must not slip:

1. `A2` lock copy
2. `B1` lock visual system
3. `C3` build all sections with approved content
4. `E1` and `E2` metadata/OG setup
5. `F1` role QA
6. `G2` publish

## 5. Daily Update Format

```text
Date:
Owner:
Done:
In progress:
Blocked:
Need decision:
ETA change (if any):
```

## 6. Escalation Rules

- If `A2` is not done by 2026-04-04 -> Tam Tran escalates and freezes build updates.
- If `B1` is not done by 2026-04-04 -> pause Wix implementation to avoid redesign churn.
- If `E1/E2` are not done by 2026-04-08 -> no publish.
- If `F1` fails role QA -> no publish.

## 7. Publish Gate (Hard)

Publish only when all are true:

- [ ] All tasks A1 to F4 marked `[x]`
- [ ] No blocker remains `[!]`
- [ ] Tam Tran approves role integrity
- [ ] Quynh Do approves routing integrity
- [ ] Huy Le approves metadata integrity
