import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'IAI V3.0',
    short_name: 'IAI',
    description:
      'IAI V3.0 là app surface cho social, collaboration, marketplace và automation; nft.iai.one giữ lớp tài sản kiểm chứng cho toàn hệ sinh thái.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    categories: ['education', 'productivity', 'social'],
    icons: [
      {
        src: '/icon',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
