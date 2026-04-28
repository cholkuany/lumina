'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  id: string
  label: string | React.ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox({ id, label, checked, onChange, disabled, className }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-center gap-3 cursor-pointer group',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={cn(
            'w-5 h-5 border-2 rounded transition-all duration-200',
            checked
              ? 'bg-charcoal border-charcoal'
              : 'bg-white border-warm-gray group-hover:border-gold'
          )}
        >
          {checked && <Check className="w-4 h-4 text-white absolute inset-0.5 top-0.5 left-0.5" strokeWidth={3} />}
        </div>
      </div>
      <span className="text-sm text-charcoal">{label}</span>
    </label>
  )
}