# H5 — TRUST LAYER & COMPLIANCE EMBEDDING
**Branch:** `feature/homepage-v1`
**Date:** 2026-03-28
**Gate:** Requires "Approved H4"
**Output:** Trust UX Spec + Compliance Display Rules + ProvenanceBadge + CharterBadge

---

## 1. WHY TRUST LAYER IS THE MOAT

Trust layer **không phải** tính năng thêm vào — nó là **core differentiator** của IAI:

```
Bất kỳ platform nào cũng có:          IAI có thêm:
├── Posts                              ├── ProvenanceBadge (mọi post)
├── Feed                               ├── CharterBadge (compliance indicator)
├── Auth                               ├── FactBadge (AI verification status)
└── Comments                          ├── TrustScore (per-user)
                                       └── On-chain proof (IPFS/blockchain)
```

**Mục tiêu H5:** Đảm bảo trust indicators hiện diện và đúng ở mọi nơi trên homepage — không có post, section, hay action nào thiếu trust context.

---

## 2. TRUST INDICATOR TAXONOMY

| Indicator | Component | Scope | Data Source |
|-----------|-----------|-------|-------------|
| Charter Badge | `<CharterBadge />` | Section header, Hero | Static — always shown |
| Fact Badge | `<FactBadge />` | Per-post | `post.fact_status` + `post.fact_score` |
| Fact Badge Inline | `<FactBadgeInline />` | Post card header | Same |
| Provenance Badge | `<ProvenanceBadge />` | Per-post (on-chain) | `post.ipfs_cid` / `post.chain_tx_hash` |
| Trust Score | `<TrustScoreChip />` | Per-user | `user.trust_score` |
| Trust Strip | `<TrustStrip />` | Homepage global | HomeMetrics |
| Verify Button | `<VerifyLink />` | Per-post | `post.id` + `post.content` |

---

## 3. COMPONENT SPECS

### 3.1 `ProvenanceBadge` (NEW)

**File:** `apps/web/components/trust/ProvenanceBadge.tsx`

```typescript
interface ProvenanceBadgeProps {
  hash?: string | null          // content_hash
  ipfsCid?: string | null       // IPFS CID
  txHash?: string | null        // blockchain tx hash
  verified?: boolean            // is provenance verified
  size?: 'sm' | 'md'
  showModal?: boolean           // click → open verify modal
}
```

**Display rules:**
```
If ipfsCid OR txHash:
  → Show ⬡ badge with "On-Chain" label
  → Color: text-cyan-iai
  → Click: open ProvenanceModal

If hash only (no chain):
  → Show ◈ badge with "Provenance" label
  → Color: text-white/40

If nothing:
  → Render nothing (null)
```

**ProvenanceModal content:**
```
┌──────────────────────────────────────────────────────┐
│  ⬡ Provenance Record                           [×]  │
├──────────────────────────────────────────────────────┤
│  Content Hash:                                       │
│  {hash}                                              │
│                                                      │
│  IPFS CID: {cid}                                     │
│  [View on IPFS Gateway →]                            │
│                                                      │
│  Chain TX: {txHash}                                  │
│  [View on Explorer →]                                │
│                                                      │
│  Verified by IAI Provenance Engine ◎                │
└──────────────────────────────────────────────────────┘
```

---

### 3.2 `CharterBadge` (NEW)

**File:** `apps/web/components/trust/CharterBadge.tsx`

```typescript
interface CharterBadgeProps {
  size?: 'xs' | 'sm' | 'md'
  href?: string     // default: 'https://iai.one'
  showLabel?: boolean
}
```

**Display:**
```
✦ Charter Compliant     [link to iai.one]
```

**Visual:**
- Icon: `✦` in gold
- Label: `Charter Compliant` in `font-mono text-[10px] text-white/50`
- Hover: underline + tooltip "Xem IAI Charter →"
- Always rendered — không có loading/error state

---

### 3.3 `TrustScoreChip` (Update existing pattern)

**Current:** Trust score shown as `T{user.trust_score}` inline text
**H5 Enhancement:** Wrap in chip component với tooltip

```typescript
interface TrustScoreChipProps {
  score: number
  showLabel?: boolean
  tooltip?: string
}

// Color mapping (from existing getTrustColor utility):
// score >= 80: text-jade (high trust)
// score >= 50: text-gold (medium trust)
// score >= 20: text-amber-400 (developing)
// score < 20:  text-white/40 (new user)
```

---

### 3.4 `FactBadge` (Existing — Spec/Document)

**File:** `apps/web/components/ai/FactBadge.tsx` (EXISTING — không sửa)

**Existing behavior (document for reference):**
```typescript
// fact_status values and visual mapping:
'verified'  → jade green badge    "✓ Đã xác thực"
'disputed'  → amber badge         "⚠ Tranh cãi"
'false'     → red badge           "✗ Sai"
'checking'  → cyan animate-pulse  "◎ Đang kiểm..."
undefined   → null (no badge)
```

**H5 rule:** Tất cả `<PostCard />` phải render `<FactBadgeInline />` (đã có). Không được remove hoặc conditional hide.

