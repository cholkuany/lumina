import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavArrowsProps {
  onPrev: () => void
  onNext: () => void
  hidePrev?: boolean
  hideNext?: boolean
  /** 'edge' sits half outside the container (carousel); 'inset' sits inside (gallery) */
  placement?: 'edge' | 'inset'
  /** Only show when an ancestor with `group` is hovered */
  showOnGroupHover?: boolean
  prevLabel?: string
  nextLabel?: string
}

const base =
  'absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-opacity duration-200 hover:bg-white'

const placements = {
  edge: {
    prev: 'left-0 -translate-x-1/3 border border-ink hover:border-2',
    next: 'right-0 translate-x-1/3 border border-ink hover:border-2',
  },
  inset: {
    prev: 'left-4',
    next: 'right-4',
  },
}

export function NavArrows({
  onPrev,
  onNext,
  hidePrev = false,
  hideNext = false,
  placement = 'inset',
  showOnGroupHover = false,
  prevLabel = 'Previous',
  nextLabel = 'Next',
}: NavArrowsProps) {
  const visibility = (hidden: boolean) =>
    hidden
      ? 'pointer-events-none opacity-0'
      : showOnGroupHover
        ? 'opacity-0 group-hover:opacity-100'
        : 'opacity-100'

  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        disabled={hidePrev}
        aria-label={prevLabel}
        aria-hidden={hidePrev}
        tabIndex={hidePrev ? -1 : 0}
        className={cn(base, placements[placement].prev, visibility(hidePrev))}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={hideNext}
        aria-label={nextLabel}
        aria-hidden={hideNext}
        tabIndex={hideNext ? -1 : 0}
        className={cn(base, placements[placement].next, visibility(hideNext))}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </>
  )
}