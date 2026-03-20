// ═══════════════════════════════════════════════════════════════
//  IAI Lesson Detail Page
// ═══════════════════════════════════════════════════════════════

export const runtime = 'edge'

import type { Metadata } from 'next'
import { LessonDetail } from './LessonDetail'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Bài học — IAI`,
    description: 'Bài học được AI kiểm chứng trên IAI — Intelligence · Artistry · International',
  }
}

export default function LessonDetailPage({ params }: Props) {
  return <LessonDetail slug={params.slug} />
}
