// ═══════════════════════════════════════════════════════════════
//  IAI Post Detail Page
// ═══════════════════════════════════════════════════════════════

export const runtime = 'edge'

import type { Metadata } from 'next'
import { PostDetailClient } from './PostDetailClient'
import { absoluteUrl, excerpt, fetchSeoJson, jsonLd, pageMetadata } from '@/lib/seo'

type Props = { params: { id: string } }
type PostPayload = {
  id: string
  content: string
  type?: string
  handle?: string
  name?: string
  created_at?: string
  updated_at?: string
  fact_status?: string
}
type PostResponse = { ok: boolean; post?: PostPayload }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchSeoJson<PostResponse>(`/v1/posts/${params.id}`)
  const post = data?.post

  if (!post) {
    return pageMetadata({
      title: 'Bài viết — IAI',
      description: 'Xem bài viết và kết quả kiểm chứng AI trên IAI.',
      path: `/post/${params.id}`,
      type: 'article',
    })
  }

  const author = post.name || `@${post.handle ?? 'iai'}`
  const title = `${excerpt(post.content, 72)} — ${author}`
  const description = excerpt(post.content, 160)

  return pageMetadata({
    title,
    description,
    path: `/post/${params.id}`,
    type: 'article',
    keywords: [post.type, post.handle, post.fact_status],
    publishedTime: post.created_at,
    modifiedTime: post.updated_at ?? post.created_at,
    authors: [author],
    section: 'Posts',
    tags: [post.type ?? 'discussion', post.fact_status ?? 'pending'],
  })
}

export default async function PostDetailPage({ params }: Props) {
  const data = await fetchSeoJson<PostResponse>(`/v1/posts/${params.id}`)
  const post = data?.post

  const articleJsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: excerpt(post.content, 72),
        description: excerpt(post.content, 160),
        datePublished: post.created_at,
        dateModified: post.updated_at ?? post.created_at,
        mainEntityOfPage: absoluteUrl(`/post/${params.id}`),
        author: {
          '@type': 'Person',
          name: post.name || `@${post.handle ?? 'iai'}`,
          url: post.handle ? absoluteUrl(`/u/${post.handle}`) : undefined,
        },
        publisher: {
          '@type': 'Organization',
          name: 'IAI',
          url: absoluteUrl('/'),
        },
      }
    : null

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }}
        />
      )}
      <PostDetailClient postId={params.id} />
    </>
  )
}
