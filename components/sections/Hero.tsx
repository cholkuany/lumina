import { BadgePercent, PackageCheck, Truck } from 'lucide-react'
import { TProduct } from '@/lib/types'
import { HeroCarousel } from './HeroCarousel'

export function Hero({ products }: { products: TProduct[] }) {
  return (
    <section className="bg-[#f4f4ef]">
      <div className="bg-[#172a22] px-4 py-2 text-center text-xs font-black tracking-wide text-white sm:text-sm">
        FREE DELIVERY ON ORDERS OVER $75 <span className="mx-2 text-[#c8e637]">•</span> EASY 30-DAY RETURNS
      </div>

      <div className="container-lumina py-4 lg:py-6">
        <div className="overflow-hidden rounded-[2rem] bg-[#ffe0d2] px-2 py-4 shadow-[0_24px_70px_rgba(23,42,34,.12)] sm:px-6 sm:py-6">
          <HeroCarousel products={products.slice(0, 5)} />
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl bg-[#d9ddd7] sm:grid-cols-3">
          {[
            [Truck, 'Fast delivery', 'Straight to your door'],
            [BadgePercent, 'Prices that feel good', 'Fresh deals every week'],
            [PackageCheck, 'Easy returns', '30 days, no stress'],
          ].map(([Icon, title, text]) => {
            const FeatureIcon = Icon as typeof Truck
            return (
              <div key={title as string} className="flex items-center gap-4 bg-white px-6 py-5">
                <FeatureIcon className="h-6 w-6 text-[#57720a]" />
                <div>
                  <p className="text-sm font-black text-[#172a22]">{title as string}</p>
                  <p className="text-xs text-[#172a22]/55">{text as string}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
