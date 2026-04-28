import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ToggleButton = (
  { id, label, included, toggleGroup }:
    { id: string, label: string, included: boolean, toggleGroup: (groupId: string) => void }
) => {
  return (
    <button
      onClick={() => toggleGroup(id)}
      className="flex items-center justify-between w-full py-2"
    >
      <span className="font-medium text-charcoal">{label}</span>
      <ChevronDown
        className={cn(
          'w-5 h-5 text-warm-gray-dark transition-transform',
          included && 'rotate-180'
        )}
      />
    </button>
  )
}