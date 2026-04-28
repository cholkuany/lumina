"use client"

// components/sections/TrendingProducts.tsx
import { useRouter } from 'next/navigation'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
// import { IProduct } from '@/lib/db/models'
import { Product } from '@/lib/types'

import { use } from 'react'

// const products = [
//   {
//     id: '1',
//     name: 'Wireless Noise-Canceling Headphones',
//     description: 'Premium audio experience',
//     price: 249.99,
//     originalPrice: 299.99,
//     image: '/21383084_en_front_800.avif',
//     rating: 4.8,
//     reviewCount: 234,
//     isSale: true,
//   },
//   {
//     id: '2',
//     name: 'Minimalist Leather Watch',
//     description: 'Timeless elegance',
//     price: 189.00,
//     image: '/21430531_en_front_800.avif',
//     rating: 4.9,
//     reviewCount: 128,
//     isNewArrival: true,
//   },
//   {
//     id: '3',
//     name: 'Organic Cotton Throw Blanket',
//     description: 'Cozy comfort',
//     price: 79.99,
//     image: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp',
//     rating: 4.7,
//     reviewCount: 89,
//   },
//   {
//     id: '4',
//     name: 'Smart Home Speaker',
//     description: 'Voice-controlled assistant',
//     price: 129.99,
//     originalPrice: 159.99,
//     image: '/bf152e03-e160-45be-bace-63aec16520a9.01fcd6201fa0802d44e64df69f6fc8d1.jpeg',
//     rating: 4.6,
//     reviewCount: 312,
//     isSale: true,
//   },
// ]

export function TrendingProducts({ trendingProducts }: { trendingProducts: Promise<Product[] | null> }) {
  const trending = use(trendingProducts)
  console.log('\ntrending product', trending)
  const router = useRouter()
  return (
    <section className="py-16 lg:py-24 bg-linen">
      <div className="container-lumina">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-gold text-sm font-medium tracking-wider">
            POPULAR NOW
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-charcoal mt-2 mb-4">
            Trending Products
          </h2>
          <p className="text-warm-gray-dark max-w-md mx-auto">
            Discover what our community is loving right now.
            Curated picks updated weekly.
          </p>
        </div>

        {/* Products Grid */}
        {trending &&
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        }

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" onClick={() => router.push('/products')}>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}