'use client'
// app/categories/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ChevronRight } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'

export default function CategoriesPage() {

  const { data, isPending, isError } = useCategories(false)

  // const featuredCategories = categories.filter(cat => cat.featured)
  // const otherCategories = categories.filter(cat => !cat.featured)

  if (isPending) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error loading categories.</div>
  }
  console.log('Categories data:', data)
  const categories = data?.categories || []
  const featuredCategories = categories.slice(0, 5)
  // const otherCategories = categories.slice(5)

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb items={[{ label: 'All Categories' }]} />
      </div>

      <div className="container-lumina">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-4">
            Shop by Category
          </h1>
          <p className="text-warm-gray-dark max-w-2xl mx-auto">
            Explore our wide range of products across various categories.
            Find exactly what you&apos;re looking for.
          </p>
        </div>

        {/* Featured Categories - Large Cards */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl text-charcoal mb-6">
            Featured Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.name}`}
                className="group relative overflow-hidden rounded-brand aspect-video bg-linen"
              >
                {/* Background Image */}
                <Image
                  src={category?.image || '/images/categories/placeholder.jpg'}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-charcoal/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                  <h3 className="font-serif text-2xl lg:text-3xl text-white font-semibold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm lg:text-base mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">
                      {category.productCount.toLocaleString()} products
                    </span>
                    <span className="flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                      Shop Now
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Categories with Subcategories */}
        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-6">
            All Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white border border-warm-gray-light rounded-brand overflow-hidden hover:shadow-hover transition-shadow"
              >
                {/* Category Header */}
                <Link
                  href={`/products?category=${category.name}`}
                  className="block relative aspect-video bg-linen group"
                >
                  <Image
                    src={category?.image || '/images/categories/placeholder.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-serif text-xl text-white font-semibold">
                      {category.name}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {category.productCount.toLocaleString()} products
                    </p>
                  </div>
                </Link>

                {/* Subcategories */}
                <div className="p-4">
                  <ul className="space-y-2">
                    {category.children.slice(0, 5).map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/products?category=${sub.name}`}
                          className="flex items-center justify-between text-sm text-charcoal hover:text-gold transition-colors py-1"
                        >
                          <span>{sub.name}</span>
                          <span className="text-warm-gray-dark text-xs">
                            ({sub.productCount})
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {category.children.length > 5 && (
                    <Link
                      href={`/products?category=${category.name}`}
                      className="inline-flex items-center gap-1 text-sm text-gold hover:underline mt-3"
                    >
                      View all {category.children.length} subcategories
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}