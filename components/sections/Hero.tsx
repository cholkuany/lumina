import { TProduct } from '@/lib/types'
import { HeroCarousel } from './HeroCarousel'

export function Hero({ products }: { products: TProduct[] }) {
  return (
    <section className="bg-[#f4f4ef]">
      <div className="bg-[#172a22] px-4 py-2 text-center text-xs font-black tracking-wide text-white sm:text-sm">
        FREE DELIVERY ON ORDERS OVER $50 <span className="mx-2 text-[#c8e637]">•</span> EASY 30-DAY RETURNS
      </div>

      <div className="py-4 lg:py-6">
        <div className="overflow-hidden px-2 py-4 shadow-[0_24px_70px_rgba(23,42,34,.12)] sm:p-6">
          <HeroCarousel products={products.slice(0, 5)} />
        </div>
      </div>
    </section>
  )
}