---

## 4. TRUST DISPLAY RULES (Compliance Rules)

### Rule 1: Every Post Must Show Trust Status
```typescript
// REQUIRED — cannot be removed
<FactBadgeInline status={post.fact_status} score={post.fact_score} />

// Must NOT be:
{post.fact_status && <FactBadgeInline ... />}   // ← WRONG — hides 'undefined' state
// Must be:
<FactBadgeInline status={post.fact_status ?? 'unchecked'} score={post.fact_score} />
```

### Rule 2: On-Chain Posts Must Show Provenance Badge
```typescript
// REQUIRED when ipfs_cid or chain_tx_hash exists
{(post.ipfs_cid || post.chain_tx_hash) && (
  <ProvenanceBadge
    hash={post.content_hash}
    ipfsCid={post.ipfs_cid}
    txHash={post.chain_tx_hash}
    verified={post.fact_status === 'verified'}
  />
)}
```

### Rule 3: Hero Must Show Charter Indicator
```tsx
// In GuestHero component:
<CharterBadge size="xs" showLabel={true} />
```

### Rule 4: Trust Strip Must Always Render (Never Hidden)
```tsx
// TrustStrip renders even if metrics fail (uses fallback)
// NEVER:
{metrics && <TrustStrip metrics={metrics} />}  // ← WRONG
// ALWAYS:
<TrustStrip verifiedCount={metrics?.verified_posts ?? 1247} />
```

### Rule 5: External Links Must Be Transparent
```tsx
// All external links (iai.one, flow.iai.one, noos.iai.one) must:
target="_blank"
rel="noopener noreferrer"
aria-label="{label} (opens in new tab)"
```

---

## 5. TRUST UX FLOW

### 5.1 Guest Trust Journey
```
Landing on homepage
  → Sees: ● LIVE — Constitutional AI OS badge [Hero]
  → Sees: Trust Strip (Charter ✦ | Verified N | On-Chain ⬡) [Strip]
  → Reads: Feed posts with FactBadge on each post
  → Curiosity: clicks "◎ Kiểm chứng" on a post
  → Lands: /verify page with pre-filled content
  → Trust built → clicks "Tham gia ngay" CTA
  → Registers and becomes verified member
```

### 5.2 Auth Trust Journey
```
Logged in user
  → Sees: PersonalizedGreeting with Trust Score
  → Creates post: sees "AI đang kiểm chứng..." (checking state)
  → Post verified: FactBadge turns green ✓
  → Trust score increases
  → Can see provenance of their own posts
```

---

## 6. CHARTER COMPLIANCE INDICATORS

Mọi section homepage phải có ít nhất 1 trong các indicators:

| Section | Charter Indicator |
|---------|------------------|
| Hero | CharterBadge + "Constitutional AI OS" badge |
| Trust Strip | CharterBadge inline |
| Feed | FactBadge per post |
| Action Panel | None needed (functional) |
| KPI Bar | None needed (metrics) |
| Module Cards | CharterBadge tooltip on hover |
| Roadmap | Phase 1 label: "Education + Truth" (implies charter) |
| Footer | "Constitutional Charter" link → iai.one |

---

## 7. PRIVACY & COMPLIANCE NOTES

### User Data Display
- Trust Score: chỉ hiện số, không expose raw score data
- Handle: public by design (người dùng biết khi đăng ký)
- Email: KHÔNG bao giờ hiện trong feed, comments, hoặc public profile

### External Tracking
- Cloudflare Web Analytics: no cookies, GDPR-compliant
- No third-party pixels on homepage (Facebook, Google Analytics)
- Analytics events: chỉ collect event name + timestamp + anonymized session

### IPFS/Chain Data
- Content hash: public by design (deterministic từ content)
- IPFS CID: public by design (on-chain)
- TX Hash: link to public block explorer (read-only)

---

## 8. IMPLEMENTATION ORDER (Within H5)

```
Day 1:
├── Create components/trust/ directory
├── CharterBadge.tsx (simple, no API)
├── ProvenanceBadge.tsx (with modal)
└── Update TrustStrip to use CharterBadge

Day 2:
├── Update Hero to include CharterBadge
├── Update PostCard to use ProvenanceBadge (replace existing text indicator)
├── Add TrustScoreChip (update PostCard header)
└── Verify all compliance rules pass
```

---

## 9. DELIVERABLES FOR H5 APPROVAL

- [ ] `components/trust/CharterBadge.tsx` created
- [ ] `components/trust/ProvenanceBadge.tsx` created (with modal)
- [ ] All trust display rules (1-5) implemented and verified
- [ ] TrustStrip using CharterBadge
- [ ] Hero showing charter badge
- [ ] PostCard ProvenanceBadge replacing old text indicator
- [ ] No post renders without FactBadge (even if undefined/unchecked)
- [ ] External links all have `rel="noopener noreferrer"`
- [ ] Privacy compliance: no email exposed in any component

**Approve H5:** Comment `Approved H5` trên PR

---

*Document version: v1.0 | 2026-03-28 | feature/homepage-v1*
