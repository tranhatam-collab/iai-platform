import type { Metadata } from 'next'

export const SITE_NAME = 'IAI V3.0'
export const SITE_URL = 'https://app.iai.one'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`

const PUBLIC_API_ORIGIN = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL
  if (raw && /^https?:\/\//.test(raw)) return raw.replace(/\/$/, '')
  return 'https://api.iai.one'
})()

const BASE_KEYWORDS = [
  'IAI',
  'app.iai.one',
  'giáo dục AI',
  'social learning',
  'marketplace giáo dục',
  'knowledge nft',
  'fact-check AI',
  'nft.iai.one',
]

type SeoInput = {
  title: string
  description: string
  path: string
  keywords?: Array<string | null | undefined>
  type?: 'website' | 'article' | 'profile'
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
}

export function absoluteUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString()
}

export function apiUrl(path: string): string {
  return new URL(path, `${PUBLIC_API_ORIGIN}/`).toString()
}

export function stripMarkdown(input: string | null | undefined): string {
  return String(input ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_#>`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerpt(input: string | null | undefined, max = 160): string {
  const clean = stripMarkdown(input)
  if (clean.length <= max) return clean
  return `${clean.slice(0, Math.max(0, max - 1)).trim()}…`
}

export function buildKeywords(...groups: Array<Array<string | null | undefined> | string | null | undefined>): string[] {
  const flat = groups.flatMap((group) => Array.isArray(group) ? group : [group])
  return Array.from(new Set([...BASE_KEYWORDS, ...flat].filter((item): item is string => !!item && !!item.trim())))
}

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  type = 'website',
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: SeoInput): Metadata {
  const canonical = absoluteUrl(path)
  const robots: NonNullable<Metadata['robots']> = noIndex
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          'max-image-preview': 'large' as const,
          'max-video-preview': -1,
          'max-snippet': -1,
        },
      }

  const openGraph = {
    title,
    description,
    url: canonical,
    siteName: SITE_NAME,
    locale: 'vi_VN',
    type,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    ...(publishedTime ? { publishedTime } : {}),
    ...(modifiedTime ? { modifiedTime } : {}),
    ...(authors?.length ? { authors } : {}),
    ...(section ? { section } : {}),
    ...(tags?.length ? { tags } : {}),
  } as NonNullable<Metadata['openGraph']>

  return {
    title,
    description,
    keywords: buildKeywords(keywords),
    alternates: {
      canonical,
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots,
  }
}

export async function fetchSeoJson<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const response = await fetch(apiUrl(path), {
      headers: { Accept: 'application/json' },
      next: { revalidate },
    })
    if (!response.ok) return null
    return response.json() as Promise<T>
  } catch {
    return null
  }
}

export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
