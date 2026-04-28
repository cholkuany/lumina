// components/checkout/CheckoutSteps.tsx
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckoutStepsProps {
  currentStep: number
}

const steps = [
  { id: 1, name: 'Shipping' },
  { id: 2, name: 'Payment' },
  { id: 3, name: 'Review' },
]

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <nav className="mb-8">
      <ol className="flex items-center justify-center">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-colors',
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                      ? 'bg-charcoal text-white'
                      : 'bg-linen text-warm-gray-dark'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  'ml-3 text-sm font-medium hidden sm:block',
                  currentStep >= step.id ? 'text-charcoal' : 'text-warm-gray-dark'
                )}
              >
                {step.name}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-12 sm:w-24 h-0.5 mx-4',
                  currentStep > step.id ? 'bg-green-500' : 'bg-warm-gray-light'
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}