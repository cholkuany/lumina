"use client"

import { useMemo } from 'react'
import { Percent, Sparkles, Store } from 'lucide-react'

import { TProduct } from '@/lib/types'
import { Shelf } from './Shelf'
import { PromoPanel } from './PromoPanel'

const PROMO_COLORS = {
  deals: 'bg-[#ffd8ca]',
  newArrivals: 'bg-[#c8e637]',
  categories: 'bg-[#dfeffc]',
} as const

export function TrendingProducts({ trendingProducts = [] }: { trendingProducts: TProduct[] }) {
  const { bestSellers, deals, recommended } = useMemo(() => {
    const bestSellers = trendingProducts.slice(0, 6)
    const usedIds = new Set(bestSellers.map(p => p.id))

    const deals = trendingProducts.filter(p => p.isSale && !usedIds.has(p.id)).slice(0, 6)
    deals.forEach(p => usedIds.add(p.id))

    const recommended = trendingProducts.filter(p => !usedIds.has(p.id)).slice(0, 7)

    return { bestSellers, deals, recommended }
  }, [trendingProducts])

  return (
    <section className="bg-[#f4f4ef] pb-20">
      <div className="container-lumina space-y-5">
        <Shelf
          title="Everyone's into these"
          href="/products?sort=popular"
          footerText="Shop best sellers"
          items={bestSellers}
          variant="compact"
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <PromoPanel
            href="/products?sort=sale"
            icon={<Percent className="h-5 w-5" aria-hidden="true" />}
            eyebrow="Limited-time savings"
            title="Today's deals"
            text="Discover markdowns on products shoppers love."
            className={`border-transparent ${PROMO_COLORS.deals}`}
            cta="Shop deals"
          />
          <PromoPanel
            href="/products?sort=newest"
            icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
            eyebrow="Fresh drops"
            title="New arrivals"
            text="See what's just landed across top categories."
            className={`border-transparent ${PROMO_COLORS.newArrivals}`}
            cta="Explore new arrivals"
          />
          <PromoPanel
            href="/categories"
            icon={<Store className="h-5 w-5" aria-hidden="true" />}
            eyebrow="Browse departments"
            title="Shop by category"
            text="Navigate quickly through curated product collections."
            className={`border-transparent ${PROMO_COLORS.categories}`}
            cta="View categories"
          />
        </div>

        <Shelf
          title="Deals for you"
          href="/products?sort=sale"
          footerText="Shop all deals"
          items={deals}
          variant='compact'
        />

        <Shelf
          title="Recommended for you"
          href="/products"
          footerText="See more"
          items={recommended}
          variant="compact"
        />
      </div>
    </section>
  )
}