// components/ui/RadioGroup.tsx
'use client'

import { cn } from '@/lib/utils'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RadioGroup({ name, options, value, onChange, className }: RadioGroupProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-start gap-3 p-4 border rounded-brand cursor-pointer transition-all',
            value === option.value
              ? 'border-gold bg-gold/5'
              : 'border-warm-grayhover:border-gold/50'
          )}
        >
          <div className="relative mt-0.5">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 transition-all',
                value === option.value ? 'border-gold' : 'border-warm-gray'
              )}
            >
              {value === option.value && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gold rounded-full" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-charcoal">{option.label}</span>
            {option.description && (
              <p className="text-xs text-warm-gray-dark mt-0.5">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  )
}