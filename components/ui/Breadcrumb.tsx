import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm flex-wrap">
      {items.map((item, index) => (
        <div key={index} className="flex items-center not-last:after:ml-2 not-last:after:content-['/'] not-last:after:text-warm-gray group">
          {item.href ? (
            <Link
              href={item.href}
              className="text-warm-gray-dark hover:text-gold transition-colors group-last:text-charcoal underline underline-offset-[3px]"
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