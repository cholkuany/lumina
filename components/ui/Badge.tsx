// components/ui/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary'
  className?: string
  isCompact?: boolean
  status?: boolean
}

const variants = {
  default: 'bg-surface text-foreground',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-red-500',
  primary: 'bg-primary',
}

export function Badge({ children, variant = 'default', className, isCompact = false, status = true }: BadgeProps) {

  return (
    status && (
      <span
        className={cn(
          'inline-flex items-center rounded-xs font-extrabold tracking-wide text-white bg-success',
          variants[variant],
          className,
          isCompact
            ? 'px-1.5 py-0.5 text-[10px]'
            : 'px-2.5 py-1 text-xs'
        )}
      >
        {children}
      </span>
    )
  )
}