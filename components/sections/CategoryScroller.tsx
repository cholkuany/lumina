'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { StorefrontCategory } from '@/lib/queries/get.categories'
import { useScrollButtonsStates } from '@/hooks/useScrollButtonsStates'

// Pulled from the category tokens in globals.css rather than one-off hex
// values, so these stay in sync if the palette changes.
const categoryColors = [
  'var(--category-grocery)',
  'var(--category-electronics)',
  'var(--category-fashion)',
  'var(--category-beauty)',
  'var(--category-home)',
  'var(--category-sports)',
  'var(--category-toys)',
  'var(--category-pets)',
  'var(--category-automotive)',
]

export function CategoryScroller({ categories }: { categories: StorefrontCategory[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const { isAtStart, isAtEnd } = useScrollButtonsStates(categories.length)

  const scroll = (direction: number) => scrollerRef.current?.scrollBy({
    left: direction * scrollerRef.current.clientWidth * 0.8,
    behavior: 'smooth',
  })

  if (!categories.length) return null

  return (
    <div className="relative">
      {/* Scroll buttons: only useful while the row can overflow (below the lg grid) */}
      <button
        onClick={() => scroll(-1)}
        disabled={isAtStart}
        aria-label="Scroll categories left"
        className={`absolute left-0 top-9 z-10 hidden h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-border-light bg-background shadow-soft transition sm:flex lg:hidden ${isAtStart ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-surface'}`}
      >
        <ChevronLeft className="h-4 w-4 text-foreground" aria-hidden="true" />
      </button>
      <button
        onClick={() => scroll(1)}
        disabled={isAtEnd}
        aria-label="Scroll categories right"
        className={`absolute right-0 top-9 z-10 hidden h-9 w-9 translate-x-1/2 items-center justify-center rounded-full border border-border-light bg-background shadow-soft transition sm:flex lg:hidden ${isAtEnd ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-surface'}`}
      >
        <ChevronRight className="h-4 w-4 text-foreground" aria-hidden="true" />
      </button>

      <div
        ref={scrollerRef}
        className="scrollHiddened flex snap-x snap-mandatory gap-4 overflow-x-auto lg:grid lg:grid-cols-8 lg:gap-5 lg:overflow-visible"
      >
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/products?category=${encodeURIComponent(category.name)}&id=${category.id}`}
            className="group flex w-20 shrink-0 snap-start flex-col items-center gap-2 sm:w-24 lg:w-auto"
          >
            <span
              className="relative overflow-hidden rounded-full p-0.5 sm:p-2"
              style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
            >
              <span className="relative block aspect-square w-20 h-20">
                <Image
                  src={category.image || '/grocery.svg'}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-3 transition duration-500 group-hover:scale-110 group-hover:-rotate-2"
                />
              </span>
            </span>
            <h6 className="mt-1 text-center text-sm font-bold tracking-tight text-foreground sm:text-xl">
              {category.name}
            </h6>
          </Link>
        ))}
      </div>
    </div>
  )
}