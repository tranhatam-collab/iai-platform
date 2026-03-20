// ═══════════════════════════════════════════════════════════════
//  IAI Post Detail Page
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { PostDetailClient } from './PostDetailClient'

type Props = { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Bài viết — IAI',
    description: 'Xem bài viết và kết quả kiểm chứng AI trên IAI — Intelligence · Artistry · International',
  }
}

export default function PostDetailPage({ params }: Props) {
  return <PostDetailClient postId={params.id} />
}
