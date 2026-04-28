'use client'

import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { CircleAlert } from 'lucide-react'

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  className?: string
  id?: string
  optional?: boolean
}

const FormInput = ({ label, error, hint, className, id, optional = true, ...props }: FormInputProps) => {
  const inputId = id || props.name

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-charcoal capitalize"
        >
          {label}
          {!optional && <span className="text-gold ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-brand',
          'bg-white border border-warm-gray',
          'text-charcoal placeholder:text-warm-gray-dark',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold',
          'hover:border-warm-gray-dark',
          'disabled:bg-linen disabled:cursor-not-allowed disabled:opacity-60',
          error && 'border-red-400 focus:ring-red-400/30 focus:border-red-400',
          className
        )}
        {...props}
      />
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

export { FormInput }