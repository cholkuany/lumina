import Link from 'next/link'
import Image from 'next/image'

import { Product } from '@/lib/types'
// import { ProductCard } from '../ui/ProductCard'
import { HeroCarousel } from './HeroCarousel'
import { HeaderBanner } from '../layout/nav/HeaderBanner'
import { ChevronRight } from 'lucide-react'

import { cn, formatPrice } from '@/lib/utils'
import { ReactNode } from 'react'

const quickCards = [
  {
    title: 'Shop by Category',
    subtitle: 'Explore top departments',
    href: '/categories',
    items: [
      {
        name: 'Electronics',
        image: '/transparent-bg/21383084_en_front_800-Photoroom.webp',
        href: '/products?category=electronics'
      },
      {
        name: 'Fashion',
        image: '/transparent-bg/ed61305b-6a85-41ea-8a30-7751a1e92244.6b7780504e47e51afeccbd8f10a891e1-Photoroom.webp',
        href: '/products?category=fashion'
      },
      {
        name: 'Home',
        image: '/transparent-bg/3c4ea480-8ca8-4fdc-b7d9-f8cc159c8528.8ff8aabfc8ad54b3201bb0b9002e1f79-Photoroom.webp',
        href: '/products?category=home'
      },
      {
        name: 'Beauty',
        image: '/transparent-bg/2067c8ee-6f4a-4099-8f80-e5a84b988306.c483978f430cf4289faccbf6dd120434-Photoroom.webp',
        href: '/products?category=beauty'
      },
    ],
  },
  {
    title: 'Today&apos;s Deals',
    subtitle: 'Limited-time savings',
    href: '/sale',
  },
  {
    title: 'Best Sellers',
    subtitle: 'Customer favorites',
    href: '/products?sort=popular',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh products this week',
    href: '/products?sort=newest',
  },
]

export function getDiscount(product?: Product) {
  if (!product?.variants?.[0].originalPrice || !product?.variants?.[0].price) return null

  const price = Number(product.variants?.[0].price)
  const original = Number(product.variants?.[0].originalPrice)
  if (!original || original <= price) return null

  return Math.round(((original - price) / original) * 100)
}

