// components/sections/Categories.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

const categories = [
  {
    name: 'Electronics',
    image: '/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79.webp',
    category: 'electronics',
    promo: 'Headphones, gadgets, accessories',
  },
  {
    name: 'Fashion',
    image: '/ed61305b-6a85-41ea-8a30-7751a1e92244.6b7780504e47e51afeccbd8f10a891e1.webp',
    category: 'fashion',
    promo: 'New styles and everyday essentials',
  },
  {
    name: 'Home',
    image: '/transparent-bg/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79-Photoroom.webp',
    category: 'home',
    promo: 'Furniture, decor, and more',
  },
  {
    name: 'Beauty',
    image: '/transparent-bg/2067c8ee-6f4a-4099-8f80-e5a84b988306.c483978f430cf4289faccbf6dd120434-Photoroom.webp',
    category: 'beauty',
    promo: 'Skincare, makeup, personal care',
  },
]

export function Categories() {
  return (
    <section className="bg-[#e3e6e6] py-4">
      <div className="container-lumina">
        <div className="rounded-sm bg-white p-4 shadow-soft">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-charcoal">
                Explore popular departments
              </h2>
              <p className="mt-1 text-sm text-charcoal/60">
                Shop the categories customers browse most.
              </p>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-bold text-[#007185] hover:text-gold-dark"
            >
              View all departments
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.category}
                href={`/products?category=${category.category}`}
                className="group rounded-sm border border-slate-200 bg-[#f7fafa] p-3 transition hover:border-[#febd69] hover:bg-white hover:shadow-soft"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-white">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-3 transition duration-300 group-hover:scale-105"
                  />
                </div>

                <h3 className="mt-3 text-base font-extrabold text-charcoal">
                  {category.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-charcoal/60">
                  {category.promo}
                </p>
                <span className="mt-3 inline-block text-sm font-bold text-[#007185] group-hover:text-gold-dark">
                  Shop now
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {categories.slice(0, 2).map((category) => (
            <Link
              key={category.category}
              href={`/products?category=${category.category}`}
              className="group grid overflow-hidden rounded-sm bg-white shadow-soft transition hover:shadow-hover sm:grid-cols-[0.85fr_1fr]"
            >
              <div className="relative min-h-52 bg-[#f7fafa]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain p-6 transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex items-center p-5">
                <div>
                  <p className="text-xs font-bold uppercase text-red-600">
                    Featured department
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold text-charcoal">
                    More to discover in {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/65">
                    {category.promo}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#007185] group-hover:text-gold-dark">
                    Browse {category.name}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
