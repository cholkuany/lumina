"use client"

// components/sections/TrendingProducts.tsx
import { ProductCard } from '@/components/ui/ProductCard'
import { TProduct } from '@/lib/types'

import Link from 'next/link'
import { DisplayCard } from './Hero'
import { ChevronRight, Percent, Sparkles, Store } from 'lucide-react'

export function TrendingProducts({
  trendingProducts,
}: {
  trendingProducts: TProduct[]
}) {
  const products = trendingProducts || []
  const bestSellers = products.slice(0, 6)
  const deals = products.slice(2, 8)
  const recommended = products.slice(8, 15)

  return (
    <section className="bg-[#e3e6e6] pb-10">
      <div className="container-lumina space-y-4">
        <DisplayCard
          title="Best sellers in LUMINA"
          href="/products?sort=popular"
          footerText="Shop best sellers"
          items={bestSellers}
          gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          renderItem={(product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant='compact'
            />
          )}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <PromoPanel
            href="/products?sort=sale"
            icon={<Percent className="h-5 w-5" />}
            eyebrow="Limited-time savings"
            title="Today's deals"
            text="Discover markdowns on products shoppers love."
            className="border-red-100 bg-white"
            cta="Shop deals"
          />
          <PromoPanel
            href="/products?sort=newest"
            icon={<Sparkles className="h-5 w-5" />}
            eyebrow="Fresh drops"
            title="New arrivals"
            text="See what's just landed across top categories."
            className="border-amber-100 bg-[#fff7e8]"
            cta="Explore new arrivals"
          />
          <PromoPanel
            href="/categories"
            icon={<Store className="h-5 w-5" />}
            eyebrow="Browse departments"
            title="Shop by category"
            text="Navigate quickly through curated product collections."
            className="border-slate-200 bg-white"
            cta="View categories"
          />
        </div>

        <DisplayCard
          title="Deals for you"
          href="/products?sort=sale"
          footerText="Shop all deals"
          items={deals}
          gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          renderItem={(product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant='compact'
            />
          )}
        />

        <DisplayCard
          title="Recommended for you"
          href="/products"
          footerText="See more"
          items={recommended}
          gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          renderItem={(product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant='compact'
            />
          )}
        />
      </div>
    </section>
  )
}

function PromoPanel({
  href,
  icon,
  eyebrow,
  title,
  text,
  cta,
  className,
}: {
  href: string
  icon: React.ReactNode
  eyebrow: string
  title: string
  text: string
  cta: string
  className: string
}) {
  return (
    <Link
      href={href}
      className={`group rounded-sm border p-5 shadow-soft transition hover:border-[#febd69] hover:shadow-hover ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#232f3e] text-[#febd69]">
          {icon}
        </span>
        <p className="text-xs font-bold uppercase text-charcoal/55">
          {eyebrow}
        </p>
      </div>
      <h3 className="mt-4 text-2xl font-extrabold text-charcoal">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-charcoal/65">{text}</p>
      <p className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#007185] group-hover:text-gold-dark">
        {cta}
        <ChevronRight className="h-4 w-4" />
      </p>
    </Link>
  )
}
