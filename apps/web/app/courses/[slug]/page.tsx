// ═══════════════════════════════════════════════════════════════
//  IAI Course Detail Page
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { CoursePlayer } from './CoursePlayer'
import { absoluteUrl, excerpt, fetchSeoJson, jsonLd, pageMetadata } from '@/lib/seo'

export const runtime = 'edge'

type Props = {
  params: { slug: string }
}
type CoursePayload = {
  id: string
  slug: string
  title: string
  description?: string
  category?: string
  level?: string
  price?: number
  currency?: string
  handle?: string
  name?: string
  published_at?: string
  updated_at?: string
  created_at?: string
}
type CourseResponse = { ok: boolean; course?: CoursePayload }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchSeoJson<CourseResponse>(`/v1/courses/${params.slug}`)
  const course = data?.course

  if (!course) {
    return pageMetadata({
      title: 'Khóa học — IAI',
      description: 'Xem chi tiết khóa học và đăng ký học trên IAI Marketplace.',
      path: `/courses/${params.slug}`,
    })
  }

  return pageMetadata({
    title: `${course.title} — IAI`,
    description: excerpt(course.description, 160),
    path: `/courses/${course.slug}`,
    keywords: [course.category, course.level, course.handle, course.price === 0 ? 'free course' : 'premium course'],
    publishedTime: course.published_at ?? course.created_at,
    modifiedTime: course.updated_at ?? course.published_at ?? course.created_at,
    authors: [course.name || `@${course.handle ?? 'iai'}`],
    section: 'Marketplace',
    tags: [course.category ?? 'course', course.level ?? 'all-levels'],
  })
}

export default async function CoursePage({ params }: Props) {
  const data = await fetchSeoJson<CourseResponse>(`/v1/courses/${params.slug}`)
  const course = data?.course

  const courseJsonLd = course
    ? {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: excerpt(course.description, 160),
        provider: {
          '@type': 'Organization',
          name: 'IAI',
          url: absoluteUrl('/'),
        },
        instructor: {
          '@type': 'Person',
          name: course.name || `@${course.handle ?? 'iai'}`,
          url: course.handle ? absoluteUrl(`/u/${course.handle}`) : undefined,
        },
        educationalLevel: course.level,
        url: absoluteUrl(`/courses/${course.slug}`),
        offers: {
          '@type': 'Offer',
          price: course.price ?? 0,
          priceCurrency: course.currency ?? 'VND',
          availability: 'https://schema.org/InStock',
        },
      }
    : null

  return (
    <>
      {courseJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(courseJsonLd) }}
        />
      )}
      <CoursePlayer slug={params.slug} />
    </>
  )
}
