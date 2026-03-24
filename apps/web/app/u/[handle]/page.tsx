// ═══════════════════════════════════════════════════════════════
//  IAI User Profile Page
// ═══════════════════════════════════════════════════════════════

export const runtime = 'edge'

import type { Metadata } from 'next'
import { UserProfileClient } from './UserProfileClient'
import { absoluteUrl, excerpt, fetchSeoJson, jsonLd, pageMetadata } from '@/lib/seo'

type Props = { params: { handle: string } }
type UserPayload = {
  handle: string
  name?: string
  bio?: string
  avatar_url?: string
  trust_score?: number
  edu_level?: string
  created_at?: string
  updated_at?: string
}
type UserResponse = { ok: boolean; user?: UserPayload }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchSeoJson<UserResponse>(`/v1/users/${params.handle}`)
  const user = data?.user

  if (!user) {
    return pageMetadata({
      title: `@${params.handle} — IAI`,
      description: `Hồ sơ của @${params.handle} trên IAI — Intelligence · Artistry · International`,
      path: `/u/${params.handle}`,
      type: 'profile',
    })
  }

  const displayName = user.name || `@${user.handle}`
  const description = user.bio
    ? excerpt(user.bio, 160)
    : `${displayName} trên IAI với trust score ${user.trust_score ?? 0} và cấp độ ${user.edu_level ?? 'member'}.`

  return pageMetadata({
    title: `${displayName} (@${user.handle}) — IAI`,
    description,
    path: `/u/${user.handle}`,
    type: 'profile',
    keywords: [user.handle, user.edu_level, `trust score ${user.trust_score ?? 0}`],
  })
}

export default async function UserProfilePage({ params }: Props) {
  const data = await fetchSeoJson<UserResponse>(`/v1/users/${params.handle}`)
  const user = data?.user

  const profileJsonLd = user
    ? {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: absoluteUrl(`/u/${user.handle}`),
        mainEntity: {
          '@type': 'Person',
          name: user.name || `@${user.handle}`,
          alternateName: `@${user.handle}`,
          description: user.bio ? excerpt(user.bio, 160) : undefined,
          image: user.avatar_url || undefined,
        },
      }
    : null

  return (
    <>
      {profileJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(profileJsonLd) }}
        />
      )}
      <UserProfileClient handle={params.handle} />
    </>
  )
}
