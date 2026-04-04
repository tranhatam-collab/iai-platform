// ═══════════════════════════════════════════════════════════════
//  IAI Course Detail Page
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { CoursePlayer } from './CoursePlayer'

export const runtime = 'edge'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params
  // In production: fetch course data from API and build rich metadata
  return {
    title: `Khóa học — IAI`,
    description: 'Xem chi tiết khóa học và đăng ký học trên IAI Marketplace.',
    openGraph: {
      title: `Khóa học — IAI`,
      description: 'Khóa học được AI kiểm chứng nội dung trên IAI.',
      type: 'article',
    },
  }
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  return <CoursePlayer slug={slug} />
}
