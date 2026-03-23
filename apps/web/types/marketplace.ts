// ═══════════════════════════════════════════════════════════════
//  IAI Marketplace — TypeScript Types
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published' | 'archived' | 'review'
export type DocumentStatus = 'draft' | 'published' | 'archived'
export type PurchaseStatus = 'pending' | 'completed' | 'refunded' | 'failed'
export type CopyrightStatus = 'pending' | 'registered' | 'disputed' | 'revoked'
export type FileType = 'pdf' | 'video' | 'audio' | 'zip' | 'epub' | 'doc' | 'ppt' | 'other'

// ── Course ────────────────────────────────────────────────────
export type Course = {
  item_type:            'course'
  id:                   string
  creator_id:           string
  handle:               string
  name:                 string
  avatar_url?:          string
  title:                string
  slug:                 string
  description:          string
  thumbnail_url?:       string
  trailer_url?:         string
  category:             string
  level:                CourseLevel
  language:             string
  price:                number
  currency:             string
  chapters_count:       number
  total_minutes:        number
  ai_quality_score?:    number
  fact_verified:        number   // 0 = no, 1 = yes
  fact_score?:          number
  copyright_registered: number   // 0 = no, 1 = yes
  student_count:        number
  rating_avg:           number
  rating_count:         number
  view_count:           number
  status:               CourseStatus
  created_at:           string
  published_at?:        string
}

// ── Course Chapter ────────────────────────────────────────────
export type CourseChapter = {
  id:               string
  course_id:        string
  title:            string
  description?:     string
  video_url?:       string
  duration_minutes: number
  is_free_preview:  boolean
  position:         number
  content_md?:      string
}

// ── Document ──────────────────────────────────────────────────
export type Document = {
  item_type:            'document'
  id:                   string
  creator_id:           string
  handle:               string
  name:                 string
  avatar_url?:          string
  title:                string
  description:          string
  file_url:             string
  file_type:            FileType
  file_size_kb:         number
  thumbnail_url?:       string
  category:             string
  price:                number
  currency:             string
  fact_verified:        number
  ai_quality_score?:    number
  copyright_registered: number
  download_count:       number
  rating_avg:           number
  rating_count:         number
  status:               DocumentStatus
  created_at:           string
}

// ── Review ────────────────────────────────────────────────────
export type Review = {
  id:                   string
  user_id:              string
  handle:               string
  name:                 string
  avatar_url?:          string
  course_id?:           string
  document_id?:         string
  lesson_id?:           string
  rating:               number   // 1–5
  title?:               string
  content?:             string
  is_verified_purchase: boolean
  helpful_count:        number
  created_at:           string
}

// ── Purchase ──────────────────────────────────────────────────
export type Purchase = {
  id:             string
  user_id:        string
  course_id?:     string
  document_id?:   string
  amount:         number
  currency:       string
  payment_method?: string
  status:         PurchaseStatus
  created_at:     string
}

// ── Copyright Record ──────────────────────────────────────────
export type CopyrightRecord = {
  id:           string
  creator_id:   string
  content_type: 'course' | 'document' | 'lesson' | 'post'
  content_id:   string
  content_hash: string
  ipfs_cid?:    string
  title?:       string
  status:       CopyrightStatus
  created_at:   string
}

// ── Union type with discriminator ─────────────────────────────
export type MarketplaceItem = Course | Document

// ── Category Config ───────────────────────────────────────────
export type CategoryConfig = {
  id:    string
  label: string
  icon:  string
  color: string
}

// ── Categories ────────────────────────────────────────────────
export const CATEGORIES: CategoryConfig[] = [
  { id: 'all',          label: 'Tất cả',        icon: '✦',  color: 'text-gold' },
  { id: 'technology',   label: 'Công nghệ',      icon: '💻', color: 'text-cyan-iai' },
  { id: 'business',     label: 'Kinh doanh',     icon: '📈', color: 'text-jade' },
  { id: 'art',          label: 'Nghệ thuật',     icon: '🎨', color: 'text-purple-400' },
  { id: 'science',      label: 'Khoa học',       icon: '🔬', color: 'text-blue-400' },
  { id: 'education',    label: 'Giáo dục',       icon: '🧩', color: 'text-cyan-200' },
  { id: 'language',     label: 'Ngôn ngữ',       icon: '🌐', color: 'text-amber-400' },
  { id: 'personal_dev', label: 'Phát triển bản thân', icon: '🧠', color: 'text-gold-light' },
  { id: 'finance',      label: 'Tài chính',      icon: '💰', color: 'text-jade-light' },
  { id: 'health',       label: 'Sức khỏe',       icon: '🌿', color: 'text-green-400' },
]

// ── Levels ────────────────────────────────────────────────────
export const LEVELS: { id: CourseLevel | 'all'; label: string; color: string }[] = [
  { id: 'all',          label: 'Tất cả',   color: 'text-white/60' },
  { id: 'beginner',     label: 'Cơ bản',   color: 'text-jade' },
  { id: 'intermediate', label: 'Trung cấp', color: 'text-gold' },
  { id: 'advanced',     label: 'Nâng cao', color: 'text-red-400' },
]
