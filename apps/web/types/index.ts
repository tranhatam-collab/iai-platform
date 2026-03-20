// ═══════════════════════════════════════════════════════════════
//  IAI Web — Shared TypeScript Types
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

export type FactStatus = 'verified' | 'disputed' | 'unverified' | 'opinion' | 'false' | 'checking'

export type PostType = 'discussion' | 'lesson' | 'news' | 'debate' | 'knowledge'

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced'

export type EduLevel = 'learner' | 'educator' | 'expert'

// ── User ────────────────────────────────────────────────────────
export type User = {
  id:              string
  handle:          string
  name:            string
  email:           string
  avatar_url?:     string
  bio?:            string
  location?:       string
  website?:        string
  verified:        number   // 0-3
  trust_score:     number   // 0-100
  reputation:      number
  edu_level:       EduLevel
  wallet_address?: string
  created_at:      string
}

// ── Post ────────────────────────────────────────────────────────
export type Post = {
  id:             string
  user_id:        string
  handle:         string
  name:           string
  avatar_url?:    string
  trust_score:    number
  content:        string
  type:           PostType
  media_urls?:    string
  link_url?:      string
  link_meta?:     string
  fact_status:    FactStatus
  fact_score?:    number
  fact_summary?:  string
  content_hash?:  string
  ipfs_cid?:      string
  chain_tx_hash?: string
  view_count:     number
  like_count:     number
  comment_count:  number
  created_at:     string
}

// ── Lesson ──────────────────────────────────────────────────────
export type Lesson = {
  id:                string
  author_id?:        string
  handle?:           string
  name?:             string
  title:             string
  slug:              string
  content_md:        string
  summary?:          string
  subject?:          string
  level:             LessonLevel
  language:          string
  ai_generated:      number  // 0=human 1=AI 2=collab
  fact_verified:     number
  fact_score?:       number
  sources?:          string  // JSON
  key_concepts?:     string  // JSON
  content_hash?:     string
  ipfs_cid?:         string
  nft_token_id?:     string
  view_count:        number
  like_count:        number
  estimated_minutes: number
  status:            'draft' | 'published' | 'archived'
  created_at:        string
  published_at?:     string
}

// ── Fact Check ──────────────────────────────────────────────────
export type Claim = {
  text:        string
  verdict:     'true' | 'false' | 'unclear' | 'opinion'
  confidence:  number
  explanation: string
  source_url?: string
}

export type FactCheckResult = {
  status:          FactStatus
  truth_score:     number
  summary:         string
  claims:          Claim[]
  sources:         string[]
  recommendation?: string
  processing_ms:   number
  model_used:      string
}

// ── API Responses ────────────────────────────────────────────────
export type ApiOk<T> = { ok: true; data?: T } & Partial<T>
export type ApiErr   = { ok: false; error: string; code?: string }
export type ApiRes<T> = ApiOk<T> | ApiErr

export type AuthResponse = {
  ok:    boolean
  token: string
  user:  User
}

export type PostsResponse = {
  ok:     boolean
  posts:  Post[]
  cursor: string | null
}

export type LessonsResponse = {
  ok:      boolean
  lessons: Lesson[]
}

// ── Feed Tab ─────────────────────────────────────────────────────
export type FeedTab = 'hot' | 'verified' | 'lesson' | 'debate' | 'chain'
