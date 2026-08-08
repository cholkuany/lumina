import type { Metadata } from 'next'
import { NotFoundContent } from '@/components/errors/NotFoundContent'

export const metadata: Metadata = {
  title: 'Page Not Found | LUMINA',
}

export default function NotFound() {
  return <NotFoundContent />
}
