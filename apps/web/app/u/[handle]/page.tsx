// ═══════════════════════════════════════════════════════════════
//  IAI User Profile Page
// ═══════════════════════════════════════════════════════════════

export const runtime = 'edge'

import type { Metadata } from 'next'
import { UserProfileClient } from './UserProfileClient'

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  return {
    title: `@${handle} — IAI`,
    description: `Hồ sơ của @${handle} trên IAI — Intelligence · Artistry · International`,
  }
}

export default async function UserProfilePage({ params }: Props) {
  const { handle } = await params
  return <UserProfileClient handle={handle} />
}
