import type { MetadataRoute } from 'next'
import { absoluteUrl, fetchSeoJson } from '@/lib/seo'

type PostListResponse = {
  ok: boolean
  posts: Array<{ id: string; created_at?: string; updated_at?: string }>
  cursor: string | null
}

type LessonListResponse = {
  ok: boolean
  lessons: Array<{ slug: string; published_at?: string; created_at?: string }>
  cursor: string | null
}

type CourseListResponse = {
  ok: boolean
  courses: Array<{ slug: string; published_at?: string; updated_at?: string; created_at?: string }>
  total: number
}

type UserListResponse = {
  ok: boolean
  users: Array<{ handle: string; created_at?: string; updated_at?: string }>
  cursor: string | null
}

async function getAllPosts(): Promise<MetadataRoute.Sitemap> {
  const items: MetadataRoute.Sitemap = []
  let cursor: string | null = null
  let safety = 0

  while (safety < 40) {
    const query: string = cursor
      ? `/v1/posts?tab=latest&limit=50&cursor=${encodeURIComponent(cursor)}`
      : '/v1/posts?tab=latest&limit=50'
    const data: PostListResponse | null = await fetchSeoJson<PostListResponse>(query)
    if (!data?.ok || data.posts.length === 0) break

    for (const post of data.posts) {
      items.push({
        url: absoluteUrl(`/post/${post.id}`),
        lastModified: post.updated_at ?? post.created_at ?? new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }

    if (!data.cursor) break
    cursor = data.cursor
    safety += 1
  }

  return items
}

async function getAllLessons(): Promise<MetadataRoute.Sitemap> {
  const items: MetadataRoute.Sitemap = []
  let cursor: string | null = null
  let safety = 0

  while (safety < 40) {
    const query: string = cursor
      ? `/v1/lessons?limit=50&cursor=${encodeURIComponent(cursor)}`
      : '/v1/lessons?limit=50'
    const data: LessonListResponse | null = await fetchSeoJson<LessonListResponse>(query)
    if (!data?.ok || data.lessons.length === 0) break

    for (const lesson of data.lessons) {
      items.push({
        url: absoluteUrl(`/lessons/${lesson.slug}`),
        lastModified: lesson.published_at ?? lesson.created_at ?? new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    if (!data.cursor) break
    cursor = data.cursor
    safety += 1
  }

  return items
}

async function getAllCourses(): Promise<MetadataRoute.Sitemap> {
  const items: MetadataRoute.Sitemap = []
  let offset = 0
  let safety = 0

  while (safety < 40) {
    const data: CourseListResponse | null = await fetchSeoJson<CourseListResponse>(`/v1/courses?limit=100&offset=${offset}`)
    if (!data?.ok || data.courses.length === 0) break

    for (const course of data.courses) {
      items.push({
        url: absoluteUrl(`/courses/${course.slug}`),
        lastModified: course.updated_at ?? course.published_at ?? course.created_at ?? new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    if (data.courses.length < 100) break
    offset += 100
    safety += 1
  }

  return items
}

async function getAllUsers(): Promise<MetadataRoute.Sitemap> {
  const items: MetadataRoute.Sitemap = []
  let cursor: string | null = null
  let safety = 0

  while (safety < 40) {
    const query: string = cursor
      ? `/v1/users?limit=100&cursor=${encodeURIComponent(cursor)}`
      : '/v1/users?limit=100'
    const data: UserListResponse | null = await fetchSeoJson<UserListResponse>(query)
    if (!data?.ok || data.users.length === 0) break

    for (const user of data.users) {
      items.push({
        url: absoluteUrl(`/u/${user.handle}`),
        lastModified: user.updated_at ?? user.created_at ?? new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }

    if (!data.cursor) break
    cursor = data.cursor
    safety += 1
  }

  return items
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/verify'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/lessons'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/marketplace'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/studio'), changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/certification'), changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/badges'), changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/policies'), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const [posts, lessons, courses, users] = await Promise.all([
    getAllPosts(),
    getAllLessons(),
    getAllCourses(),
    getAllUsers(),
  ])

  return [...staticRoutes, ...posts, ...lessons, ...courses, ...users]
}
