import { cn } from '@/lib/utils'

import { ArrowDown, ArrowUp } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: React.ReactNode
  iconBg?: string
}

export function StatsCard({ title, value, description, change, icon, iconBg = 'bg-primary/10' }: StatsCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-brand border border-border p-5 hover:-translate-y-0.5 hover:shadow-hover transition-all duration-200">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-primary/0 group-hover:bg-primary transition-colors" />
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-border-dark">{title}</p>
          <p className="text-2xl font-semibold text-text-primary">{value}</p>
          {description && !change && (
            <p className="text-xs text-border-dark">{description}</p>
          )}
          {change && (
            <div className="flex items-center gap-1">
              {change.type === 'increase' ? (
                <ArrowUp className="w-4 h-4 text-success-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  change.type === 'increase' ? 'text-success-600' : 'text-red-600'
                )}
              >
                {change.value}%
              </span>
              <span className="text-sm text-border-dark">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-brand', iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  )
}
