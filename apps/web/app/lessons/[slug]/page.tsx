// ═══════════════════════════════════════════════════════════════
//  IAI Lesson Detail Page
// ═══════════════════════════════════════════════════════════════

export const runtime = 'edge'

import type { Metadata } from 'next'
import { LessonDetail } from './LessonDetail'
import { absoluteUrl, excerpt, fetchSeoJson, jsonLd, pageMetadata } from '@/lib/seo'

type Props = { params: { slug: string } }
type LessonPayload = {
  title: string
  slug: string
  summary?: string
  content_md?: string
  subject?: string
  level?: string
  handle?: string
  name?: string
  published_at?: string
  created_at?: string
  fact_verified?: number
  fact_score?: number
}
type LessonResponse = { ok: boolean; lesson?: LessonPayload }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchSeoJson<LessonResponse>(`/v1/lessons/${params.slug}`)
  const lesson = data?.lesson

  if (!lesson) {
    return pageMetadata({
      title: 'Bài học — IAI',
      description: 'Bài học được AI kiểm chứng trên IAI.',
      path: `/lessons/${params.slug}`,
      type: 'article',
    })
  }

  return pageMetadata({
    title: `${lesson.title} — IAI`,
    description: excerpt(lesson.summary || lesson.content_md, 160),
    path: `/lessons/${lesson.slug}`,
    type: 'article',
    keywords: [lesson.subject, lesson.level, lesson.handle, lesson.fact_verified ? 'fact verified' : 'pending fact-check'],
    publishedTime: lesson.published_at ?? lesson.created_at,
    modifiedTime: lesson.published_at ?? lesson.created_at,
    authors: [lesson.name || `@${lesson.handle ?? 'iai'}`],
    section: lesson.subject || 'Lessons',
    tags: [lesson.subject ?? 'lesson', lesson.level ?? 'all-levels'],
  })
}

export default async function LessonDetailPage({ params }: Props) {
  const data = await fetchSeoJson<LessonResponse>(`/v1/lessons/${params.slug}`)
  const lesson = data?.lesson

  const lessonJsonLd = lesson
    ? {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: lesson.title,
        description: excerpt(lesson.summary || lesson.content_md, 160),
        educationalLevel: lesson.level,
        learningResourceType: lesson.subject || 'Lesson',
        datePublished: lesson.published_at ?? lesson.created_at,
        url: absoluteUrl(`/lessons/${lesson.slug}`),
        author: {
          '@type': 'Person',
          name: lesson.name || `@${lesson.handle ?? 'iai'}`,
          url: lesson.handle ? absoluteUrl(`/u/${lesson.handle}`) : undefined,
        },
        publisher: {
          '@type': 'Organization',
          name: 'IAI',
          url: absoluteUrl('/'),
        },
      }
    : null

  return (
    <>
      {lessonJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(lessonJsonLd) }}
        />
      )}
      <LessonDetail slug={params.slug} />
    </>
  )
}
