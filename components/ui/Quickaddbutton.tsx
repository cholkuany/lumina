'use client'

import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickAddButtonProps {
  onClick: () => void
  disabled?: boolean
  isCompact?: boolean
}

/**
 * Overlay button pinned to the bottom of the image area.
 * Expects an ancestor with the `group` class (the card) and a `relative` image container.
 * On mobile it's always visible and compact; on sm+ it slides up on card hover.
 */
export function QuickAddButton({
  onClick,
  disabled = false,
  isCompact = false,
}: QuickAddButtonProps) {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 translate-y-0 sm:transition-transform sm:duration-300',
        isCompact ? 'p-2' : 'p-3'
      )}
    >
      <button
        type="button"
        disabled={disabled}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full bg-primary-dark text-white backdrop-blur-sm transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50 sm:w-full p-2.5 text-sm font-medium',
        )}
        onClick={(e) => {
          e.preventDefault()
          onClick()
        }}
      >
        <Plus className="h-full w-full" aria-hidden="true" />
      </button>
    </div>
  )
}