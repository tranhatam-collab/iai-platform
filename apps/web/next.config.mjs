/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.iai.one' },
      { protocol: 'https', hostname: 'iai-media.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'gateway.pinata.cloud' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.iai.one'}/:path*`,
      },
    ]
  },
}

export default nextConfig
