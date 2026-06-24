"use client"

// components/sections/TrendingProducts.tsx
// import { useRouter } from 'next/navigation'
import { ProductCard } from '@/components/ui/ProductCard'
// import { Button } from '@/components/ui/Button'
// import { IProduct } from '@/lib/db/models'
import { Product } from '@/lib/types'

// import { use } from 'react'

import Link from 'next/link'
import { DisplayCard } from './Hero'

export function TrendingProducts({
  trendingProducts,
}: {
  trendingProducts: Product[]
}) {
  const products = trendingProducts || []
  const bestSellers = products.slice(0, 6)
  const deals = products.slice(2, 8)
  const recommended = products.slice(8, 15)

  return (
    <section className="bg-linen pb-10">
      <div className="container-lumina space-y-5">
        <DisplayCard
          title="Best sellers"
          href="/products?sort=popular"
          footerText="Shop best sellers"
          items={bestSellers}
          gridClassName="grid-cols-3 md:grid-cols-6"
          renderItem={(product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant='compact'
            />
          )}
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <PromoPanel
            href="/sale"
            eyebrow="Limited-time savings"
            title="Today&apos;s deals"
            text="Discover markdowns on products shoppers love."
            className="bg-linear-to-br from-gold to-gold-dark text-white"
            cta="Shop deals"
          />
          <PromoPanel
            href="/products?sort=newest"
            eyebrow="Fresh drops"
            title="New arrivals"
            text="See what’s just landed across top categories."
            className="bg-white text-charcoal"
            cta="Explore new arrivals"
          />
          <PromoPanel
            href="/categories"
            eyebrow="Browse departments"
            title="Shop by category"
            text="Navigate quickly through curated product collections."
            className="bg-charcoal text-white"
            cta="View categories"
          />
        </div>

        <DisplayCard
          title="Deals for you"
          href="/sale"
          footerText="Shop all deals"
          items={deals}
          gridClassName="grid-cols-3 md:grid-cols-6"
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
          gridClassName="grid-cols-3 md:grid-cols-6"
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
  eyebrow,
  title,
  text,
  cta,
  className,
}: {
  href: string
  eyebrow: string
  title: string
  text: string
  cta: string
  className: string
}) {
  return (
    <Link
      href={href}
      className={`rounded-[18px] p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-hover ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-75">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-3xl font-extrabold">{title}</h3>
      <p className="mt-3 text-sm leading-6 opacity-80">{text}</p>
      <p className="mt-6 text-sm font-extrabold">{cta} →</p>
    </Link>
  )
}