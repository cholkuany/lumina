"use client"

// components/sections/TrendingProducts.tsx
import { ProductCard } from '@/components/ui/ProductCard'
import { TProduct } from '@/lib/types'

import Link from 'next/link'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Percent, Sparkles, Store } from 'lucide-react'

function ProductShelf({ title, href, footerText, items, children }: { title: string; href: string; footerText: string; items: TProduct[]; children: (product: TProduct) => React.ReactNode }) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const scroll = (direction: number) => carouselRef.current?.scrollBy({ left: direction * carouselRef.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <div className="rounded-[1.6rem] bg-background p-5 shadow-soft sm:p-7">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-black tracking-[-.035em] text-[#172a22] sm:text-3xl">{title}</h2>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => scroll(-1)} aria-label={`Previous ${title}`} className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#172a22]/15 text-[#172a22] transition hover:bg-[#c8e637] sm:flex"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => scroll(1)} aria-label={`Next ${title}`} className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#172a22]/15 text-[#172a22] transition hover:bg-[#c8e637] sm:flex"><ChevronRight className="h-4 w-4" /></button>
          <Link href={href} className="ml-1 flex items-center gap-1 text-sm font-black text-[#57720a]">{footerText}<ChevronRight className="h-4 w-4" /></Link>
        </div>
      </div>
      <div ref={carouselRef} className="scrollHiddened flex snap-x snap-mandatory gap-4 overflow-x-auto py-3">
        {items.map((product) => (
          <div key={product.id} className="w-[35%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-[15%]">
            {children(product)}
          </div>
        ))}
      </div>
    </div>
  )
}

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
    <section className="bg-[#f4f4ef] pb-20">
      <div className="container-lumina space-y-4">
        <ProductShelf
          title="Everyone's into these"
          href="/products?sort=popular"
          footerText="Shop best sellers"
          items={bestSellers}>
          {(product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant='compact'
            />
          )}
        </ProductShelf>

        <div className="grid gap-4 lg:grid-cols-3">
          <PromoPanel
            href="/products?sort=sale"
            icon={<Percent className="h-5 w-5" />}
            eyebrow="Limited-time savings"
            title="Today's deals"
            text="Discover markdowns on products shoppers love."
            className="border-transparent bg-[#ffd8ca]"
            cta="Shop deals"
          />
          <PromoPanel
            href="/products?sort=newest"
            icon={<Sparkles className="h-5 w-5" />}
            eyebrow="Fresh drops"
            title="New arrivals"
            text="See what's just landed across top categories."
            className="border-transparent bg-[#c8e637]"
            cta="Explore new arrivals"
          />
          <PromoPanel
            href="/categories"
            icon={<Store className="h-5 w-5" />}
            eyebrow="Browse departments"
            title="Shop by category"
            text="Navigate quickly through curated product collections."
            className="border-transparent bg-[#dfeffc]"
            cta="View categories"
          />
        </div>

        <ProductShelf
          title="Deals for you"
          href="/products?sort=sale"
          footerText="Shop all deals"
          items={deals}>
          {(product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant='compact'
            />
          )}
        </ProductShelf>

        <ProductShelf
          title="Recommended for you"
          href="/products"
          footerText="See more"
          items={recommended}>
          {(product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant='compact'
            />
          )}
        </ProductShelf>
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
      className={`group rounded-[1.6rem] border p-6 transition hover:-translate-y-1 hover:shadow-hover ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#172a22] text-[#c8e637]">
          {icon}
        </span>
        <p className="text-xs font-bold uppercase text-text-primary/55">
          {eyebrow}
        </p>
      </div>
      <h3 className="mt-4 text-2xl font-extrabold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-text-primary/65">{text}</p>
      <p className="mt-5 inline-flex items-center gap-1 text-sm font-black text-[#172a22]">
        {cta}
        <ChevronRight className="h-4 w-4" />
      </p>
    </Link>
  )
}
