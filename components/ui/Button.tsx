import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  `inline-flex items-center justify-center font-sans font-medium 
   tracking-wide transition-all duration-300 ease-out
   focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
   disabled:opacity-50 disabled:pointer-events-none`,
  {
    variants: {
      variant: {
        primary: `bg-charcoal text-white hover:bg-gold`,
        secondary: `bg-transparent border-2 border-charcoal text-charcoal
        hover:bg-charcoal hover:text-white`,
        ghost: `bg-transparent text-charcoal hover:bg-linen`,
        gold: `bg-gold text-white hover:bg-gold-dark`,
        link: `bg-transparent text-charcoal underline-offset-4 
        hover:text-gold hover:underline p-0`,
        outline: `bg-transparent text-charcoal border-2 border-charcoal
        hover:bg-charcoal hover:text-white focus:ring-charcoal/30`,
        danger: `bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500/30`
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-brand',
        md: 'h-11 px-6 text-sm rounded-brand',
        lg: 'h-14 px-8 text-base rounded-brand',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  className,
  variant,
  size,
  children,
  isLoading = false,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}

export { buttonVariants }