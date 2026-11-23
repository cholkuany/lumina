'use client'

// import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  // ChevronLeft,
  // ChevronRight,
  ShoppingCart,
  Sparkles,
  Tag,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

import type { HeroCollection, HeroKind, HeroProduct } from './hero-collections'
import { Backdrop, SEASONS, getSeason } from './HeroBackdrops'
import { Carousel } from '../Carousel'
// import { ProductThumb } from '@/components/ui/ProductThumb'

/**
 * Each kind of collection owns a colour and an icon, so "Deals" is always the
 * same colour wherever it sits. Keep every class a full literal string so
 * Tailwind can see it.
 */
const KINDS: Record<Exclude<HeroKind, 'seasonal'>, { tone: string; Icon: LucideIcon }> = {
  deals: { tone: 'from-accent via-danger to-danger-dark', Icon: Tag },
  trending: {
    tone: 'from-category-fashion via-category-beauty to-primary-dark',
    Icon: TrendingUp,
  },
  essentials: { tone: 'from-secondary via-secondary-dark to-foreground', Icon: ShoppingCart },
  new: { tone: 'from-info via-primary to-primary-dark', Icon: Sparkles },
}

/** Seasonal banners take their colour and icon from the current season. */
function styleFor(kind: HeroKind) {
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
    <span className="heading-label inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-0.5 text-[10px] md:text-[11px]">
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
      className={`group absolute aspect-square rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white bg-card ${className}`}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full shadow-[0_14px_28px_rgba(0,0,0,0.28)] ring-4 ring-white/25 transition-transform duration-500 group-hover:scale-105">
        <Image
          src={product.image}
          alt=""
          fill
          preload={priority}
          sizes="(max-width: 768px) 110px, 180px"
          className="object-contain p-[10%]"
        />
      </span>

      <span className="absolute -bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-border-light bg-card px-2 py-0.5 text-[10px] font-bold text-foreground shadow-soft md:text-xs">
        {product.price}
        {product.discount ? <span className="text-danger-dark">-{product.discount}%</span> : null}
      </span>
    </Link>
  )
}

/** The round "50% OFF" style sticker. Falls back to the kind's icon. */
function Badge({ kind, maxDiscount }: { kind: HeroKind; maxDiscount: number }) {
  const { Icon } = styleFor(kind)

  return (
    <span
      aria-hidden
      className="absolute right-[58%] top-3 z-20 flex size-14 -rotate-6 flex-col items-center justify-center rounded-full bg-rose-500 shadow-soft ring-4 ring-danger-dark/30 md:right-[56%] md:top-5 md:size-20 text-background"
    >
      {maxDiscount > 0 ? (
        <>
          <span className="text-base font-extrabold leading-none md:text-2xl">
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
  const layout = CLUSTER[shown.length as keyof typeof CLUSTER]
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

        <h2 className="text-balance font-serif text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">
          {collection.headline}
        </h2>

        <p className="line-clamp-2 hidden text-sm text-white/85 md:block">{collection.blurb}</p>

        <div>
          <Link
            href={collection.href}
            className="btn-outline px-4 py-2 text-xs shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 md:px-5 md:py-2.5 md:text-sm"
          >
            {collection.cta}
          </Link>
        </div>
      </div>

      {/* art, right: discount sticker + product cluster */}
      <div className="absolute inset-y-0 right-0 w-[52%]">
        <Badge kind={collection.kind} maxDiscount={maxDiscount} />

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

  if (!collections.length) return null

  const count = collections.length
  // const canNavigate = count > 1

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="group/hero relative"
    >
      <Carousel itemsCount={count}>
        {collections.map((collection, i) => (
          <Banner key={collection.id} collection={collection} first={i === 0} />
        ))}
      </Carousel>
    </div>
  )
}