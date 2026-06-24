// components/sections/Categories.tsx
import Link from 'next/link'
// import { CategoryCard } from '@/components/ui/CategoryCard'

import Image from 'next/image'

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
    <section className="bg-linen py-5">
      <div className="container-lumina">
        <div className="grid gap-5 lg:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.category}
              href={`/products?category=${category.category}`}
              className="group overflow-hidden rounded-[20px] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-hover"
            >
              <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-65 bg-linen">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center p-6 md:p-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">
                      Category spotlight
                    </p>
                    <h3 className="mt-3 font-serif text-4xl text-charcoal">
                      {category.name}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-charcoal/65">
                      {category.promo}
                    </p>
                    <span className="mt-5 inline-block text-sm font-extrabold text-gold-dark group-hover:text-gold">
                      Shop now →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// export function Categories() {
//   return (
//     <section className="py-16 lg:py-24">
//       <div className="container-lumina">
//         {/* Header */}
//         <div className="flex items-end justify-between mb-10">
//           <div>
//             <span className="text-gold text-sm font-medium tracking-wider">
//               BROWSE
//             </span>
//             <h2 className="font-serif text-3xl lg:text-4xl text-charcoal mt-2">
//               Shop by Category
//             </h2>
//           </div>
//           <Link
//             href="/categories"
//             className="hidden sm:flex items-center gap-2 text-sm font-medium text-charcoal hover:text-gold transition-colors"
//           >
//             View All
//             <span>→</span>
//           </Link>
//         </div>

//         {/* Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
//           {categories.map((category) => (
//             <CategoryCard
//               key={category.name}
//               name={category.name}
//               image={category.image}
//               category={category.category}
//               itemCount={category.itemCount}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }