// app/page.tsx
import { Hero } from '@/components/sections/Hero'
import { Categories } from '@/components/sections/Categories'
import { TrendingProducts } from '@/components/sections/TrendingProducts'
import { FeaturesBar } from '@/components/sections/FeaturesBar'

import { getProducts } from '@/lib/queries/get.products'

export default function Home() {
  const trendingProducts = getProducts()

  return (
    <main>
      <Hero />
      <FeaturesBar />
      <Categories />
      {trendingProducts && <TrendingProducts trendingProducts={trendingProducts} />}
    </main>
  )
}