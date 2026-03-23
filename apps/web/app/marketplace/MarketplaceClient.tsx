// ═══════════════════════════════════════════════════════════════
//  IAI MarketplaceClient — Kho Tri Thức browser
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { cn } from '@/lib/utils'
import { CourseCard } from '@/components/content/CourseCard'
import { DocumentCard } from '@/components/content/DocumentCard'
import { CATEGORIES } from '@/types/marketplace'
import type { MarketplaceItem, Course, Document } from '@/types/marketplace'

// ── Types ─────────────────────────────────────────────────────
type TypeFilter  = 'all' | 'course' | 'document' | 'free' | 'premium'
type SortOption  = 'newest' | 'popular' | 'top_rated' | 'price_asc'

const TYPE_TABS: { id: TypeFilter; label: string }[] = [
  { id: 'all',      label: 'Tất cả'    },
  { id: 'course',   label: 'Khóa học'  },
  { id: 'document', label: 'Tài liệu'  },
  { id: 'free',     label: 'Miễn phí'  },
  { id: 'premium',  label: 'Premium'   },
]

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'newest',    label: 'Mới nhất'      },
  { id: 'popular',   label: 'Nổi bật'       },
  { id: 'top_rated', label: 'Đánh giá cao'  },
  { id: 'price_asc', label: 'Giá thấp → cao' },
]

const FEATURED_PREMIUM_TRACK = {
  title: 'Scaffolding cho giáo dục chuyên sâu',
  description:
    'Dành cho educator, builder và team đang thiết kế hành trình học AI-first nhưng vẫn giữ được nhịp dẫn dắt, chẩn đoán và rút dần hỗ trợ theo năng lực thật.',
  topics: ['ZPD & chẩn đoán', 'Prompt dẫn dắt', 'Task ladder', 'Đánh giá tiến trình'],
}

// ── Fetcher ───────────────────────────────────────────────────
async function fetcher(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Không thể tải dữ liệu')
  return res.json()
}

// ── Skeletons ─────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="skeleton aspect-video w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-8 w-full rounded-lg" />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full card p-16 text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
        <span className="text-gold text-2xl">✦</span>
      </div>
      <div>
        <h3 className="font-serif text-lg text-white/60 mb-1">Chưa có nội dung nào</h3>
        <p className="text-sm text-white/30">Hãy thử thay đổi bộ lọc hoặc quay lại sau.</p>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export function MarketplaceClient() {
  const [category, setCategory] = useState('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sort, setSort] = useState<SortOption>('newest')

  // Build query string
  const params = new URLSearchParams()
  if (category !== 'all') params.set('category', category)
  if (typeFilter === 'course' || typeFilter === 'document') params.set('type', typeFilter)
  if (typeFilter === 'free') params.set('free', '1')
  if (typeFilter === 'premium') params.set('free', '0')
  if (sort === 'popular') params.set('sort', 'students')
  if (sort === 'top_rated') params.set('sort', 'rating')
  if (sort === 'price_asc') params.set('sort', sort)

  const apiUrl = `/api/v1/marketplace?${params.toString()}`

  const { data, isLoading, error } = useSWR<{ ok: boolean; items: MarketplaceItem[] }>(
    apiUrl,
    fetcher,
    { revalidateOnFocus: false }
  )

  const items = data?.items ?? []
  const focusScaffoldingTrack = () => {
    setCategory('education')
    setTypeFilter('premium')
    setSort('top_rated')
  }

  return (
    <div className="min-h-screen bg-obsidian">

      {/* ── Hero ─── */}
      <section className="relative overflow-hidden border-b border-obsidian-border">
        {/* Background glow */}
        <div className="absolute inset-0 bg-glow-gold opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian-mid/50 to-obsidian pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 py-14 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-gold font-mono text-[10px]">✦ MARKETPLACE</span>
                <span className="badge badge-cyan text-[10px]">AI KIỂM CHỨNG</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight">
                Kho Tri Thức{' '}
                <span className="text-gradient-gold">IAI</span>
              </h1>

              <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-xl">
                Khóa học, tài liệu và chuyên đề premium cho người học muốn đi từ hiểu biết cơ bản
                sang năng lực thiết kế, dẫn dắt và triển khai giáo dục thật.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 mt-8">
                {[
                  { label: 'Khóa học', value: '200+', color: 'text-gold' },
                  { label: 'Tài liệu',  value: '1K+',  color: 'text-jade' },
                  { label: 'Người học', value: '50K+', color: 'text-cyan-iai' },
                  { label: 'Giảng viên', value: '500+', color: 'text-gold-light' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className={cn('font-serif text-2xl font-bold', stat.color)}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/30 font-mono mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gold/20 bg-white/[0.04] p-5 sm:p-6 shadow-gold-sm backdrop-blur-sm">
              <p className="text-[10px] font-mono tracking-[0.24em] text-gold/75">
                CHUYÊN ĐỀ THU PHÍ
              </p>
              <h2 className="font-serif text-2xl text-white mt-2 leading-tight">
                {FEATURED_PREMIUM_TRACK.title}
              </h2>
              <p className="text-sm text-white/50 leading-relaxed mt-3">
                {FEATURED_PREMIUM_TRACK.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {FEATURED_PREMIUM_TRACK.topics.map(topic => (
                  <span
                    key={topic}
                    className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-white/60"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <button onClick={focusScaffoldingTrack} className="btn btn-gold w-full mt-5">
                Xem chuyên đề Scaffolding
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ─── */}
      <section className="sticky top-16 z-30 bg-obsidian/90 backdrop-blur-xl border-b border-obsidian-border">
        <div className="max-w-7xl mx-auto px-4">

          {/* Category row */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                  'border font-mono whitespace-nowrap',
                  category === cat.id
                    ? 'bg-gold/15 border-gold/40 text-gold shadow-gold-sm'
                    : 'border-obsidian-border text-white/40 hover:text-white/70 hover:border-obsidian-muted'
                )}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Type tabs + Sort */}
          <div className="flex items-center justify-between gap-4 pb-3 flex-wrap">
            {/* Type tabs */}
            <div className="flex items-center gap-1">
              {TYPE_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                    typeFilter === tab.id
                      ? 'bg-obsidian-light text-white border border-obsidian-border'
                      : 'text-white/40 hover:text-white/70'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/25 font-mono hidden sm:block">Sắp xếp:</span>
              <div className="flex items-center gap-1">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSort(opt.id)}
                    className={cn(
                      'px-2.5 py-1 rounded text-[11px] font-mono transition-all duration-150 whitespace-nowrap',
                      sort === opt.id
                        ? 'bg-gold/10 text-gold border border-gold/20'
                        : 'text-white/30 hover:text-white/55'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content Grid ─── */}
      <section className="max-w-7xl mx-auto px-4 py-8">

        {/* Result count */}
        {!isLoading && !error && items.length > 0 && (
          <p className="text-xs text-white/30 font-mono mb-5">
            {items.length} kết quả
          </p>
        )}

        {error && (
          <div className="card p-8 text-center text-white/40 text-sm">
            Không thể tải dữ liệu. Vui lòng thử lại.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading
            ? [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
            : items.length === 0
              ? <EmptyState />
              : items.map(item =>
                  item.item_type === 'course'
                    ? <CourseCard key={item.id} course={item as Course} />
                    : <DocumentCard key={item.id} document={item as Document} />
                )
          }
        </div>
      </section>
    </div>
  )
}