export function Hero({ products }: { products: Product[] }) {
  // const featured = products[0]
  const miniProducts = products.slice(0, 4)

  return (
    <section className="bg-linen">
      {/* Top marketplace strip */}
      <HeaderBanner />

      <div className="container-lumina py-5">
        {/* Big banner hero */}
        <HeroCarousel products={products.slice(0, 5)} />

        {/* Amazon-style merchandising cards */}
        <div className="relative z-10 mt-5 gap-5 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {/* Category collage card */}
          <DisplayCard
            title="Shop by category"
            href="/categories"
            footerText="Browse all departments →"
            showArrow
            bgColor="bg-white"
            imgBgColor='bg-red-400'
            items={quickCards[0].items?.map(item => ({
              id: item.name,
              title: item.name,
              image: item.image,
              href: item.href,
            })) ?? []}
            renderItem={CategoryGridItem}
          />

          {/* Deals card */}
          <DisplayCard
            title="Today's Deals"
            href="/deals"
            footerText="Explore more →"
            bgColor="bg-blue-300"
            imgBgColor='bg-white'
            items={products.slice(0, 4).map(product => ({
              id: product.id,
              title: product.name,
              image: product?.variants?.[0]?.images?.[0]?.secure_url,
              href: `/products/${product.id}`,
            }))}
            renderItem={ProductGridItem}
          />

          {/* Best sellers card */}
          <DisplayCard
            title="Best Sellers"
            href="/products?sort=popular"
            footerText="Explore more →"
            bgColor="bg-blue-600"
            imgBgColor='bg-white'
            items={products.slice(0, 4).map(product => ({
              id: product.id,
              title: product.name,
              image: product?.variants?.[0]?.images?.[0]?.secure_url,
              href: `/products/${product.id}`,
            }))}
            renderItem={ProductGridItem}
          />

          {/* New arrivals card */}
          <DisplayCard
            title="New Arrivals"
            href="/products?sort=newest"
            footerText="Explore more →"
            bgColor="bg-green-200"
            imgBgColor='bg-white'
            items={products.slice(0, 4).map(product => ({
              id: product.id,
              title: product.name,
              image: product?.variants?.[0]?.images?.[0]?.secure_url,
              href: `/products/${product.id}`,
            }))}

            renderItem={ProductGridItem}
          />
        </div>

        {/* Mini product row below cards */}
        {miniProducts.length > 0 && (
          <div className="mt-5 rounded-[18px] bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gold-dark">
                  Featured picks
                </p>
                <h2 className="text-2xl font-extrabold text-charcoal">
                  Popular products right now
                </h2>
              </div>
              <Link href="/products" className="text-sm font-bold text-gold-dark hover:text-gold">
                Shop all →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {miniProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group rounded-xl border border-warm-gray-light p-3 transition hover:border-gold-light hover:shadow-soft"
                >
                  <div className="relative h-40 overflow-hidden rounded-lg bg-linen">
                    {getDiscount(product) && (
                      <span className="absolute left-2 top-2 z-10 rounded-full bg-charcoal px-2.5 py-1 text-[10px] font-extrabold text-white">
                        {getDiscount(product)}% OFF
                      </span>
                    )}

                    <Image
                      src={product?.variants?.[0]?.images?.[0]?.secure_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-sm font-bold text-charcoal">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-base font-extrabold text-charcoal">
                      {formatPrice(product.variants?.[0].price)}
                    </span>
                    {product.variants?.[0].originalPrice && (
                      <span className="text-xs text-charcoal/40 line-through">
                        {formatPrice(product.variants?.[0].originalPrice)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

interface DisplayCardProps<T> {
  title: string
  href: string
  items: T[]
  footerText: string

  bgColor?: string
  imgBgColor?: string
  showArrow?: boolean

  renderItem: (item: T) => ReactNode

  gridClassName?: string
}

export function DisplayCard<T>({
  title,
  href,
  items,
  footerText,
  bgColor = 'bg-white',
  imgBgColor = 'bg-gray-300',
  showArrow = false,
  gridClassName = "grid-cols-2",
  renderItem,
}: DisplayCardProps<T>) {
  return (
    <div className={`rounded-sm ${bgColor} p-5 shadow-soft`}>
      <Link
        href={href}
        className="group flex items-center justify-between"
      >
        <h2 className="text-xl font-extrabold text-charcoal">
          {title}
        </h2>

        {showArrow && (
          <ChevronRight className="h-5 w-5 text-gold transition group-hover:text-blue-600" />
        )}
      </Link>

      <div className={cn('mt-4 grid gap-3', gridClassName)}>
        {items.map((item) => renderItem({ ...item, imgBgColor }))}
      </div>

      <Link
        href={href}
        className="mt-4 inline-block text-sm font-extrabold text-gold-dark hover:text-gold"
      >
        {footerText}
      </Link>
    </div>
  )
}

const ProductGridItem = ({
  id, image, imgBgColor, title
}: {
  id: string
  title: string
  image: string
  imgBgColor?: string
}) => {
  return (
    <Link
      key={id}
      href={`/products/${id}`}
      className="group block"
    >
      <div className={`relative h-28 overflow-hidden rounded-sm ${imgBgColor}`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-3 transition duration-300 group-hover:scale-105"
        />
      </div>

      <p className="mt-2 line-clamp-2 text-xs font-bold text-charcoal">
        {title}
      </p>
    </Link>
  )
}

const CategoryGridItem = ({ id, title, image, href, imgBgColor = 'bg-gray-300', }: {
  id: string
  title: string
  image: string
  href: string
  imgBgColor?: string
}) => {
  return (
    <Link
      key={id}
      href={href}
      className="group block"
    >
      <div className={`relative h-28 overflow-hidden rounded ${imgBgColor}`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <p className="mt-2 text-sm font-bold text-charcoal">
        {title}
      </p>
    </Link>
  )
}