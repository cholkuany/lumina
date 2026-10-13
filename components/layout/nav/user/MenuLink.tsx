import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'

export const MenuLink = ({
  href,
  icon: Icon,
  onClick,
  children,
}: {
  href: string
  icon: LucideIcon
  onClick: () => void
  children: React.ReactNode
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
  >
    <Icon
      className="h-4 w-4 shrink-0 text-foreground/60 transition-colors group-hover:text-ink"
      aria-hidden="true"
    />
    {children}
  </Link>
)