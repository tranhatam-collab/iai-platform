-- ═══════════════════════════════════════════════════════════════
--  IAI Platform — Seed Data (Development)
--  Intelligence · Artistry · International · iai.one
-- ═══════════════════════════════════════════════════════════════

-- ── Demo Users ────────────────────────────────────────────────
INSERT OR IGNORE INTO users (id, handle, name, email, password_hash, bio, trust_score, edu_level, verified, avatar_url) VALUES
  ('usr_iai_bot',  'iai_bot',  'IAI Verify Bot', 'bot@iai.one',  'SYSTEM',
   'AI kiem chung thong tin tu dong cua IAI. Trust the process, not the claim.', 100, 'expert', 3, NULL),
  ('usr_iai_mind', 'iai_mind', 'IAI Mind',       'mind@iai.one', 'SYSTEM',
   'AI tao bai hoc thong minh — Moi bai deu co nguon dan va duoc kiem chung.', 100, 'expert', 3, NULL),
  ('usr_demo_01',  'nguyenminhhoa', 'Nguyen Minh Hoa', 'hoa@demo.iai.one', 'DEMO_HASH',
   'Giang vien CNTT | Nghien cuu AI & Blockchain | Ha Noi', 85, 'educator', 1, NULL),
  ('usr_demo_02',  'tranthithuha', 'Tran Thi Thu Ha', 'ha@demo.iai.one', 'DEMO_HASH',
   'Hoc sinh THPT | Dam me khoa hoc | TP.HCM', 62, 'learner', 1, NULL),
  ('usr_demo_03',  'phamvantuan', 'Pham Van Tuan', 'tuan@demo.iai.one', 'DEMO_HASH',
   'Nha bao doc lap | Chuyen mang cong nghe & xa hoi', 78, 'educator', 1, NULL);

-- ── Demo Posts ────────────────────────────────────────────────
INSERT OR IGNORE INTO posts (id, user_id, content, type, fact_status, fact_score, fact_summary, content_hash, view_count, like_count, comment_count) VALUES
  ('pst_001', 'usr_demo_03',
   'Viet Nam dung top 5 toc do phat trien AI trong ASEAN theo bao cao McKinsey 2025. Day la ket qua cua viec chinh phu dau tu manh vao chien luoc AI quoc gia voi ngan sach 2.1 ty USD cho giai doan 2025-2030. #AIVietNam #KiemChung',
   'news', 'verified', 98,
   'Dung: McKinsey Global Institute 2025 xep Viet Nam #4 ASEAN ve toc do tang truong dau tu AI (+340% YoY). Can lam ro: "Top 5" chi ap dung cho toc do tang truong.',
   'a3f2b7e1c9d4082f', 1247, 89, 12),
  ('pst_002', 'usr_demo_02',
   'AI se hoan toan thay the giao vien trong vong 10 nam toi. Voi ChatGPT va cac mo hinh language model hien tai, hoc sinh khong can den truong nua ma co the hoc moi thu qua AI. #GiaoDuc #AI',
   'debate', 'disputed', 35,
   'Luan diem nay thieu can cu. Nghien cuu tu MIT va Stanford cho thay AI bo tro giao vien, khong thay the. Ky nang xa hoi va cam xuc khong the day boi AI.',
   'b1c2d3e4f5a6b7c8', 432, 23, 45),
  ('pst_003', 'usr_demo_01',
   'Blockchain khong chi la Bitcoin. Cong nghe nay co the xac minh bang cap gia, luu tru ho so y te an toan, va bao ve quyen tac gia. Viet Nam dang thi diem dung blockchain cho chung chi nghe tai 5 tinh thanh. #Blockchain #GiaoDuc',
   'knowledge', 'verified', 91,
   'Thong tin ve thi diem blockchain cho chung chi nghe tai Viet Nam duoc xac nhan. Bo LDTBXH dang trien khai tai Ha Noi, TP.HCM, Da Nang, Can Tho, Hai Phong.',
   'c4d5e6f7a8b9c0d1', 876, 134, 28);

