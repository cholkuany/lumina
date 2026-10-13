'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type QuantityStepperProps = {
  value: number
  onChange: (next: number) => void
  min?: number
  max: number
  size?: 'sm' | 'md'
  showMaxMessage?: boolean
  className?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max,
  size = 'md',
  showMaxMessage = false,
  className,
}: QuantityStepperProps) {
  const atMin = value <= min
  const atMax = value >= max

  const btn = cn(
    'flex items-center justify-center text-foreground transition-colors',
    'hover:bg-border-light/50 active:bg-border-light',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
    size === 'md' ? 'h-12 w-12' : 'h-9 w-9'
  )

  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      <div
        role="group"
        aria-label="Quantity"
        className="inline-flex items-center overflow-hidden rounded-lg border border-border-light"
      >
        <button
          type="button"
          aria-label="Decrease quantity"
          className={btn}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={atMin}
        >
          <Minus className="h-4 w-4" />
        </button>

        <span
          aria-live="polite"
          className={cn(
            'text-center font-medium tabular-nums text-foreground',
            size === 'md' ? 'w-12' : 'w-9'
          )}
        >
          {value}
        </span>

        <button
          type="button"
          aria-label="Increase quantity"
          className={btn}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={atMax}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {showMaxMessage && atMax && (
        <p className="text-xs font-medium text-muted">Only {max} available</p>
      )}
    </div>
  )
}