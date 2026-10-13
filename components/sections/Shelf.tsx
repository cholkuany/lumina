import Link from 'next/link'
import { ProductCard } from '@/components/ui/ProductCard'
import { TProduct } from '@/lib/types'

import { Carousel } from './Carousel'


export function Shelf({ title, items, href, footerText, variant = 'compact' }:
  {
    title: string;
    href: string;
    footerText: string;
    items: TProduct[];
    variant?: 'compact' | 'full';
  }) {
  if (items.length === 0) return null

  return (
    <div className="rounded-sm bg-background p-5 shadow-soft sm:p-7 mt-5">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-2xl font-black tracking-[-.035em] text-foreground sm:text-3xl">{title}</h2>
        <Link href={href} className="text-[12.5px] font-semibold text-success-dark hover:underline">
          {footerText} →
        </Link>
      </div>
      <Carousel itemsCount={items.length}>
        {items.map((product) => (
          <div key={product.id}
            className="shrink-0 snap-start w-[35%] sm:w-[40%] md:w-[30%] lg:w-[15%]"
          >
            <ProductCard
              product={product}
              variant={variant}
            />
          </div>
        ))}
      </Carousel>
    </div>
  )
}