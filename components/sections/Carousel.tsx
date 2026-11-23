"use client"

import { useScrollButtonsStates } from '@/hooks/useScrollButtonsStates'

import { NavArrows } from '@/components/ui/NavArrows'

export function Carousel({ children, itemsCount }: { children: React.ReactNode; itemsCount: number }) {
  const { isAtStart, isAtEnd, scrollBy, trackRef } = useScrollButtonsStates(itemsCount)

  return (
    <div className="relative flex shrink-0 items-center gap-2">
      <div
        ref={trackRef}
        className="scrollHiddened flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-3"
      >
        {children}
      </div>

      <NavArrows
        placement="edge"
        onPrev={() => scrollBy(-1)}
        onNext={() => scrollBy(1)}
        hidePrev={isAtStart}
        hideNext={isAtEnd}
        prevLabel="Scroll Left"
        nextLabel="Scroll Right"
      />
    </div>
  )
}