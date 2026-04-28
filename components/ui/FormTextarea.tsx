'use client'

import { TextareaHTMLAttributes, Ref } from 'react'
import { cn } from '@/lib/utils'
import { CircleAlert } from 'lucide-react'
export interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  showCount?: boolean
  ref?: Ref<HTMLTextAreaElement>
  optional?: boolean
}

const FormTextarea =
  (
    { label, error, hint, showCount, maxLength, className, id, value, optional = true, ref, ...props }: FormTextareaProps
  ) => {
    const textareaId = id || props.name
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-charcoal"
          >
            {label}
            {!optional && <span className="text-gold ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={cn(
            'w-full px-4 py-3 rounded-brand',
            'bg-white border border-warm-gray',
            'text-charcoal placeholder:text-warm-gray-dark',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold',
            'hover:border-warm-gray-dark',
            'disabled:bg-linen disabled:cursor-not-allowed disabled:opacity-60',
            'resize-none',
            error && 'border-red-400 focus:ring-red-400/30 focus:border-red-400',
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-center">
          <div>
            {hint && !error && (
              <p className="text-xs text-warm-gray-dark">{hint}</p>
            )}
            {error && (
              <div className="text-xs text-red-500 flex items-center gap-1">
                <CircleAlert className="w-3.5 h-3.5" />
                <p>{error} </p>
              </div>
            )}
          </div>
          {showCount && maxLength && (
            <p
              className={cn(
                'text-xs',
                currentLength > maxLength * 0.9
                  ? 'text-red-500'
                  : 'text-warm-gray-dark'
              )}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }

export { FormTextarea }