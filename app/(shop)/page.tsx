import { Hero } from '@/components/sections/Hero'
import { Categories } from '@/components/sections/Categories'
import { TrendingProducts } from '@/components/sections/TrendingProducts'

import { getProducts } from '@/lib/queries/get.products'

export default async function Home() {
  const trendingProducts = (await getProducts()) || []

  const deals = trendingProducts.filter((product) => product.isSale)
  const trending = trendingProducts.filter((product) => !product.isSale)
  const essentials = trendingProducts.filter((product) => product.category.ancestors?.includes('Groceries'))
  const newArrivals = trendingProducts.filter((product) => product.isNewArrival)

  return (
    <main className="min-h-screen bg-surface">
      <Hero deals={deals} trending={trending} essentials={essentials} newArrivals={newArrivals} />
      {/* <Categories /> */}
      <TrendingProducts trendingProducts={trendingProducts} />
    </main>
  )
}