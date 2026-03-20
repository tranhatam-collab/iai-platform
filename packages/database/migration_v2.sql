-- ═══════════════════════════════════════════════════════════════
--  IAI Platform — Database Migration v2
--  Marketplace: Courses, Documents, Reviews, Purchases, Copyright
-- ═══════════════════════════════════════════════════════════════

-- ── Courses ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id                   TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  creator_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                TEXT NOT NULL,
  slug                 TEXT UNIQUE NOT NULL,
  description          TEXT NOT NULL,
  thumbnail_url        TEXT,
  trailer_url          TEXT,
  category             TEXT,
  level                TEXT DEFAULT 'beginner',  -- beginner|intermediate|advanced
  language             TEXT DEFAULT 'vi',
  -- Monetization
  price                INTEGER DEFAULT 0,         -- VND, 0 = free
  currency             TEXT DEFAULT 'VND',
  -- Content stats
  chapters_count       INTEGER DEFAULT 0,
  total_minutes        INTEGER DEFAULT 0,
  -- AI quality
  ai_quality_score     INTEGER,                   -- 0-100 Claude-rated
  ai_quality_summary   TEXT,
  -- Verification
  fact_verified        INTEGER DEFAULT 0,
  fact_score           INTEGER,
  -- Copyright
  copyright_registered INTEGER DEFAULT 0,
  content_hash         TEXT,
  ipfs_cid             TEXT,
  -- Engagement
  student_count        INTEGER DEFAULT 0,
  rating_avg           REAL DEFAULT 0,
  rating_count         INTEGER DEFAULT 0,
  view_count           INTEGER DEFAULT 0,
  -- Status
  status               TEXT DEFAULT 'draft',      -- draft|published|archived
  created_at           TEXT DEFAULT (datetime('now')),
  published_at         TEXT,
  updated_at           TEXT DEFAULT (datetime('now'))
);

-- ── Course Chapters ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_chapters (
  id               TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  course_id        TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  video_url        TEXT,
  duration_minutes INTEGER DEFAULT 0,
  is_free_preview  INTEGER DEFAULT 0,             -- 1 = watch without purchase
  position         INTEGER NOT NULL,
  content_md       TEXT,                          -- transcript / reading
  created_at       TEXT DEFAULT (datetime('now'))
);

-- ── Documents (PDFs, files, books) ──────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id                   TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  creator_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                TEXT NOT NULL,
  description          TEXT,
  file_url             TEXT NOT NULL,
  file_type            TEXT,                      -- pdf|docx|epub|mp3|mp4|zip
  file_size_kb         INTEGER,
  thumbnail_url        TEXT,
  category             TEXT,
  -- Monetization
  price                INTEGER DEFAULT 0,
  currency             TEXT DEFAULT 'VND',
  -- Quality
  ai_quality_score     INTEGER,
  fact_verified        INTEGER DEFAULT 0,
  fact_score           INTEGER,
  copyright_registered INTEGER DEFAULT 0,
  content_hash         TEXT,
  ipfs_cid             TEXT,
  -- Engagement
  download_count       INTEGER DEFAULT 0,
  rating_avg           REAL DEFAULT 0,
  rating_count         INTEGER DEFAULT 0,
  -- Status
  status               TEXT DEFAULT 'published',
  created_at           TEXT DEFAULT (datetime('now')),
  updated_at           TEXT DEFAULT (datetime('now'))
);

-- ── Reviews (stars for courses, documents, lessons) ──────────────
CREATE TABLE IF NOT EXISTS reviews (
  id                    TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id               TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id             TEXT REFERENCES courses(id) ON DELETE CASCADE,
  document_id           TEXT REFERENCES documents(id) ON DELETE CASCADE,
  lesson_id             TEXT REFERENCES lessons(id) ON DELETE CASCADE,
  rating                INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  title                 TEXT,
  content               TEXT,
  is_verified_purchase  INTEGER DEFAULT 0,
  helpful_count         INTEGER DEFAULT 0,
  created_at            TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, course_id),
  UNIQUE(user_id, document_id),
  UNIQUE(user_id, lesson_id)
);

-- ── Purchases (payment records) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS purchases (
  id             TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id        TEXT NOT NULL REFERENCES users(id),
  course_id      TEXT REFERENCES courses(id),
  document_id    TEXT REFERENCES documents(id),
  amount         INTEGER NOT NULL,               -- VND
  currency       TEXT DEFAULT 'VND',
  payment_method TEXT,                           -- stripe|payos|momo|bank_transfer|free
  payment_ref    TEXT,                           -- external payment ID
  status         TEXT DEFAULT 'pending',         -- pending|completed|refunded|failed
  created_at     TEXT DEFAULT (datetime('now')),
  completed_at   TEXT
);

-- ── Copyright Records (ownership proof) ──────────────────────────
CREATE TABLE IF NOT EXISTS copyright_records (
  id                TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  creator_id        TEXT NOT NULL REFERENCES users(id),
  content_type      TEXT NOT NULL,               -- post|lesson|course|document
  content_id        TEXT NOT NULL,
  content_hash      TEXT NOT NULL,               -- SHA-256 of content
  ipfs_cid          TEXT,
  title             TEXT,
  registration_note TEXT,
  status            TEXT DEFAULT 'registered',   -- registered|disputed|revoked
  created_at        TEXT DEFAULT (datetime('now'))
);

-- ── Copyright Reports (violation claims) ─────────────────────────
CREATE TABLE IF NOT EXISTS copyright_reports (
  id                    TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  reporter_id           TEXT NOT NULL REFERENCES users(id),
  content_type          TEXT NOT NULL,
  content_id            TEXT NOT NULL,
  original_content_id   TEXT,
  description           TEXT NOT NULL,
  evidence_url          TEXT,
  ai_similarity_score   INTEGER,                 -- 0-100
  status                TEXT DEFAULT 'open',     -- open|reviewing|resolved|dismissed
  resolution            TEXT,
  created_at            TEXT DEFAULT (datetime('now'))
);

-- ── Indexes ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_courses_creator   ON courses(creator_id);
CREATE INDEX IF NOT EXISTS idx_courses_status    ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category  ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_price     ON courses(price);
CREATE INDEX IF NOT EXISTS idx_chapters_course   ON course_chapters(course_id, position);
CREATE INDEX IF NOT EXISTS idx_docs_creator      ON documents(creator_id);
CREATE INDEX IF NOT EXISTS idx_docs_status       ON documents(status);
CREATE INDEX IF NOT EXISTS idx_reviews_course    ON reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_doc       ON reviews(document_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user    ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status  ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_copyright_hash    ON copyright_records(content_hash);
CREATE INDEX IF NOT EXISTS idx_copyright_creator ON copyright_records(creator_id);