-- ── Demo Lessons ──────────────────────────────────────────────
INSERT OR IGNORE INTO lessons (id, author_id, title, slug, content_md, summary, subject, level, ai_generated, fact_verified, fact_score, sources, key_concepts, content_hash, status, view_count, like_count, estimated_minutes, published_at) VALUES
  ('lsn_001', 'usr_iai_mind',
   'Blockchain la gi va tai sao no quan trong voi giao duc?',
   'blockchain-la-gi-va-tai-sao-quan-trong',
   '# Blockchain la gi va tai sao no quan trong voi giao duc?

## Hay tuong tuong...

Hay tuong tuong mot quyen so ma **hang trieu nguoi cung giu mot ban sao** — khong ai co the xoa hay sua noi dung ma khong bi phat hien ngay lap tuc. Do chinh la blockchain.

## Blockchain hoat dong the nao?

Blockchain la mot **chuoi cac khoi du lieu** (block) duoc lien ket voi nhau theo thu tu thoi gian. Moi khoi chua:
- **Du lieu** (giao dich, thong tin)
- **Hash** cua chinh no (nhu "dau van tay" duy nhat)
- **Hash** cua khoi truoc do

## Blockchain trong giao duc Viet Nam

| Ung dung | To chuc | Trang thai |
|----------|---------|-----------|
| Chung chi nghe | Bo LDTBXH | Dang thi diem |
| Bang dai hoc | DHQG TP.HCM | Nghien cuu |
| Ho so y te | Bo Y te | Pilot 2025 |',
   'Blockchain la cong nghe so cai phan tan cho phep luu tru du lieu bat bien. Bai hoc giai thich co che hoat dong va ung dung thuc te trong giao duc Viet Nam.',
   'Cong nghe', 'beginner', 1, 1, 94,
   '[{"url":"https://ethereum.org","title":"Ethereum Foundation"},{"url":"https://mit.edu","title":"MIT Research"}]',
   '["blockchain","hash","bat bien","NFT","phi tap trung"]',
   'abc123def456', 'published', 3421, 287, 12, datetime('now', '-3 days')),
  ('lsn_002', 'usr_iai_mind',
   'Tri tue nhan tao (AI) — Tu ly thuyet den ung dung thuc te',
   'tri-tue-nhan-tao-ly-thuyet-va-ung-dung',
   '# Tri tue nhan tao (AI) — Tu ly thuyet den ung dung thuc te

## AI la gi?

**Tri tue nhan tao (AI - Artificial Intelligence)** la kha nang cua may tinh thuc hien cac nhiem vu thuong doi hoi tri thong minh cua con nguoi: nhan biet ngon ngu, ra quyet dinh, nhan dang hinh anh, va hoc tu kinh nghiem.

## Cac loai AI

### 1. Narrow AI (AI hep) — Hien tai
Chi gioi **mot nhiem vu cu the**: ChatGPT viet van ban, AlphaGo choi co vay, FaceID nhan dang khuon mat.

### 2. General AI (AI tong quat) — Tuong lai
Co the lam **bat ky viec gi** con nguoi lam. Chua ton tai, dang nghien cuu.

## AI tai Viet Nam — 2025

- **VinAI**: startup AI hang dau VN, nghien cuu duoc IEEE/NeurIPS chap nhan
- **VietAI**: cong dong AI lon nhat VN voi 50,000+ thanh vien
- **AI Quoc gia**: ngan sach 2.1 ty USD giai doan 2025-2030',
   'Bai hoc gioi thieu toan dien ve AI — tu dinh nghia, phan loai, cach hoc may hoat dong, den tinh hinh phat trien AI tai Viet Nam nam 2025.',
   'Tri tue nhan tao', 'beginner', 1, 1, 89,
   '[{"url":"https://vinai.io","title":"VinAI Research"},{"url":"https://vietai.org","title":"VietAI Community"}]',
   '["AI","machine learning","deep learning","neural network","VinAI"]',
   'def789ghi012', 'published', 5678, 412, 10, datetime('now', '-5 days'));

-- ── Demo Fact Checks ──────────────────────────────────────────
INSERT OR IGNORE INTO fact_checks (id, post_id, status, truth_score, summary, claims, sources, model_used, processing_ms, checked_at) VALUES
  ('fc_001', 'pst_001', 'verified', 98,
   'Thong tin ve Viet Nam top 5 ASEAN ve AI duoc xac nhan. Can lam ro: xep hang dua tren toc do tang truong dau tu, khong phai nang luc tong the.',
   '[{"text":"Viet Nam top 5 toc do phat trien AI ASEAN theo McKinsey 2025","verdict":"true","confidence":95,"explanation":"McKinsey 2025 xep VN #4 ASEAN ve toc do tang truong dau tu AI +340% YoY"},{"text":"Ngan sach 2.1 ty USD cho AI quoc gia 2025-2030","verdict":"true","confidence":98,"explanation":"Chinh phu VN phe duyet Quyet dinh 127/QD-TTg ve chien luoc AI quoc gia"}]',
   '["https://mckinsey.com","https://reuters.com","https://molisa.gov.vn"]',
   'claude-sonnet-4-6', 1250, datetime('now', '-1 day')),
  ('fc_002', 'pst_002', 'disputed', 35,
   'Luan diem "AI thay the hoan toan giao vien trong 10 nam" thieu can cu khoa hoc. Khong co nghien cuu nao xac nhan dieu nay.',
   '[{"text":"AI se hoan toan thay the giao vien trong 10 nam","verdict":"false","confidence":85,"explanation":"MIT CSAIL 2024: AI se bo tro giao vien, khong thay the. 87% giao vien van can thiet"},{"text":"Hoc sinh khong can den truong nho AI","verdict":"unclear","confidence":60,"explanation":"Mo hinh hybrid learning ngay cang pho bien nhung truong hoc van co vai tro quan trong"}]',
   '["https://csail.mit.edu","https://stanford.edu"]',
   'claude-sonnet-4-6', 1890, datetime('now', '-2 hours'));
