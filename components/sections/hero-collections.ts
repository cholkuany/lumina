import { TProduct } from '@/lib/types'
import {
  formatPrice,
  getProductDiscount,
  getProductPrice,
} from '@/lib/utils'

/**
 * Server-side only. Turns raw product lists into small, serializable
 * collections for the hero, so the client component never receives full
 * TProduct objects (variants, descriptions, etc.) and never re-derives prices.
 * Deliberately has no 'use client' directive.
 */

export type HeroKind = 'deals' | 'trending' | 'essentials' | 'new'

export type HeroProduct = {
  id: string
  name: string
  image: string
  /** Already formatted, e.g. "$4.99". */
  price: string
  discount: number | null
}

export type HeroCollection = {
  id: string
  kind: HeroKind
  /** Pill text, e.g. "Deals". */
  label: string
  /** Big tile heading. */
  headline: string
  blurb: string
  /** One short line for the small tile, e.g. "Up to 40% off" or "From $1.99". */
  teaser: string
  href: string
  cta: string
  products: HeroProduct[]
}

export type HeroCollectionSource = {
  id: string
  kind: HeroKind
  label: string
  headline: string | ((ctx: { maxDiscount: number | null }) => string)
  blurb: string
  href: string
  cta: string
  products: TProduct[]
}

const FALLBACK_IMAGE = '/grocery.svg'

/** Products shown per collection (the featured tile has room for three). */
const PRODUCTS_PER_COLLECTION = 3

/** Collections shown at once: one featured plus up to four small tiles. */
const MAX_COLLECTIONS = 5

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

/** Empty collections are dropped, so a failed or empty query never leaves a blank tile. */
export function buildHeroCollections(sources: HeroCollectionSource[]): HeroCollection[] {
  return sources
    .filter((source) => source.products.length > 0)
    .slice(0, MAX_COLLECTIONS)
    .map((source) => {
      // Stats come from the whole list, not just the three products we display.
      const discounts = source.products
        .map(toDiscount)
        .filter((d): d is number => d !== null)
      const maxDiscount = discounts.length ? Math.max(...discounts) : null

      let cheapest: TProduct | null = null
      let cheapestValue = Infinity
      for (const product of source.products) {
        const value = Number(getProductPrice(product))
        if (value < cheapestValue) {
          cheapest = product
          cheapestValue = value
        }
      }

      const teaser =
        source.kind === 'deals' && maxDiscount
          ? `Up to ${maxDiscount}% off`
          : cheapest
            ? `From ${formatPrice(getProductPrice(cheapest))}`
            : ''

      return {
        id: source.id,
        kind: source.kind,
        label: source.label,
        headline:
          typeof source.headline === 'function'
            ? source.headline({ maxDiscount })
            : source.headline,
        blurb: source.blurb,
        teaser,
        href: source.href,
        cta: source.cta,
        products: source.products.slice(0, PRODUCTS_PER_COLLECTION).map(toHeroProduct),
      }
    })
}