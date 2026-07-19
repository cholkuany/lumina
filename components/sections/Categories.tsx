import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const categories = [
  { name: 'Electronics', image: '/electronics-icon.png', slug: 'electronics', color: '#3B82F6' }, // primary
  { name: 'Fashion', image: '/fashion-icon.png', slug: 'fashion', color: '#EC4899' }, // Pink
  { name: 'Groceries', image: '/grocery-icon.png', slug: 'groceries', color: '#22C55E' }, // success
  { name: 'Beauty', image: '/beauty-icon.png', slug: 'beauty', color: '#A855F7' }, // Violet
  { name: 'Sports', image: '/sports-icon.png', slug: 'sports', color: '#F97316' }, // Orange
  { name: 'Toys', image: '/toys-icon.png', slug: 'toys', color: '#FACC15' }, // Yellow
  { name: 'Furniture', image: '/furniture-icon.png', slug: 'furniture', color: '#8D6E63' }, // Walnut
];

export function Categories() {
  return (
    <section className="bg-[#f6f6ba] py-14 sm:py-20">
      <div className="container-lumina">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="mt-2 text-xl font-black tracking-[-.045em] text-[#172a22] sm:text-3xl">Categories</h2>
          <Link
            href="/categories"
            className="group hidden items-center gap-2 text-sm font-black text-[#172a22] sm:flex capitalize">
            View all
            <ArrowUpRight className="h-4 w-4 group-hover:scale-110" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3 lg:grid-cols-8 lg:gap-5">
          {categories.map((category) => (
            <div key={category.slug} className="flex flex-col items-center gap-2">
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-full p-0.5 sm:p-2"
                style={{ backgroundColor: category.color }}
              >
                <div className="relative aspect-square w-20 h-20">
                  <Image src={category.image ?? '/grocery.svg'}
                    alt={category.name}
                    fill sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-3 transition duration-500 group-hover:scale-110 group-hover:-rotate-2" />
                </div>
              </Link>
              <div className="flex items-center justify-center">
                <h3 className="mt-1 text-sm font-black tracking-tight text-[#172a22] sm:text-xl">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
