import { HeroCarousel } from './HeroCarousel'
import { HeroProps, buildCollections } from './hero-collections'

export function Hero({
  deals = [],
  trending = [],
  essentials = [],
  newArrivals = [],
  seasonal = [],
}: HeroProps) {
  const collections = buildCollections({ deals, trending, essentials, newArrivals, seasonal })
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
