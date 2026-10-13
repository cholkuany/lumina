'use client'

import { useState } from 'react'
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

/**
 * Each kind of collection owns a colour and an icon, so "Deals" is always the
 * same colour wherever it sits in the layout. This is the one place to tune the
 * palette. Keep every class a full literal string so Tailwind can see it.
 */
const KINDS: Record<HeroKind, { tone: string; Icon: LucideIcon }> = {
  deals: { tone: 'from-danger via-danger to-foreground', Icon: Tag },
  trending: { tone: 'from-accent via-accent to-foreground', Icon: TrendingUp },
  essentials: {
    tone: 'from-primary-light via-primary to-primary-dark',
    Icon: ShoppingCart,
  },
  new: { tone: 'from-primary via-primary-dark to-foreground', Icon: Sparkles },
}

/**
 * Where each product disc sits inside the (square) featured cluster, by how
 * many products the collection has. First entry is the lead product.
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

/**
 * Fades a tile's content in when the featured collection changes (wrappers are
 * keyed by collection id). `starting:` is progressive enhancement: browsers
 * without @starting-style support simply swap instantly.
 */
const ENTER =
  'transition-opacity duration-500 starting:opacity-0 motion-reduce:transition-none'

/* -------------------------------------------------------------------------- */
/* Shared pieces                                                              */
/* -------------------------------------------------------------------------- */

function KindPill({
  collection,
  compact = false,
}: {
  collection: HeroCollection
  compact?: boolean
}) {
  const { Icon } = KINDS[collection.kind]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded bg-white/90 font-bold uppercase text-foreground ${compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]'
        }`}
    >
      <Icon size={compact ? 11 : 12} aria-hidden="true" />
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
      aria-label={`${product.name}, ${product.price}${product.discount ? `, ${product.discount}% off` : ''
        }`}
      className={`group absolute aspect-square rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
    >
      {/* white disc: works for transparent cut-outs and white-background shots alike */}
      <span className="absolute inset-0 overflow-hidden rounded-full bg-white shadow-[0_18px_36px_rgba(0,0,0,0.28)] ring-4 ring-white/25 transition-transform duration-500 group-hover:scale-105">
        <Image
          src={product.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 768px) 120px, 220px"
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

/* -------------------------------------------------------------------------- */
/* Featured (large) tile                                                      */
/* -------------------------------------------------------------------------- */

