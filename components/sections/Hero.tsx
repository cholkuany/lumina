import { TProduct } from '@/lib/types'
import { HeroCarousel } from './HeroCarousel'
import { buildHeroCollections } from './hero-collections'

type HeroProps = {
  deals?: TProduct[]
  trending?: TProduct[]
  essentials?: TProduct[]
  newArrivals?: TProduct[]
}

export function Hero({
  deals = [],
  trending = [],
  essentials = [],
  newArrivals = [],
}: HeroProps) {
  // Order here is the order shoppers see: the first collection opens featured.
  // Collections with no products are dropped automatically.
  const collections = buildHeroCollections([
    {
      id: 'deals',
      kind: 'deals',
      label: 'Deals',
      headline: ({ maxDiscount }) =>
        maxDiscount ? `Save up to ${maxDiscount}% today` : 'Today’s best deals',
      blurb: 'Limited-time prices on products people actually buy.',
      href: '/sale',
      cta: 'Shop deals',
      products: deals,
    },
    {
      id: 'trending',
      kind: 'trending',
      label: 'Trending',
      headline: 'What everyone’s buying',
      blurb: 'The most-loved picks right now.',
      href: '/trending',
      cta: 'Shop trending',
      products: trending,
    },
    {
      id: 'essentials',
      kind: 'essentials',
      label: 'Essentials',
      headline: 'Stock up on the basics',
      blurb: 'Everyday staples for your cart.',
      href: '/essentials',
      cta: 'Shop essentials',
      products: essentials,
    },
    {
      id: 'new',
      kind: 'new',
      label: 'New in',
      headline: 'Just landed',
      blurb: 'Fresh arrivals, added this week.',
      href: '/new-arrivals',
      cta: 'Shop new arrivals',
      products: newArrivals,
    },
  ])

  if (!collections.length) return null

  return (
    <section className="bg-background">
      <div className="py-4 lg:py-6">
        <div className="container-lumina">
          <HeroCarousel collections={collections} />
        </div>
      </div>
    </section>
  )
}
