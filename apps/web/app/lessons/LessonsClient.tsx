// ═══════════════════════════════════════════════════════════════
//  IAI LessonsClient — Lessons listing page
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import { LessonCard } from '@/components/lesson/LessonCard'
import type { Lesson } from '@/types'

const SUBJECTS = ['Tất cả', 'Công nghệ', 'Trí tuệ nhân tạo', 'Blockchain', 'Khoa học', 'Lịch sử', 'Xã hội']
const LEVELS   = ['Tất cả', 'beginner', 'intermediate', 'advanced']
const LEVEL_LABELS: Record<string, string> = {
  'Tất cả': 'Tất cả', beginner: 'Cơ bản', intermediate: 'Trung cấp', advanced: 'Nâng cao'
}

function LessonSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex gap-3">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function LessonsClient() {
  const { isAuth, token } = useAuth()
  const [lessons, setLessons]     = useState<Lesson[]>([])
  const [loading, setLoading]     = useState(true)
  const [subject, setSubject]     = useState('Tất cả')
  const [level, setLevel]         = useState('Tất cả')
  const [generating, setGenerating] = useState(false)
  const [genTopic, setGenTopic]     = useState('')
  const [genError, setGenError]     = useState('')
  const [showGenModal, setShowGenModal] = useState(false)

  useEffect(() => {
    loadLessons()
  }, [subject, level]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadLessons() {
    setLoading(true)
    try {
      const res = await api.lessons.list({
        subject: subject === 'Tất cả' ? undefined : subject,
        level:   level   === 'Tất cả' ? undefined : level,
        limit: 20,
      }) as { ok: boolean; lessons: Lesson[] }
      if (res.ok) setLessons(res.lessons)
    } catch {
      // API not ready
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    if (!genTopic.trim() || !token) return
    setGenerating(true)
    setGenError('')
    try {
      const res = await api.lessons.generate(
        { topic: genTopic, level: 'beginner', language: 'vi' },
        token
      ) as { ok: boolean; error?: string; lesson?: Lesson }
      if (!res.ok) { setGenError(res.error ?? 'Lỗi'); return }
      setShowGenModal(false)
      setGenTopic('')
      loadLessons()
    } catch {
      setGenError('Không thể tạo bài học. Vui lòng thử lại.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ── Header ─── */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-gold font-mono text-[10px]">✦ EDUCATION LAYER</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white mb-2">
              Kho Bài Học
            </h1>
            <p className="text-sm text-white/45 max-w-lg">
              Bài học được AI kiểm chứng, với nguồn dẫn minh bạch. Từ cộng đồng, cho cộng đồng.
            </p>
          </div>
          {isAuth && (
            <button
              onClick={() => setShowGenModal(true)}
              className="btn btn-gold shrink-0"
            >
              <span>✦</span>
              AI Tạo Bài Học
            </button>
          )}
        </div>
      </div>

      {/* ── Filters ─── */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Subject */}
        <div className="flex flex-wrap gap-1.5">
          {SUBJECTS.map(s => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                subject === s
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'text-white/40 hover:text-white/70 border border-obsidian-border'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="w-px bg-obsidian-border self-stretch hidden sm:block" />

        {/* Level */}
        <div className="flex gap-1.5">
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                level === l
                  ? 'bg-obsidian-light text-white border border-obsidian-border'
                  : 'text-white/40 hover:text-white/70 border border-transparent'
              }`}
            >
              {LEVEL_LABELS[l] ?? l}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ─── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <LessonSkeleton key={i} />)}
        </div>
      ) : lessons.length === 0 ? (
        <EmptyLessons />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {lessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}

      {/* ── AI Generate Modal ─── */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md p-6 animate-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                <span className="text-gold text-sm">✦</span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-white">IAI Mind</h3>
                <p className="text-xs text-white/40">AI tạo bài học tự động</p>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="ml-auto text-white/40 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="input-wrapper">
                <label>Chủ đề bài học</label>
                <input
                  value={genTopic}
                  onChange={e => setGenTopic(e.target.value)}
                  placeholder="VD: Blockchain trong giáo dục, AI là gì..."
                  onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                />
              </div>

              <p className="text-xs text-white/35 leading-relaxed">
                IAI Mind sẽ tạo bài học với nguồn dẫn, fact-check tự động, và lưu vào kho bài học sau khi kiểm chứng đạt ≥70/100.
              </p>

              {genError && (
                <p className="text-xs text-red-400 font-mono">{genError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowGenModal(false)}
                  className="btn btn-outline flex-1"
                >
                  Hủy
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!genTopic.trim() || generating}
                  className="btn btn-gold flex-1"
                >
                  {generating ? (
                    <span className="flex items-center gap-2">
                      <span className="spinner w-4 h-4" />
                      Đang tạo…
                    </span>
                  ) : '✦ Tạo bài học'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyLessons() {
  return (
    <div className="card p-12 text-center">
      <div className="text-4xl mb-4">✦</div>
      <h3 className="font-serif text-lg text-white/60 mb-2">Chưa có bài học nào</h3>
      <p className="text-sm text-white/35 mb-6">Hãy là người đầu tiên tạo bài học với IAI Mind!</p>
      <Link href="/register" className="btn btn-gold">
        Tham gia và tạo bài học
      </Link>
    </div>
  )
}
