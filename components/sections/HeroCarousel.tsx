'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TProduct } from '@/lib/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  formatPrice,
  getProductDiscount,
  getProductOriginalPrice,
  getProductPrice,
} from '@/lib/utils'

export function HeroCarousel({ products }: { products: TProduct[] }) {
  const items = products.slice(0, 5)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!items.length) return null

  const activeProduct = items[activeIndex]
  const discount = getProductDiscount(activeProduct)

  const price = getProductPrice(activeProduct)
  const originalPrice = getProductOriginalPrice(activeProduct)
  const image =
    activeProduct?.variants?.[0]?.images?.[0]?.secure_url ||
    '/placeholder-product.jpg'

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length)
  }

  return (
    <div className="relative overflow-hidden rounded-brand">
      {/* HERO GRID */}
      <div className="relative mx-auto grid min-h-54 max-w-5xl items-center md:min-h-64 md:grid-cols-[minmax(0,0.95fr)_minmax(260px,0.95fr)]">

        {/* CONTENT */}
        <div className="order-2 z-10 flex flex-col justify-center px-5 py-4 md:order-1 md:px-8 md:py-5 lg:px-10">

          {/* CATEGORY + DEAL BADGES */}
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-slate-900 px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">
              {activeProduct.category?.name || ''}
            </span>

            <span className="rounded bg-red-600 px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">
              Limited Time Deal
            </span>
          </div>

          <h2 className="text-2xl font-extrabold leading-tight text-slate-900 md:text-3xl lg:text-4xl">
            {discount ? `Save ${discount}% Today` : 'Featured Deal'}
          </h2>

          <p className="mt-2 max-w-md text-sm text-slate-600 md:text-base">
            {activeProduct.name}
          </p>

          <div className="mt-3 flex items-end gap-3">
            <span className="text-xl font-extrabold text-slate-900 md:text-2xl">
              {formatPrice(price)}
            </span>

            {originalPrice && (
              <span className="pb-0.5 text-sm text-slate-500 line-through md:text-base">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/products/${activeProduct.id}`}
              className="rounded-md bg-[#FFD814] px-4 py-2 text-sm font-bold text-black transition hover:bg-[#F7CA00]"
            >
              Shop Deal
            </Link>

            <Link
              href="/sale"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
            >
              Browse Deals
            </Link>
          </div>
        </div>

        {/* IMAGE */}
        <div className="order-1 relative min-h-36 overflow-hidden md:order-2 md:min-h-64">
          {/* DISCOUNT BADGE */}
          {discount && (
            <div className="absolute left-4 top-4 z-10 flex h-13 w-13 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white shadow-lg md:h-14 md:w-14">
              {discount}% OFF
            </div>
          )}
          <Image
            src={image}
            alt={activeProduct.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain object-center p-3 drop-shadow-[0_18px_32px_rgba(0,0,0,0.14)] transition-transform duration-500 md:p-5"
          />
        </div>
      </div>

      {/* INDICATORS */}
      <div className="flex items-center justify-center gap-2 pb-2">
        {items.map((product, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={product.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                h-2 rounded-full transition-all duration-300
                ${isActive ? 'w-7 bg-[#FFD814]' : 'w-2 bg-slate-300 hover:bg-[#FFD814]'}
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
      <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-full bg-linear-to-t from-white/60 to-transparent" />
    </div>
  )
}
