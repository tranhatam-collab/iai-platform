// ═══════════════════════════════════════════════════════════════
//  IAI CoursePlayer — Course detail + chapter player
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { cn, formatCount, getLevelLabel, getLevelColor, getFactScoreBg, timeAgo } from '@/lib/utils'
import { StarRating } from '@/components/ui/StarRating'
import { PriceTag } from '@/components/ui/PriceTag'
import type { Course, CourseChapter, Review } from '@/types/marketplace'

type Props = { slug: string }

type CourseDetailResponse = {
  ok:       boolean
  course:   Course
  chapters: CourseChapter[]
  reviews:  Review[]
  purchased: boolean
}

type Tab = 'overview' | 'curriculum' | 'reviews' | 'discussion'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',    label: 'Tổng quan'    },
  { id: 'curriculum',  label: 'Chương trình' },
  { id: 'reviews',     label: 'Đánh giá'     },
  { id: 'discussion',  label: 'Thảo luận'    },
]

async function fetcher(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Không thể tải khóa học')
  return res.json()
}

// ── Skeleton ──────────────────────────────────────────────────
function CourseSkeleton() {
  return (
    <div className="min-h-screen bg-obsidian animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="skeleton aspect-video rounded-2xl" />
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Chapter List ──────────────────────────────────────────────
function ChapterList({
  chapters,
  current,
  onSelect,
  purchased,
}: {
  chapters: CourseChapter[]
  current:  number
  onSelect: (i: number) => void
  purchased: boolean
}) {
  const totalMinutes = chapters.reduce((s, c) => s + c.duration_minutes, 0)

  return (
    <aside className="flex flex-col bg-obsidian-mid border border-obsidian-border rounded-2xl overflow-hidden lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-obsidian-border">
        <h2 className="font-serif text-sm text-white">Chương trình học</h2>
        <p className="text-[11px] text-white/35 font-mono mt-0.5">
          {chapters.length} chương · {totalMinutes} phút
        </p>
      </div>

      {/* Chapter list */}
      <div className="overflow-y-auto flex-1 py-2">
        {chapters.map((chapter, i) => {
          const locked = !chapter.is_free_preview && !purchased
          const isCurrent = i === current

          return (
            <button
              key={chapter.id}
              onClick={() => !locked && onSelect(i)}
              disabled={locked}
              className={cn(
                'w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-150',
                isCurrent
                  ? 'bg-gold/10 border-r-2 border-gold'
                  : 'hover:bg-obsidian-light',
                locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              )}
            >
              {/* Chapter number / lock */}
              <div className={cn(
                'w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-mono font-bold mt-0.5',
                isCurrent
                  ? 'bg-gold text-obsidian'
                  : 'bg-obsidian-border text-white/40'
              )}>
                {locked ? '🔒' : String(i + 1).padStart(2, '0')}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-xs font-medium leading-snug line-clamp-2',
                  isCurrent ? 'text-gold' : 'text-white/75'
                )}>
                  {chapter.title}
                </p>
                <p className="text-[10px] text-white/30 font-mono mt-0.5">
                  {chapter.duration_minutes} phút
                  {chapter.is_free_preview && (
                    <span className="ml-2 text-jade-light">· Xem thử</span>
                  )}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

// ── Rating Distribution ───────────────────────────────────────
function RatingDistribution({ reviews }: { reviews: Review[] }) {
  const total = reviews.length
  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.floor(r.rating) === star).length,
    pct:   total > 0 ? (reviews.filter(r => Math.floor(r.rating) === star).length / total) * 100 : 0,
  }))

  return (
    <div className="space-y-2">
      {dist.map(({ star, count, pct }) => (
        <div key={star} className="flex items-center gap-3">
          <span className="text-xs text-white/50 font-mono w-6 text-right">{star}</span>
          <span className="text-gold text-xs">★</span>
          <div className="flex-1 h-2 bg-obsidian-light rounded-full overflow-hidden">
            <div
              className="h-full bg-gold/70 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] text-white/30 font-mono w-7">{count}</span>
        </div>
      ))}
    </div>
  )
}

// ── Review Card ───────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-3">
        {review.avatar_url ? (
          <Image src={review.avatar_url} alt={review.name} width={36} height={36} className="rounded-full" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-gold font-bold text-sm">{review.name.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{review.name}</span>
            {review.is_verified_purchase && (
              <span className="badge-verified text-[10px]">✓ Đã mua</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-[10px] text-white/30 font-mono">{timeAgo(review.created_at)}</span>
          </div>
        </div>
      </div>
      {review.title && (
        <p className="text-sm font-medium text-white">{review.title}</p>
      )}
      {review.content && (
        <p className="text-sm text-white/55 leading-relaxed">{review.content}</p>
      )}
      {review.helpful_count > 0 && (
        <p className="text-[10px] text-white/25 font-mono">
          {review.helpful_count} người thấy hữu ích
        </p>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export function CoursePlayer({ slug }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [activeChapter, setActiveChapter] = useState(0)

  const { data, isLoading, error } = useSWR<CourseDetailResponse>(
    `/api/v1/courses/${slug}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  if (isLoading) return <CourseSkeleton />

  if (error || !data?.ok || !data.course) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center p-8">
        <div className="card p-12 text-center max-w-md">
          <div className="text-4xl mb-4">✦</div>
          <h2 className="font-serif text-lg text-white/60 mb-2">Không tìm thấy khóa học</h2>
          <p className="text-sm text-white/35 mb-6">
            Khóa học này không tồn tại hoặc đã bị gỡ xuống.
          </p>
          <Link href="/marketplace" className="btn btn-gold">
            Quay lại Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const { course, chapters, reviews, purchased } = data
  const currentChapter = chapters[activeChapter]
  const levelColor = getLevelColor(course.level)
  const canWatch = currentChapter?.is_free_preview || purchased

  return (
    <div className="min-h-screen bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Breadcrumb ─── */}
        <nav className="flex items-center gap-2 text-xs text-white/35 font-mono mb-6">
          <Link href="/marketplace" className="hover:text-gold transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-white/50">{course.title}</span>
        </nav>

        {/* ── Main layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

          {/* ── Left: Chapter List ─── */}
          {chapters.length > 0 && (
            <ChapterList
              chapters={chapters}
              current={activeChapter}
              onSelect={setActiveChapter}
              purchased={purchased}
            />
          )}

          {/* ── Right: Video + Info ─── */}
          <div className="space-y-6 min-w-0">

            {/* Video player area */}
            <div className={cn(
              'relative rounded-2xl overflow-hidden bg-obsidian-mid border border-obsidian-border',
              'aspect-video'
            )}>
              {canWatch && currentChapter?.video_url ? (
                <iframe
                  src={currentChapter.video_url}
                  title={currentChapter.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : canWatch && !currentChapter?.video_url ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <span className="text-gold text-2xl">▶</span>
                  </div>
                  <p className="text-sm text-white/40">
                    {currentChapter ? currentChapter.title : 'Chọn chương để bắt đầu học'}
                  </p>
                </div>
              ) : (
                /* Locked state */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-obsidian/80">
                  {course.thumbnail_url && (
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover opacity-20"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-obsidian-mid border border-obsidian-border flex items-center justify-center text-2xl">
                      🔒
                    </div>
                    <p className="text-sm text-white/60 text-center px-4">
                      Mua khóa học để xem nội dung này
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Current chapter title */}
            {currentChapter && (
              <div>
                <h1 className="font-serif text-xl sm:text-2xl text-white leading-snug">
                  {currentChapter.title}
                </h1>
                {currentChapter.description && (
                  <p className="text-sm text-white/45 mt-1">{currentChapter.description}</p>
                )}
              </div>
            )}

            {/* ── Tabs ─── */}
            <div className="tab-nav">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(activeTab === tab.id && 'active')}
                >
                  {tab.label}
                  {tab.id === 'reviews' && reviews.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-mono">
                      {reviews.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Tab Content ─── */}
            <div className="animate-in">

              {/* Overview tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Course title + meta */}
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-white mb-3">{course.title}</h2>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={cn('badge badge-unverified', levelColor)}>
                        {getLevelLabel(course.level)}
                      </span>
                      <span className="badge badge-unverified text-xs">{course.language}</span>
                      <span className="badge badge-unverified text-xs">
                        {course.chapters_count} chương · {course.total_minutes} phút
                      </span>
                      {course.fact_verified === 1 && (
                        <span className="badge-verified">✓ Đã kiểm chứng</span>
                      )}
                      {course.copyright_registered === 1 && (
                        <span className="badge badge-gold">⛓ Bản quyền on-chain</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                      <StarRating rating={course.rating_avg} count={course.rating_count} size="md" />
                      <span className="font-mono">{formatCount(course.student_count)} học viên</span>
                      <span className="font-mono">{formatCount(course.view_count)} lượt xem</span>
                    </div>
                  </div>

                  {/* AI Quality + Fact Score */}
                  {(course.ai_quality_score !== undefined || course.fact_score !== undefined) && (
                    <div className="grid grid-cols-2 gap-3">
                      {course.ai_quality_score !== undefined && (
                        <div className="card p-4">
                          <p className="text-[11px] text-white/30 font-mono mb-2">✦ AI QUALITY SCORE</p>
                          <div className="flex items-baseline gap-1">
                            <span className={cn(
                              'text-2xl font-bold font-mono',
                              course.ai_quality_score >= 80 ? 'text-jade' : course.ai_quality_score >= 60 ? 'text-gold' : 'text-red-400'
                            )}>
                              {course.ai_quality_score}
                            </span>
                            <span className="text-white/30 font-mono text-sm">/100</span>
                          </div>
                          <div className="mt-2 h-1.5 bg-obsidian-light rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                course.ai_quality_score >= 80 ? 'bg-jade' : course.ai_quality_score >= 60 ? 'bg-gold' : 'bg-red-400'
                              )}
                              style={{ width: `${course.ai_quality_score}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {course.fact_score !== undefined && (
                        <div className="card p-4">
                          <p className="text-[11px] text-white/30 font-mono mb-2">FACT SCORE</p>
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm text-white',
                              getFactScoreBg(course.fact_score)
                            )}>
                              {course.fact_score}
                            </div>
                            <span className="text-xs text-white/40">
                              {course.fact_score >= 90
                                ? 'Rất đáng tin cậy'
                                : course.fact_score >= 70
                                  ? 'Đáng tin cậy'
                                  : 'Cần xem xét'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div className="card p-5">
                    <h3 className="font-serif text-base text-white mb-3">Mô tả khóa học</h3>
                    <div className="prose-iai text-sm">
                      {course.description}
                    </div>
                  </div>

                  {/* Creator card */}
                  <div className="card p-5">
                    <h3 className="font-serif text-base text-white mb-4">Giảng viên</h3>
                    <div className="flex items-center gap-3">
                      {course.avatar_url ? (
                        <Image
                          src={course.avatar_url}
                          alt={course.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                          <span className="text-gold font-bold text-lg">{course.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/u/${course.handle}`}
                          className="font-medium text-white hover:text-gold transition-colors"
                        >
                          {course.name}
                        </Link>
                        <p className="text-xs text-white/35 font-mono">@{course.handle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Curriculum tab */}
              {activeTab === 'curriculum' && (
                <div className="space-y-3">
                  <p className="text-sm text-white/40">
                    {chapters.length} chương · {chapters.reduce((s, c) => s + c.duration_minutes, 0)} phút tổng
                  </p>
                  {chapters.map((chapter, i) => {
                    const locked = !chapter.is_free_preview && !purchased
                    return (
                      <div
                        key={chapter.id}
                        className={cn(
                          'card p-4 flex items-start gap-3',
                          !locked && 'cursor-pointer hover:border-gold/20 transition-colors',
                          i === activeChapter && 'border-gold/30 bg-gold/5'
                        )}
                        onClick={() => !locked && setActiveChapter(i)}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0',
                          i === activeChapter ? 'bg-gold text-obsidian' : 'bg-obsidian-muted text-white/40'
                        )}>
                          {locked ? '🔒' : `${i + 1}`}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-sm font-medium',
                            locked ? 'text-white/35' : 'text-white'
                          )}>
                            {chapter.title}
                          </p>
                          {chapter.description && (
                            <p className="text-xs text-white/35 mt-0.5 line-clamp-1">{chapter.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-white/25 font-mono">
                            <span>⏱ {chapter.duration_minutes} phút</span>
                            {chapter.is_free_preview && (
                              <span className="text-jade-light">▶ Xem thử miễn phí</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Reviews tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    <>
                      {/* Summary */}
                      <div className="card p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="font-serif text-5xl text-gold font-bold">
                            {course.rating_avg.toFixed(1)}
                          </span>
                          <StarRating rating={course.rating_avg} size="lg" />
                          <span className="text-xs text-white/35 font-mono">
                            {course.rating_count} đánh giá
                          </span>
                        </div>
                        <RatingDistribution reviews={reviews} />
                      </div>

                      {/* Review list */}
                      <div className="space-y-3">
                        {reviews.map(review => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="card p-12 text-center">
                      <p className="text-white/35">Chưa có đánh giá nào.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Discussion tab */}
              {activeTab === 'discussion' && (
                <div className="card p-12 text-center">
                  <div className="text-3xl mb-3">💬</div>
                  <p className="text-white/35 text-sm">
                    Tính năng thảo luận đang được phát triển.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Buy Bar (mobile) ─── */}
      {!purchased && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-obsidian/95 backdrop-blur-xl border-t border-obsidian-border px-4 py-3">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="flex-1">
              <PriceTag price={course.price} currency={course.currency} size="lg" />
            </div>
            <button
              className={cn(
                'btn shrink-0 px-6',
                course.price === 0 ? 'bg-jade text-white hover:bg-jade-light' : 'btn-gold'
              )}
            >
              {course.price === 0 ? '▶ Học ngay miễn phí' : '🛒 Mua khóa học'}
            </button>
          </div>
        </div>
      )}

      {/* ── Sticky Buy Bar (desktop sidebar) ─── */}
      {!purchased && (
        <div className="hidden lg:block fixed right-6 top-24 z-40 w-72">
          <div className="card p-5 shadow-gold-sm space-y-4">
            {course.thumbnail_url && (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={course.thumbnail_url}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>
            )}
            <div>
              <PriceTag price={course.price} currency={course.currency} size="lg" />
              {course.price > 0 && (
                <p className="text-xs text-white/30 font-mono mt-0.5">Trả một lần, học mãi mãi</p>
              )}
            </div>
            <button
              className={cn(
                'btn w-full btn-lg',
                course.price === 0 ? 'bg-jade text-white hover:bg-jade-light' : 'btn-gold'
              )}
            >
              {course.price === 0 ? '▶ Học ngay miễn phí' : '🛒 Mua khóa học'}
            </button>
            <div className="text-[10px] text-white/25 font-mono text-center">
              Hoàn tiền 7 ngày nếu không hài lòng
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
