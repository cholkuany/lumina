// components/ui/Input.tsx
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  ref?: React.Ref<HTMLInputElement>
  children?: React.ReactNode
}

export const Input = ({ className, label, error, icon, ref, children, ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-charcoal mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray-dark">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            `w-full h-12 px-4 bg-white border border-warm-grayrounded-brand text-charcoal 
            placeholder:text-warm-gray-dark focus:outline-none focus:border-gold focus:ring-1 
            focus:ring-gold transition-colors duration-200`,
            icon && 'pl-12',
            children && 'pr-12',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
            className
          )}
          {...props}
        />
        {children}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
