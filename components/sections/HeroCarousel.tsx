'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { getDiscount } from './Hero'
import { getProductOriginalPrice, getProductPrice } from '@/lib/utils'


export function HeroCarousel({ products }: { products: Product[] }) {
  const items = products.slice(0, 5)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!items.length) return null

  const activeProduct = items[activeIndex]
  const discount = getDiscount(activeProduct)

  const price = getProductPrice(activeProduct)
  const originalPrice = getProductOriginalPrice(activeProduct)

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length)
  }

  return (
    <div className="relative overflow-hidden rounded-brand">
      {/* HERO GRID */}
      <div className="relative grid min-h-52 md:grid-cols-2">

        {/* CONTENT */}
        <div className="order-2 flex flex-col justify-center px-6 py-10 md:order-1 md:px-12 lg:px-16">

          {/* CATEGORY + DEAL BADGES */}
          <div className="mb-5 flex items-center gap-2">
            <span className="rounded bg-slate-900 px-3 py-1 text-xs font-bold uppercase text-white">
              {activeProduct.category?.name || ''}
            </span>

            <span className="rounded bg-red-600 px-3 py-1 text-xs font-bold uppercase text-white">
              Limited Time Deal
            </span>
          </div>

          <h2 className="text-4xl font-black leading-tight text-slate-900 md:text-5xl lg:text-6xl">
            {discount ? `Save ${discount}% Today` : 'Featured Deal'}
          </h2>

          <p className="mt-4 max-w-lg text-lg text-slate-600">
            {activeProduct.name}
          </p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              {formatPrice(price)}
            </span>

            {originalPrice && (
              <span className="pb-1 text-lg text-slate-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/products/${activeProduct.id}`}
              className="rounded-md bg-[#FFD814] px-6 py-3 font-bold text-black transition hover:bg-[#F7CA00]"
            >
              Shop Deal
            </Link>

            <Link
              href="/sale"
              className="rounded-md border border-slate-300 bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-slate-100"
            >
              Browse Deals
            </Link>
          </div>
        </div>

        {/* IMAGE */}
        <div className="order-1 relative min-h-48 overflow-hidden md:order-2">
          {/* DISCOUNT BADGE */}
          {discount && (
            <div className="absolute left-5 top-5 z-10 flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-sm font-extrabold text-white shadow-lg">
              {discount}% OFF
            </div>
          )}
          <Image
            src={activeProduct?.variants?.[0]?.images?.[0]?.secure_url}
            alt={activeProduct.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4 md:p-8 scale-110 drop-shadow-[0_30px_50px_rgba(0,0,0,0.18)] transition-transform duration-500"
          />
        </div>
      </div>

      {/* INDICATORS */}
      <div className="flex items-center justify-center gap-3 pb-4">
        {items.map((product, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={product.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                h-3 rounded-full transition-all duration-300
                ${isActive ? 'w-8 bg-[#FFD814]' : 'w-3 bg-slate-300 hover:bg-[#FFD814]'}
              `}
            />
          )
        })}
      </div>

      {/* NAVIGATION */}
      {items.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous product"
            className="absolute left-0 top-0 z-20 hidden h-full w-14 items-center justify-center text-4xl text-slate-700 transition hover:bg-black/5 md:flex"
          >
            <ChevronLeft size={40} className='text-amber-400' />
          </button>

          <button
            onClick={goNext}
            aria-label="Next product"
            className="absolute right-0 top-0 z-20 hidden h-full w-14 items-center justify-center text-4xl text-slate-700 transition hover:bg-black/5 md:flex"
          >
            <ChevronRight size={40} className='text-amber-400' />
          </button>
        </>
      )}

      {/* FADE TO NEXT SECTION */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-linear-to-t from-white/60 to-transparent" />
    </div>
  )
}
