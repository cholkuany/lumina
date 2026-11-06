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
          {index < (items.length - 1) && item.href ? (
            <Link
              href={item.href}
              className="text-border-dark hover:text-primary transition-colors group-last:text-foreground underline underline-offset-[3px] capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

// <div className="hidden sm:block">
//   <h1 className="text-xl font-semibold text-foreground">{title}</h1>
//   <nav className="flex items-center gap-1.5 text-xs text-border-dark">
//     {breadcrumbs.map((crumb, index) => (
//       <span key={crumb.href} className="flex items-center gap-1.5">
//         {index > 0 && <span>/</span>}
//         <span className={cn(crumb.current && 'text-primary')}>
//           {crumb.name}
//         </span>
//       </span>
//     ))}
//   </nav>
// </div>