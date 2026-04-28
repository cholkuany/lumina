import { CheckCircle, LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SubmissionSuccessProps {
  title: string
  description: string
  icon?: LucideIcon
  buttonText?: string
  onClose?: () => void
}

export function SubmissionSuccess({
  title,
  description,
  icon: Icon = CheckCircle,
  buttonText = 'Close',
  onClose,
}: SubmissionSuccessProps) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="font-serif text-xl text-charcoal mb-2">{title}</h3>
      <p className="text-warm-gray-dark mb-6 max-w-sm mx-auto">{description}</p>
      {onClose && (
        <Button variant="secondary" onClick={onClose}>
          {buttonText}
        </Button>
      )}
    </div>
  )
}