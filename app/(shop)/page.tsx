import { Hero } from '@/components/sections/Hero'
import { Categories } from '@/components/sections/Categories'
import { TrendingProducts } from '@/components/sections/TrendingProducts'

import { getProducts } from '@/lib/queries/get.products'

export default async function Home() {
  const trendingProducts = (await getProducts()) || []

  return (
    <main className="min-h-screen bg-linen">
      <Hero products={trendingProducts} />
      <Categories />
      <TrendingProducts trendingProducts={trendingProducts} />
    </main>
  )
}