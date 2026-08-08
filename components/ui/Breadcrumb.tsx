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
    <nav className="flex items-center gap-1 text-sm flex-wrap">
      {items.map((item, index) => (
        <div key={index} className="flex items-center not-last:after:ml-1 not-last:after:content-['/'] not-last:after:text-border group">
          {item.href ? (
            <Link
              href={item.href}
              className="text-border-dark hover:text-primary transition-colors group-last:text-text-primary underline underline-offset-[3px] capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text-primary font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}