// ═══════════════════════════════════════════════════════════════
//  IAI User Profile Page
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { UserProfileClient } from './UserProfileClient'

type Props = { params: { handle: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `@${params.handle} — IAI`,
    description: `Hồ sơ của @${params.handle} trên IAI — Intelligence · Artistry · International`,
  }
}

export default function UserProfilePage({ params }: Props) {
  return <UserProfileClient handle={params.handle} />
}
