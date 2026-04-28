// components/ui/Breadcrumb.tsx
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link href="/" className="text-warm-gray-dark hover:text-gold transition-colors">
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-warm-gray" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-warm-gray-dark hover:text-gold transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-charcoal font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}