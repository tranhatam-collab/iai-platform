import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://flow.iai.one'),
  title: {
    default: 'IAI Flow',
    template: '%s | IAI Flow',
  },
  description: 'Canonical workflow builder and execution surface for the IAI ecosystem.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
