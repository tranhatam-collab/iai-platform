// ═══════════════════════════════════════════════════════════════
//  IAI Platform — Type Definitions
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

export type Bindings = {
  // Cloudflare bindings
  DB:       D1Database
  CACHE:    KVNamespace
  SESSIONS: KVNamespace
  MEDIA:    R2Bucket

  // Environment vars
  IAI_ENV:              string
  ALLOWED_ORIGINS:      string
  N8N_BASE_URL:         string
  SELF_URL:             string

  // Secrets (set via wrangler secret put)
  ANTHROPIC_API_KEY:     string
  JWT_SECRET:            string
  N8N_WEBHOOK_SECRET:    string
  IAI_ADMIN_SECRET:      string
  APP_URL:               string

  // Email — self-hosted IAI Mail API (primary) or Resend (fallback)
  MAIL_API_URL?:         string   // e.g. https://mail.iai.one/_mail
  MAIL_API_KEY?:         string   // secret key for IAI Mail API
  RESEND_API_KEY?:       string   // fallback if self-hosted not ready

  // Social OAuth (set via wrangler secret put)
  GOOGLE_CLIENT_ID?:     string
  GOOGLE_CLIENT_SECRET?: string
  FACEBOOK_APP_ID?:      string
  FACEBOOK_APP_SECRET?:  string
  X_CLIENT_ID?:          string
  X_CLIENT_SECRET?:      string

  // Stripe (set via wrangler secret put)
  STRIPE_SECRET_KEY?:    string
  STRIPE_WEBHOOK_SECRET?: string
  STRIPE_PUB_KEY?:       string

  // Phase 3 Web3 (optional)
  PINATA_JWT?:           string
  POLYGON_RPC_URL?:      string
  POLYGON_PRIVATE_KEY?:  string
  IAI_CONTRACT_ADDRESS?: string
}

// ── Fact-Check ───────────────────────────────────────────────

export type FactStatus = 'verified' | 'disputed' | 'unverified' | 'opinion' | 'false'

export type ClaimVerdict = 'true' | 'false' | 'unclear' | 'opinion'

export type Claim = {
  text:        string
  verdict:     ClaimVerdict
  confidence:  number      // 0-100
  explanation: string
  source_url?: string
}

export type FactCheckResult = {
  status:          FactStatus
  truth_score:     number        // 0-100
  summary:         string
  claims:          Claim[]
  sources:         string[]
  recommendation?: string
  processing_ms:   number
  model_used:      string
}

// ── Auth ─────────────────────────────────────────────────────

export type JWTPayload = {
  sub:   string   // user id
  hdl:   string   // handle
  iat:   number
  exp:   number
}

export type AuthUser = {
  id:          string
  handle:      string
  name:        string
  email:       string
  trust_score: number
  edu_level:   string
}

// ── Post ─────────────────────────────────────────────────────

export type PostType = 'discussion' | 'lesson' | 'news' | 'debate' | 'knowledge'

export type Post = {
  id:           string
  user_id:      string
  content:      string
  type:         PostType
  media_urls?:  string[]
  link_url?:    string
  fact_status:  FactStatus
  fact_score?:  number
  content_hash?: string
  ipfs_cid?:    string
  chain_tx_hash?: string
  view_count:   number
  like_count:   number
  comment_count: number
  created_at:   string
}

// ── Lesson ───────────────────────────────────────────────────

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced'

export type Lesson = {
  id:           string
  author_id?:   string
  title:        string
  slug:         string
  content_md:   string
  summary?:     string
  subject?:     string
  level:        LessonLevel
  language:     string
  ai_generated: boolean
  fact_verified: boolean
  fact_score?:  number
  sources?:     string[]
  key_concepts?: string[]
  content_hash?: string
  ipfs_cid?:    string
  nft_token_id?: string
  view_count:   number
  like_count:   number
  status:       'draft' | 'published' | 'archived'
  created_at:   string
  published_at?: string
}

// ── API Response ─────────────────────────────────────────────

export type ApiOk<T>  = { ok: true;  data: T }
export type ApiErr    = { ok: false; error: string; code?: string }
export type ApiRes<T> = ApiOk<T> | ApiErr

export function ok<T>(data: T): ApiOk<T>    { return { ok: true, data } }
export function err(msg: string, code?: string): ApiErr { return { ok: false, error: msg, code } }