function FeaturedTile({
  collection,
  canNavigate,
  onPrev,
  onNext,
}: {
  collection: HeroCollection
  canNavigate: boolean
  onPrev: () => void
  onNext: () => void
}) {
  const { tone } = KINDS[collection.kind]
  const shown = collection.products.slice(0, 3)
  const layout = CLUSTER[shown.length as 1 | 2 | 3]

  return (
    <div
      className={`relative isolate flex min-h-112 flex-col justify-end overflow-hidden rounded-brand bg-linear-to-br ${tone} p-5 text-white shadow-soft md:min-h-80 md:justify-center md:p-8 lg:min-h-0`}
    >
      {/* legibility scrim: bottom-up on mobile, left-to-right where the text sits on desktop */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-black/0 to-black/0 md:bg-linear-to-r md:from-black/30 md:via-black/5"
      />

      {/* mobile: the pill sits top-left, clear of the products */}
      <div
        key={`pill-${collection.id}`}
        className={`absolute left-5 top-5 z-10 md:hidden ${ENTER}`}
      >
        <KindPill collection={collection} />
      </div>

      {/* product cluster, bleeding toward the right edge like BentoHero's art */}
      <div
        key={`cluster-${collection.id}`}
        className={`absolute right-3 top-3 z-10 size-48 md:right-6 md:top-1/2 md:size-72 md:-translate-y-1/2 lg:size-88 ${ENTER}`}
      >
        <span aria-hidden className="pointer-events-none absolute inset-[6%] rounded-full bg-white/10" />
        <span aria-hidden className="pointer-events-none absolute -inset-[8%] rounded-full border border-white/15" />

        {shown.map((product, i) => (
          <ProductDisc
            key={product.id}
            product={product}
            className={layout[i]}
            priority={i === 0}
          />
        ))}
      </div>

      <div key={`content-${collection.id}`} className={`relative z-10 md:max-w-[52%] ${ENTER}`}>
        <div className="mb-3 hidden md:block">
          <KindPill collection={collection} />
        </div>

        <h2 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
          {collection.headline}
        </h2>

        <p className="mt-2 line-clamp-2 max-w-md text-sm text-white/85 md:text-base">
          {collection.blurb}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={collection.href}
            className="rounded-brand bg-white px-5 py-2.5 text-sm font-bold text-foreground shadow-soft transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
          >
            {collection.cta}
          </Link>

          {/* prev / next. Below lg the small tiles are the navigation. */}
          {canNavigate && (
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous collection"
                className="flex size-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onNext}
                aria-label="Next collection"
                className="flex size-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Small "up next" tile                                                       */
/* -------------------------------------------------------------------------- */

function SideTile({
  collection,
  wide,
  onSelect,
}: {
  collection: HeroCollection
  /** Spans both columns on lg, used when an odd number of tiles would leave a gap. */
  wide: boolean
  onSelect: () => void
}) {
  const { tone } = KINDS[collection.kind]
  const [lead, second] = collection.products

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Show ${collection.label}: ${collection.headline}`}
      className={`group relative isolate flex h-40 w-[68%] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-brand bg-linear-to-br ${tone} p-3.5 text-left text-white shadow-soft transition-shadow duration-300 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:h-44 md:w-auto md:flex-1 lg:h-auto lg:min-h-0 ${wide ? 'lg:col-span-2' : ''
        }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-black/0"
      />

      {/* a second product tucked behind the lead hints that this is a collection, not one item */}
      {second ? (
        <span className="absolute right-18 top-10 size-14 overflow-hidden rounded-full bg-white shadow-[0_10px_20px_rgba(0,0,0,0.22)] ring-4 ring-white/20 transition-transform duration-500 group-hover:scale-105 lg:right-20 lg:size-16">
          <Image src={second.image} alt="" fill sizes="64px" className="object-contain p-2" />
        </span>
      ) : null}

      <span className="absolute -right-5 -top-5 size-24 overflow-hidden rounded-full bg-white shadow-[0_14px_28px_rgba(0,0,0,0.25)] ring-4 ring-white/20 transition-transform duration-500 group-hover:scale-105 lg:size-28">
        <Image src={lead.image} alt="" fill sizes="112px" className="object-contain p-2.5" />
      </span>

      <span className="absolute left-3.5 top-3.5">
        <KindPill collection={collection} compact />
      </span>

      <span className="relative z-10 block">
        <span className="line-clamp-2 block text-[13px] font-semibold leading-snug md:text-sm">
          {collection.headline}
        </span>
        {collection.teaser ? (
          <span className="mt-1 block text-xs font-medium text-white/85">{collection.teaser}</span>
        ) : null}
      </span>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Carousel                                                                   */
/* -------------------------------------------------------------------------- */

export function HeroCarousel({ collections }: { collections: HeroCollection[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!collections.length) return null

  const current = activeIndex < collections.length ? activeIndex : 0

  // Everything except the active collection, in the order it will come up next,
  // so the first small tile is always what "Next" will show.
  const upNext = collections
    .map((_, offset) => (current + 1 + offset) % collections.length)
    .slice(0, collections.length - 1)

  const goPrev = () => setActiveIndex((current - 1 + collections.length) % collections.length)
  const goNext = () => setActiveIndex((current + 1) % collections.length)

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className={`grid gap-3 lg:h-96 ${upNext.length ? 'lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]' : ''
        }`}
    >
      <FeaturedTile
        collection={collections[current]}
        canNavigate={collections.length > 1}
        onPrev={goPrev}
        onNext={goNext}
      />

      {upNext.length > 0 && (
        // mobile: swipeable strip, tablet: one row, desktop: 2-column bento beside the featured tile
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:snap-none md:overflow-visible md:pb-0 lg:grid lg:auto-rows-fr lg:grid-cols-2 scrollHiddened">
          {upNext.map((collectionIndex, position) => (
            <SideTile
              key={collections[collectionIndex].id}
              collection={collections[collectionIndex]}
              wide={upNext.length % 2 === 1 && position === upNext.length - 1}
              onSelect={() => setActiveIndex(collectionIndex)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
