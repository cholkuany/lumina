'use client'

import { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

import { ChevronDown, CircleAlert } from 'lucide-react';

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface FormSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

const FormSelect = (
  ({ label, error, hint, options, placeholder, className, id, ...props }: FormSelectProps) => {
    const selectId = id || props.name

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-charcoal"
          >
            {label}
            {props.required && <span className="text-gold ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              'w-full px-4 py-3 rounded-brand',
              'bg-white border border-warm-gray',
              'text-charcoal',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold',
              'hover:border-warm-gray-dark',
              'disabled:bg-linen disabled:cursor-not-allowed disabled:opacity-60',
              'appearance-none cursor-pointer',
              error && 'border-red-400 focus:ring-red-400/30 focus:border-red-400',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <ChevronDown className="w-5 h-5 text-warm-gray-dark" />
          </div>
        </div>
        {hint && !error && (
          <p className="text-xs text-warm-gray-dark">{hint}</p>
        )}
        {error && (
          <div className="text-xs text-red-500 flex items-center gap-1">
            <CircleAlert className="w-3.5 h-3.5" />
            <p>{error}</p>
          </div>
        )}
      </div>
    )
  }
)

export { FormSelect }