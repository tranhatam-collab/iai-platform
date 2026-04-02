// ═══════════════════════════════════════════════════════════════
//  IAI Lesson Detail Page
// ═══════════════════════════════════════════════════════════════

export const runtime = 'edge'

import type { Metadata } from 'next'
import { LessonDetail } from './LessonDetail'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params
  return {
    title: `Bài học — IAI`,
    description: 'Bài học được AI kiểm chứng trên IAI — Intelligence · Artistry · International',
  }
}

export default async function LessonDetailPage({ params }: Props) {
  const { slug } = await params
  return <LessonDetail slug={slug} />
}
