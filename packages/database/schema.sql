-- ═══════════════════════════════════════════════════════════════
--  IAI Platform — Database Schema (Education-First)
--  Intelligence · Artistry · International · iai.one
--  Stack: Cloudflare D1 (SQLite edge)
--  Blockchain-ready: content_hash + ipfs_cid in all core tables
-- ═══════════════════════════════════════════════════════════════

-- ── Users ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  handle          TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  avatar_url      TEXT,
  bio             TEXT,
  location        TEXT,
  website         TEXT,
  -- Trust & reputation
  verified        INTEGER DEFAULT 0,   -- 0=none 1=email 2=id 3=business
  trust_score     INTEGER DEFAULT 50,  -- 0-100
  reputation      INTEGER DEFAULT 0,   -- DAO voting power
  edu_level       TEXT DEFAULT 'learner', -- learner|educator|expert
  ai_score        INTEGER DEFAULT 0,
  -- Web3 (Phase 3)
  wallet_address  TEXT,
  verified_at     TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

-- ── Posts (social feed) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  type            TEXT DEFAULT 'discussion',
  -- discussion | lesson | news | debate | knowledge
  media_urls      TEXT,    -- JSON: [{url, type, key}]
  link_url        TEXT,
  link_meta       TEXT,    -- JSON: {title, description, image}
  -- AI Fact-check
  fact_status     TEXT DEFAULT 'unverified',
  -- unverified | checking | verified | disputed | false | opinion
  fact_score      INTEGER, -- 0-100 truth score
  fact_summary    TEXT,
  -- Blockchain-ready
  content_hash    TEXT,    -- SHA-256 of content
  ipfs_cid        TEXT,    -- IPFS Content ID (Phase 2)
  chain_tx_hash   TEXT,    -- Polygon tx (Phase 3)
  -- Engagement
  view_count      INTEGER DEFAULT 0,
  like_count      INTEGER DEFAULT 0,
  comment_count   INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now'))
);

-- ── Lessons (core education table) ─────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  author_id       TEXT REFERENCES users(id),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  content_md      TEXT NOT NULL,
  summary         TEXT,
  subject         TEXT,
  level           TEXT DEFAULT 'beginner', -- beginner|intermediate|advanced
  language        TEXT DEFAULT 'vi',
  -- AI & Verification
  ai_generated    INTEGER DEFAULT 0, -- 0=human 1=AI 2=collab
  fact_verified   INTEGER DEFAULT 0, -- MUST=1 before publish
  fact_score      INTEGER,           -- 0-100
  sources         TEXT,              -- JSON: [{url, title}]
  key_concepts    TEXT,              -- JSON: string[]
  -- Blockchain-ready
  content_hash    TEXT,              -- SHA-256 (immutable proof)
  ipfs_cid        TEXT,              -- IPFS CID (Phase 2)
  nft_token_id    TEXT,              -- Knowledge NFT (Phase 3)
  chain_tx_hash   TEXT,
  -- Engagement
  view_count      INTEGER DEFAULT 0,
  like_count      INTEGER DEFAULT 0,
  estimated_minutes INTEGER DEFAULT 5,
  status          TEXT DEFAULT 'draft', -- draft|published|archived
  created_at      TEXT DEFAULT (datetime('now')),
  published_at    TEXT
);

-- RULE: Cannot publish lesson without fact verification
CREATE TRIGGER IF NOT EXISTS enforce_fact_before_publish
  BEFORE UPDATE ON lessons
  WHEN NEW.status = 'published' AND NEW.fact_verified = 0
BEGIN
  SELECT RAISE(ABORT, 'BLOCKED: Cannot publish lesson without fact_verified=1');
END;

-- ── Fact-Checks ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fact_checks (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  post_id         TEXT REFERENCES posts(id),
  lesson_id       TEXT REFERENCES lessons(id),
  status          TEXT NOT NULL,   -- verified|disputed|unverified|opinion|false
  truth_score     INTEGER NOT NULL DEFAULT 0,
  summary         TEXT,
  claims          TEXT,            -- JSON: [{text, verdict, confidence, explanation, source_url}]
  sources         TEXT,            -- JSON: string[]
  recommendation  TEXT,
  content_hash    TEXT,
  model_used      TEXT DEFAULT 'claude-sonnet-4-6',
  processing_ms   INTEGER,
  checked_at      TEXT DEFAULT (datetime('now'))
);

-- ── Discussions / Comments ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS discussions (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  post_id         TEXT REFERENCES posts(id),
  lesson_id       TEXT REFERENCES lessons(id),
  parent_id       TEXT REFERENCES discussions(id),  -- thread support
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  argument_type   TEXT DEFAULT 'comment',
  -- comment | support | refute | question
  is_ai_generated INTEGER DEFAULT 0,
  fact_checked    INTEGER DEFAULT 0,
  content_hash    TEXT,
  like_count      INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now'))
);

-- ── Knowledge NFTs (Phase 3) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_nfts (
  token_id        TEXT PRIMARY KEY,
  lesson_id       TEXT NOT NULL REFERENCES lessons(id),
  creator_id      TEXT NOT NULL REFERENCES users(id),
  chain           TEXT DEFAULT 'polygon',   -- polygon|solana
  contract_addr   TEXT,
  metadata_uri    TEXT,                     -- IPFS metadata JSON
  truth_score     INTEGER,
  minted_at       TEXT DEFAULT (datetime('now'))
);

-- ── Reactions / Likes ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reactions (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id         TEXT REFERENCES posts(id),
  lesson_id       TEXT REFERENCES lessons(id),
  type            TEXT DEFAULT 'like',      -- like|bookmark|report
  created_at      TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, post_id, type),
  UNIQUE(user_id, lesson_id, type)
);

-- ── Follows ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  follower_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (follower_id, following_id)
);

-- ── ═══ INDEXES ═════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_posts_user       ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created    ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status     ON posts(fact_status);
CREATE INDEX IF NOT EXISTS idx_posts_type       ON posts(type);
CREATE INDEX IF NOT EXISTS idx_lessons_slug     ON lessons(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_status   ON lessons(status);
CREATE INDEX IF NOT EXISTS idx_lessons_subject  ON lessons(subject);
CREATE INDEX IF NOT EXISTS idx_lessons_level    ON lessons(level);
CREATE INDEX IF NOT EXISTS idx_fact_post        ON fact_checks(post_id);
CREATE INDEX IF NOT EXISTS idx_fact_lesson      ON fact_checks(lesson_id);
CREATE INDEX IF NOT EXISTS idx_disc_post        ON discussions(post_id);
CREATE INDEX IF NOT EXISTS idx_disc_lesson      ON discussions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_disc_parent      ON discussions(parent_id);
