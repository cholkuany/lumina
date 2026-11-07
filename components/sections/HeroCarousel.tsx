'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Sparkles,
  Tag,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

import type { HeroCollection, HeroKind, HeroProduct } from './hero-collections'
import { Backdrop, SEASONS, getSeason } from './HeroBackdrops'

/**
 * Each kind of collection owns a colour and an icon, so "Deals" is always the
 * same colour wherever it sits. Keep every class a full literal string so
 * Tailwind can see it.
 */
const KINDS: Record<Exclude<HeroKind, 'seasonal'>, { tone: string; Icon: LucideIcon }> = {
  deals: { tone: 'from-danger via-danger to-foreground', Icon: Tag },
  trending: { tone: 'from-accent via-accent to-foreground', Icon: TrendingUp },
  essentials: {
    tone: 'from-primary-light via-primary to-primary-dark',
    Icon: ShoppingCart,
  },
  new: { tone: 'from-primary via-primary-dark to-foreground', Icon: Sparkles },
}

/** Seasonal banners take their colour and icon from the current season. */
function styleFor(kind: HeroKind | 'seasonal') {
  return kind === 'seasonal' ? SEASONS[getSeason()] : KINDS[kind]
}

/**
 * Where each product disc sits inside the (square) art cluster on the right of
 * a banner, by how many products the collection has. First entry is the lead.
 */
const CLUSTER = {
  1: ['z-30 w-[72%] left-[14%] top-[10%]'],
  2: ['z-30 w-[64%] left-[30%] top-[8%]', 'z-20 w-[40%] left-[2%] top-[50%]'],
  3: [
    'z-30 w-[60%] left-[34%] top-[6%]',
    'z-20 w-[40%] left-[2%] top-[40%]',
    'z-10 w-[34%] left-[64%] top-[62%]',
  ],
} as const

/* -------------------------------------------------------------------------- */
/* Pieces                                                                     */
/* -------------------------------------------------------------------------- */

function KindPill({ collection }: { collection: HeroCollection }) {
  const { Icon } = styleFor(collection.kind)

  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase text-foreground md:text-[11px]">
      <Icon size={12} aria-hidden="true" />
      {collection.label}
    </span>
  )
}

