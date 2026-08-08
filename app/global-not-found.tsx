import type { Metadata } from 'next'
import { NotFoundContent } from '@/components/errors/NotFoundContent'
import './globals.css'

export const metadata: Metadata = {
  title: 'Page Not Found | LUMINA',
  robots: {
    index: false,
    follow: false,
  },
}

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <NotFoundContent />
      </body>
    </html>
  )
}
