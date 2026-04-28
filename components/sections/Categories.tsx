// components/sections/Categories.tsx
import Link from 'next/link'
import { CategoryCard } from '@/components/ui/CategoryCard'

const categories = [
  {
    name: 'Electronics',
    image: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp',
    category: 'electronics',
    itemCount: 1250
  },
  {
    name: 'Fashion',
    image: '/ed61305b-6a85-41ea-8a30-7751a1e92244.6b7780504e47e51afeccbd8f10a891e1.webp',
    category: 'fashion',
    itemCount: 3420
  },
  { name: 'Home & Living', image: '/bf152e03-e160-45be-bace-63aec16520a9.01fcd6201fa0802d44e64df69f6fc8d1.jpeg', category: 'home', itemCount: 890 },
  { name: 'Beauty', image: '/2067c8ee-6f4a-4099-8f80-e5a84b988306.c483978f430cf4289faccbf6dd120434.webp', category: 'beauty', itemCount: 756 },
  { name: 'Sports', image: '/3d2b70d8-d0ab-4bcc-945a-e8bf07ef708a.14c788f6b0e2fd836a7bc3ce0bc4d4f4.webp', category: 'sports', itemCount: 543 },
]

export function Categories() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-lumina">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-gold text-sm font-medium tracking-wider">
              BROWSE
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-charcoal mt-2">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-charcoal hover:text-gold transition-colors"
          >
            View All
            <span>→</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              image={category.image}
              category={category.category}
              itemCount={category.itemCount}
            />
          ))}
        </div>
      </div>
    </section>
  )
}