/** A real product on a white disc, with its price pinned underneath. */
function ProductDisc({
  product,
  className,
  priority,
}: {
  product: HeroProduct
  className: string
  priority: boolean
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      aria-label={`${product.name}, ${product.price}${product.discount ? `, ${product.discount}% off` : ''}`}
      className={`group absolute aspect-square rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full bg-white shadow-[0_14px_28px_rgba(0,0,0,0.28)] ring-4 ring-white/25 transition-transform duration-500 group-hover:scale-105">
        <Image
          src={product.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 768px) 110px, 180px"
          className="object-contain p-[10%]"
        />
      </span>

      <span className="absolute -bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-foreground shadow-soft md:text-xs">
        {product.price}
        {product.discount ? <span className="text-danger">-{product.discount}%</span> : null}
      </span>
    </Link>
  )
}

/** The round "50% OFF" style sticker. Falls back to the kind's icon. */
function Badge({ collection, maxDiscount }: { collection: HeroCollection; maxDiscount: number }) {
  const { Icon } = styleFor(collection.kind)

  return (
    <span
      aria-hidden
      className="absolute right-[58%] top-3 z-20 flex size-14 -rotate-6 flex-col items-center justify-center rounded-full bg-white text-foreground shadow-soft ring-4 ring-white/30 md:right-[56%] md:top-5 md:size-20"
    >
      {maxDiscount > 0 ? (
        <>
          <span className="text-base font-extrabold leading-none text-danger md:text-2xl">
            {maxDiscount}%
          </span>
          <span className="text-[10px] font-bold leading-tight md:text-xs">OFF</span>
        </>
      ) : (
        <Icon className="size-6 md:size-8" aria-hidden="true" />
      )}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Banner                                                                     */
/* -------------------------------------------------------------------------- */

function Banner({ collection, first }: { collection: HeroCollection; first: boolean }) {
  const { tone } = styleFor(collection.kind)
  const shown = collection.products.slice(0, 3)
  const layout = CLUSTER[shown.length as 1 | 2 | 3]
  const maxDiscount = Math.max(0, ...collection.products.map((p) => p.discount ?? 0))

  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={collection.headline}
      className={`relative isolate h-48 w-[86%] shrink-0 snap-start overflow-hidden rounded-brand bg-linear-to-br ${tone} text-white shadow-soft sm:w-[70%] md:h-60 md:w-[58%] lg:h-72 lg:w-[48%]`}
    >
      {/* legibility scrim behind the text */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/35 via-black/5 to-black/0"
      />

      {/* themed artwork for this kind of collection (see HeroBackdrops.tsx) */}
      <Backdrop kind={collection.kind} />
      {/* <Backdrop kind="seasonal" season="summer" /> */}

      {/* text, left */}
      <div className="relative z-10 flex h-full max-w-[55%] flex-col justify-center gap-2 p-4 md:gap-3 md:p-7">
        <div>
          <KindPill collection={collection} />
        </div>

        <h2 className="font-serif text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">
          {collection.headline}
        </h2>

        <p className="line-clamp-2 hidden text-sm text-white/85 md:block">{collection.blurb}</p>

        <div>
          <Link
            href={collection.href}
            className="inline-block rounded-brand bg-white px-4 py-2 text-xs font-bold text-foreground shadow-soft transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 md:px-5 md:py-2.5 md:text-sm"
          >
            {collection.cta}
          </Link>
        </div>
      </div>

      {/* art, right: discount sticker + product cluster */}
      <div className="absolute inset-y-0 right-0 w-[52%]">
        <Badge collection={collection} maxDiscount={maxDiscount} />

        <div className="absolute right-2 top-1/2 size-36 -translate-y-1/2 md:right-5 md:size-52 lg:size-60">
          {shown.map((product, i) => (
            <ProductDisc
              key={product.id}
              product={product}
              className={layout[i]}
              priority={first && i === 0}
            />
          ))}
        </div>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/* Carousel                                                                   */
/* -------------------------------------------------------------------------- */

export function HeroCarousel({ collections }: { collections: HeroCollection[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const scrollToIndex = useCallback((index: number) => {
    const card = trackRef.current?.children[index] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [])

  // Work out which banner is closest to the left edge of the track.
  const onScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    let nearest = 0
    let best = Infinity
    Array.from(track.children).forEach((child, i) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - track.offsetLeft - track.scrollLeft)
      if (distance < best) {
        best = distance
        nearest = i
      }
    })
    setActive((prev) => (prev === nearest ? prev : nearest))
  }, [])

  if (!collections.length) return null

  const count = collections.length
  const canNavigate = count > 1

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="group/hero relative"
    >
      {/* On mobile the strip bleeds to the screen edges so the next banner peeks in. */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-1 [scroll-px-4] motion-reduce:scroll-auto md:mx-0 md:px-0 md:[scroll-px-0] scrollHiddened"
      >
        {collections.map((collection, i) => (
          <Banner key={collection.id} collection={collection} first={i === 0} />
        ))}
      </div>

      {/* desktop arrows */}
      {canNavigate && (
        <>
          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(active - 1, 0))}
            disabled={active === 0}
            aria-label="Previous collection"
            className="absolute left-2 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-0 lg:flex"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => scrollToIndex(Math.min(active + 1, count - 1))}
            disabled={active === count - 1}
            aria-label="Next collection"
            className="absolute right-2 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-0 lg:flex"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </>
      )}

      {/* dots */}
      {canNavigate && (
        <div className="mt-3 flex justify-center gap-1.5">
          {collections.map((collection, i) => (
            <button
              key={collection.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Show ${collection.label}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${i === active ? 'w-5 bg-primary' : 'w-1.5 bg-foreground/25 hover:bg-foreground/40'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}