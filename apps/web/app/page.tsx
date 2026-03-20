// ═══════════════════════════════════════════════════════════════
//  IAI Homepage — Social Feed
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { FeedPage } from './FeedPage'

export const metadata: Metadata = {
  title: 'IAI — Giáo dục bằng sự thật',
  description: 'Feed cộng đồng nơi mọi bài viết được AI kiểm chứng. Học, thảo luận, tranh luận — với sự thật là nền tảng.',
}

export default function HomePage() {
  return <FeedPage />
}
