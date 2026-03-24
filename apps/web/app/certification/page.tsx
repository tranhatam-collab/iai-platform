import type { Metadata } from 'next'
import { CertificationRegistryClient } from './CertificationRegistryClient'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Chứng Nhận Độc Lập — IAI',
  description:
    'Trang chứng nhận độc lập cho toàn bộ bài viết và bài học trên app.iai.one, đối chiếu với lớp xác minh và proof surface ngoài app.',
  path: '/certification',
  keywords: ['chứng nhận độc lập', 'certification', 'proof registry'],
})

export default function CertificationPage() {
  return <CertificationRegistryClient />
}
