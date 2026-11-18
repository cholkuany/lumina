import 'server-only'

import { TProduct } from '@/lib/types'
import {
  formatPrice,
  getProductDiscount,
  getProductPrice,
} from '@/lib/utils'

const FALLBACK_IMAGE = '/grocery.svg'

/** Products shown per collection (the featured tile has room for three). */
const PRODUCTS_PER_COLLECTION = 3

/** Collections shown at once: one featured plus up to four small tiles. */
const MAX_COLLECTIONS = 5

export type HeroProps = {
  deals?: TProduct[]
  trending?: TProduct[]
  essentials?: TProduct[]
  newArrivals?: TProduct[]
  seasonal?: TProduct[]
}

export type HeroKind = 'deals' | 'trending' | 'essentials' | 'new' | 'seasonal'

export type HeroProduct = {
  id: string
  name: string
  image: string
  price: string
  discount: number | null
}

type HeadlineContext = { maxDiscount: number | null }

interface HeroBaseCollection {
  kind: HeroKind
  label: string
  blurb: string
  href: string
  cta: string
}

export interface HeroCollection extends HeroBaseCollection {
  id: string
  headline: string
  teaser: string
  products: HeroProduct[]
}

export interface HeroCollectionSource extends HeroBaseCollection {
  headline: string | ((ctx: HeadlineContext) => string)
  products: TProduct[]
}

type CollectionConfig = Omit<HeroCollectionSource, 'products'> & {
  /** Which list in HeroProps feeds this collection. */
  propKey: keyof HeroProps
}

/** Order here is display priority; empty collections are skipped before the cap. */
const COLLECTION_CONFIG: CollectionConfig[] = [
  {
    kind: 'deals',
    propKey: 'deals',
    label: 'Deals',
    headline: ({ maxDiscount }) =>
      maxDiscount ? `Save up to ${maxDiscount}% today` : "Today's best deals",
    blurb: 'Limited-time prices on products people actually buy.',
    href: '/sale',
    cta: 'Shop deals',
  },
  {
    kind: 'trending',
    propKey: 'trending',
    label: 'Trending',
    headline: "What everyone's buying",
    blurb: 'The most-loved picks right now.',
    href: '/trending',
    cta: 'Shop trending',
  },
  {
    kind: 'essentials',
    propKey: 'essentials',
    label: 'Essentials',
    headline: 'Stock up on the basics',
    blurb: 'Everyday staples for your cart.',
    href: '/essentials',
    cta: 'Shop essentials',
  },
  {
    kind: 'new',
    propKey: 'newArrivals',
    label: 'New in',
    headline: 'Just landed',
    blurb: 'Fresh arrivals, added this week.',
    href: '/new-arrivals',
    cta: 'Shop new arrivals',
  },
  {
    kind: 'seasonal',
    propKey: 'seasonal',
    label: 'Seasonal',
    headline: 'Holiday favourites',
    blurb: 'Treats and gifts for the season.',
    href: '/seasonal',
    cta: 'Shop seasonal',
  },
]

function toDiscount(product: TProduct): number | null {
  const n = Math.round(Number(getProductDiscount(product)))
  return n > 0 ? n : null
}

function toHeroProduct(product: TProduct): HeroProduct {
  return {
    id: product.id,
    name: product.name,
    image: product.variants?.[0]?.images?.[0]?.secure_url || FALLBACK_IMAGE,
    price: formatPrice(getProductPrice(product)),
    discount: toDiscount(product),
  }
}

function findCheapest(products: TProduct[]): TProduct | null {
  let best: TProduct | null = null
  let bestPrice = Infinity
  for (const p of products) {
    const price = Number(getProductPrice(p))
    if (Number.isFinite(price) && price < bestPrice) {
      best = p
      bestPrice = price
    }
  }
  return best
}

function buildTeaser(
  kind: HeroKind,
  maxDiscount: number | null,
  cheapest: TProduct | null,
): string {
  if (kind === 'deals') return maxDiscount ? `Up to ${maxDiscount}% off` : ''
  return cheapest ? `From ${formatPrice(getProductPrice(cheapest))}` : ''
}

function toHeroCollection(source: HeroCollectionSource): HeroCollection {
  // Stats come from the whole list, not just the displayed products.
  const discounts = source.products
    .map(toDiscount)
    .filter((d): d is number => d !== null)
  const maxDiscount = discounts.length ? Math.max(...discounts) : null

  return {
    id: source.kind,
    kind: source.kind,
    label: source.label,
    headline:
      typeof source.headline === 'function'
        ? source.headline({ maxDiscount })
        : source.headline,
    blurb: source.blurb,
    teaser: buildTeaser(source.kind, maxDiscount, findCheapest(source.products)),
    href: source.href,
    cta: source.cta,
    products: source.products
      .slice(0, PRODUCTS_PER_COLLECTION)
      .map(toHeroProduct),
  }
}

function buildHeroCollections(
  sources: HeroCollectionSource[],
): HeroCollection[] {
  return sources
    .filter((source) => source.products.length > 0)
    .slice(0, MAX_COLLECTIONS)
    .map(toHeroCollection)
}

/**
 * Server-side only. Turns raw product lists into small, serializable
 * collections for the hero, so the client component never receives full
 * TProduct objects (variants, descriptions, etc.) and never re-derives prices.
 * Deliberately has no 'use client' directive.
 */
export const buildCollections = (props: HeroProps): HeroCollection[] =>
  buildHeroCollections(
    COLLECTION_CONFIG.map(({ propKey, ...config }) => ({
      ...config,
      products: props[propKey] ?? [],
    })),
  )