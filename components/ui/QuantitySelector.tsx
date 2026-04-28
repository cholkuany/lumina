// components/ui/QuantitySelector.tsx
'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from './Button'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  // className?: string
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  // className,
}: QuantitySelectorProps) {
  const decrease = () => onChange(Math.max(min, value - 1))
  const increase = () => onChange(Math.min(max, value + 1))

  return (
    <div
      className='inline-flex justify-between items-center border border-warm-gray rounded-brand'
    >
      <Button
        onClick={decrease}
        disabled={value <= min}
        size={size}
        className='flex items-center justify-center bg-warm-gray hover:bg-warm-gray-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <Minus className="w-4 h-4" />
      </Button>

      <div className="flex items-center justify-center w-12 font-medium text-charcoal">
        {value}
      </div>

      <Button
        onClick={increase}
        disabled={value >= max}
        size={size}
        className='flex items-center justify-center bg-warm-gray hover:bg-warm-gray-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}