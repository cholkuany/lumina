import { cn } from '@/lib/utils'

import { ArrowDown, ArrowUp } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: React.ReactNode
  iconBg?: string
}

export function StatsCard({ title, value, change, icon, iconBg = 'bg-gold/10' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-brand border border-warm-gray p-6 hover:shadow-soft transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-warm-gray-dark">{title}</p>
          <p className="text-2xl font-semibold text-charcoal">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {change.type === 'increase' ? (
                <ArrowUp className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {change.value}%
              </span>
              <span className="text-sm text-warm-gray-dark">vs last month</span>
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
