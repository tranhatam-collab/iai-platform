// ═══════════════════════════════════════════════════════════════
//  IAI Post Detail Page
// ═══════════════════════════════════════════════════════════════

export const runtime = 'edge'

import type { Metadata } from 'next'
import { PostDetailClient } from './PostDetailClient'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params
  return {
    title: 'Bài viết — IAI',
    description: 'Xem bài viết và kết quả kiểm chứng AI trên IAI — Intelligence · Artistry · International',
  }
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params
  return <PostDetailClient postId={id} />
}
