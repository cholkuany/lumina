'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface FormSwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
}

const FormSwitch = forwardRef<HTMLInputElement, FormSwitchProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const switchId = id || props.name

    return (
      <label
        htmlFor={switchId}
        className={cn(
          'flex items-center justify-between gap-4 py-3 cursor-pointer group',
          props.disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <div className="flex-1">
          <span className="block text-sm font-medium text-charcoal group-hover:text-gold transition-colors">
            {label}
          </span>
          {description && (
            <span className="block text-xs text-warm-gray-dark mt-0.5">
              {description}
            </span>
          )}
        </div>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-11 h-6 rounded-full',
              'bg-warm-gray-light',
              'peer-checked:bg-gold',
              'peer-focus:ring-2 peer-focus:ring-gold/30',
              'transition-colors duration-200'
            )}
          />
          <div
            className={cn(
              'absolute top-0.5 left-0.5',
              'w-5 h-5 rounded-full',
              'bg-white shadow-sm',
              'peer-checked:translate-x-5',
              'transition-transform duration-200'
            )}
          />
        </div>
      </label>
    )
  }
)

FormSwitch.displayName = 'FormSwitch'

export { FormSwitch }