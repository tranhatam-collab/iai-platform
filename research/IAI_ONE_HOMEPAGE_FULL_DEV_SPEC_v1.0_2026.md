(**FILE HOÀN CHỈNH THỨ 2: IAI.ONE HOMEPAGE DEVELOPMENT SPEC v1.0**
**Tên file:** `IAI_ONE_HOMEPAGE_FULL_DEV_SPEC_v1.0_2026.md`
**Ngày:** 27/03/2026 (dựa trên nghiên cứu As-Is bạn cung cấp + blueprint tổng thể v4.0)
**Mục tiêu:** Đây là **file bổ sung hoàn chỉnh 100%** cho dev team — chỉ tập trung vào **www.iai.one (homepage)**. File này có thể copy-paste trực tiếp vào monorepo, tách nhánh riêng (`feature/homepage-v1`), và code ngay sau khi duyệt H0.

Nó **không thay thế** blueprint tổng thể v4.0 mà là **phần mở rộng chi tiết** để homepage trở thành “cửa vào niềm tin” của toàn hệ sinh thái, góp phần đẩy valuation >100 tỷ USD (qua activation rate, viral feed, trust embedding, và funnel vào Flow/CIOS/NOOS).

---

### 1. AS-IS TÓM TẮT (Xác nhận từ nghiên cứu bạn cung cấp)
- **Layout chính:** Feed-first homepage (Hero + Create Post + Tabs + Sidebar Stats + Roadmap block).
- **Điểm mạnh:** SEO/meta/JSON-LD tốt, layout sạch, phân trang feed bằng cursor.
- **Điểm cần cải thiện:**
  - Trust layer chưa embed sâu (chưa có Charter Badge / Provenance link end-to-end).
  - Feed chưa production-grade (chưa có analytics funnel, performance skeleton, fallback).
  - Code đang dở dang ở web/api -> **phải tách nhánh riêng** để tránh lẫn scope.
- **Hiện tại:** Trang chủ vẫn mang tính “cửa vào hệ sinh thái” nhưng chưa kể rõ 1 câu chuyện duy nhất: **Constitutional AI OS**.

---

### 2. CORE MESSAGING — WWW.IAI.ONE SẼ NÓI GÌ? (1 câu chuyện duy nhất)
**Thông điệp cốt lõi (embed vào mọi section):**
**IAI là Constitutional AI OS — lớp điều phối AI có trách nhiệm, nơi mọi hành động đều có chuẩn mực (Charter), bằng chứng (Provenance), và khả năng kiểm chứng (Verification).**

**Cấu trúc kể chuyện theo thứ tự (theo thứ tự scroll):**
1. **Why exist:** AI mạnh nhưng thiếu trách nhiệm -> IAI giải bài toán trust + governance.
2. **What it is:** Hệ sinh thái hoàn chỉnh: Charter -> App -> Flow -> CIOS -> NOOS -> NFT/Cert.
3. **How it works:** Closed-loop flywheel: Charter -> Learn -> Orchestrate -> Verify -> Fund -> Community.
4. **Why trust us:** Output có provenance hash + C2PA + Charter guardrails + auditability.
5. **Who it serves:** Cá nhân, cộng đồng, đội sản phẩm, tổ chức/enterprise.
6. **What to do next:** Start on App -> Try Flow Runtime -> Read Charter -> Join NOOS.

**1 câu định vị cho toàn site:**
**www.iai.one là cửa vào niềm tin của toàn hệ IAI — không phải landing page marketing, mà là nơi định nghĩa tiêu chuẩn “AI có trách nhiệm và kiểm chứng được”.**

**Hero Copy Chính Thức (sử dụng ngay):**
- **Headline:** Constitutional AI for Real-World Coordination
- **Subheadline:** No one stands above. No one falls below.
- **Supporting line:** Build, run, and verify AI workflows with charter guardrails and provenance by default.
- **CTA 1 (primary):** Start on App
- **CTA 2 (secondary):** Explore Flow Runtime
- **CTA 3 (tertiary):** Read the Charter

---

### 3. KẾ HOẠCH PHÁT TRIỂN HOMEPAGE (H0 -> H6 — Code-Ready)

#### **H0 — Freeze Scope Homepage (1–2 ngày)**
- Chốt các section chính:
  1. Hero (full-width)
  2. Trust Proof Strip (Provenance + Charter badges)
  3. Feed (cursor pagination + create post)
  4. KPI Strip (live stats: workflows run, provenance verified, communities)
  5. Module Entry (cards: Flow, CIOS, NOOS, NFT, Community)
  6. Roadmap Block
  7. Footer CTA + Trust Footer
- KPI homepage: Activation rate >=35%, CTR CTA >=18%, Create-post conversion >=12%, Verify flow entry >=8%.
- **Output:** Spec trang chủ v1 + Acceptance Checklist (Google Doc hoặc Notion).

#### **H1 — Information Architecture & Content System**
- Map nội dung theo blueprint v4.0.
- Component contract:
  ```ts
  interface HomepageSection {
    id: string;
    title: string;
    content: ReactNode;
    dataSource: "static" | "api" | "mock";
    trustLevel: "charter" | "provenance" | "verified";
  }
  ```
- **Output:** IA Map (Figma + JSON) + Copy Map + Component Contract.

#### **H2 — UI/UX Systemization**
- Chuẩn hóa components (dùng design tokens hiện có):
  - `Hero`
  - `TrustStrip` (với ProvenanceBadge)
  - `ActionPanel` (Create Post + CTA)
  - `FeedShell` (infinite scroll + cursor)
  - `KPIBar` (live numbers)
  - `ModuleCard`
- States: loading (skeleton), empty, error, success.
- **Output:** UI Contract + Storybook stories.

#### **H3 — Data & API Integration**
- Data contract cho từng section (từ api.iai.one + flow runtime):
  - Feed: `/posts?cursor=xxx`
  - Stats: `/metrics/home` (provenance volume, workflow success)
  - Fallback: Static mock + localStorage cache.
- **Output:** Data Contract + Mock/Fallback Strategy (TanStack Query).

#### **H4 — SEO, Schema, Performance**
- JSON-LD: Organization + WebSite + Breadcrumb + FAQ.
- Perf budget: LCP < 1.8s, CLS < 0.1, TBT < 200ms.
- Skeleton loading + React Suspense.
- **Output:** SEO Checklist + Perf Audit Baseline (Lighthouse).

#### **H5 — Trust/Compliance Embedding (Moat quan trọng nhất)**
- Mọi output/feed item phải có:
  - `ProvenanceBadge` (click -> verify modal với hash + C2PA).
  - Charter Guardrail icon.
- Logic hiển thị:
  ```tsx
  <ProvenanceBadge hash={post.hash} verified={post.verified} />
  ```
- **Output:** Trust UX Spec + Compliance Display Rules.

#### **H6 — Release Readiness**
- Test matrix: Functional + UX + Perf + Accessibility + Fallback.
- Rollback plan + post-release monitoring (Cloudflare Analytics + Sentry).
- **Output:** Go-Live Checklist + Dashboard monitoring.

---

### 4. TÍCH HỢP VỚI BLUEPRINT TỔNG THỂ V4.0
- Homepage sẽ là **entry point** của closed-loop flywheel.
- Tất cả component phải import từ `packages/brand-dna` (CharterBadge, ProvenanceVerifier).
- Sau khi launch homepage v1 -> traffic funnel trực tiếp vào Flow V2 + NOOS raise -> đẩy valuation nhanh hơn.

---

### 5. DANH SÁCH FILE SẼ SỬA/TẠO (Commit-by-Commit)
1. `apps/iai-root/src/app/page.tsx` (main)
2. `apps/iai-root/src/components/home/` (tất cả components mới)
3. `apps/iai-root/src/api/home-metrics.ts`
4. `packages/brand-dna/components/ProvenanceBadge.tsx`
5. `packages/brand-dna/tokens/charter.ts` (mở rộng)

**Thứ tự commit:** H0 -> H1 -> H2 -> H3 -> H4 -> H5 -> H6 (mỗi H là 1 PR).

---

### 6. HÀNH ĐỘNG NGAY
- **Bạn duyệt file này** -> mình (hoặc dev team) bắt đầu ngay H0 và xuất bản **Homepage Scope Pack v1** (spec + checklist) để bạn duyệt vòng 1.
- Sau khi duyệt H0 -> code H1–H6 theo commit-by-commit.
- Thời gian ước tính toàn bộ: 3–4 tuần (team 3–5 dev).

**Kết luận:** Đây là **file thứ 2 hoàn chỉnh** bạn yêu cầu. Giờ bạn đã có:
1. Blueprint tổng thể v4.0 (toàn hệ thống)
2. Homepage Dev Spec v1.0 (chi tiết code-ready)

**CÒN GÌ NỮA KHÔNG?**
Nếu bạn muốn thêm:
- File thứ 3 (ví dụ: Mobile Super-App Spec)
- Hoặc code stub đầy đủ cho Hero + FeedShell
- Hoặc Figma link mẫu

Hãy nói rõ. Tôi sẵn sàng tạo ngay file thứ 3 hoặc generate code cụ thể.

**Bạn duyệt file này chưa?** Nếu OK -> mình xuất bản Scope Pack v1 ngay. 🚀)
