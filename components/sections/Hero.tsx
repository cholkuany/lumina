import Link from 'next/link'
import Image from 'next/image'

import { TProduct } from '@/lib/types'
import { HeroCarousel } from './HeroCarousel'
import { HeaderBanner } from '../layout/nav/HeaderBanner'
import { ChevronRight } from 'lucide-react'

import { cn, formatPrice, getProductDiscount } from '@/lib/utils'
import { Fragment, ReactNode } from 'react'

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

export function Hero({ products }: { products: TProduct[] }) {
  const miniProducts = products.slice(0, 4)

  return (
    <section className="bg-[#e3e6e6]">
      <HeaderBanner />

      <div className="container-lumina py-4">
        <HeroCarousel products={products.slice(0, 5)} />

        <div className="relative z-10 mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <DisplayCard
            title="Shop by department"
            href="/categories"
            footerText="Browse all departments"
            showArrow
            bgColor="bg-[#e7f5ff]"
            imgBgColor="bg-[#f8fbff]"
            items={quickCards[0].items?.map(item => ({
              id: item.name,
              title: item.name,
              image: item.image,
              href: item.href,
            })) ?? []}
            renderItem={(item) => (
              <MiniGridItem
                {...item}
                imageClassName="object-cover transition duration-300 group-hover:scale-105"
                titleClassName="text-sm font-bold"
              />
            )}
          />

          <DisplayCard
            title="Today's Deals"
            href="/products?sort=sale"
            footerText="Explore more deals"
            bgColor="bg-[#fff1e6]"
            imgBgColor="bg-[#fffaf5]"
            items={products.slice(0, 4).map(product => ({
              id: product.id,
              title: product.name,
              image: product?.variants?.[0]?.images?.[0]?.secure_url,
              href: `/products/${product.id}`,
            }))}
            renderItem={(item) => (
              <MiniGridItem
                {...item}
                imageClassName="object-contain p-3 transition duration-300 group-hover:scale-105"
                titleClassName="line-clamp-2 text-xs font-semibold leading-snug"
              />
            )}
          />

          <DisplayCard
            title="Best Sellers"
            href="/products?sort=popular"
            footerText="Shop best sellers"
            bgColor="bg-[#eef7e8]"
            imgBgColor="bg-[#fbfef8]"
            items={products.slice(0, 4).map(product => ({
              id: product.id,
              title: product.name,
              image: product?.variants?.[0]?.images?.[0]?.secure_url,
              href: `/products/${product.id}`,
            }))}
            renderItem={(item) => (
              <MiniGridItem
                {...item}
                imageClassName="object-contain p-3 transition duration-300 group-hover:scale-105"
                titleClassName="line-clamp-2 text-xs font-semibold leading-snug"
              />
            )}
          />

          <DisplayCard
            title="New Arrivals"
            href="/products?sort=newest"
            footerText="See what just landed"
            bgColor="bg-[#f3ecff]"
            imgBgColor="bg-[#fcf9ff]"
            items={products.slice(0, 4).map(product => ({
              id: product.id,
              title: product.name,
              image: product?.variants?.[0]?.images?.[0]?.secure_url,
              href: `/products/${product.id}`,
            }))}

            renderItem={(item) => (
              <MiniGridItem
                {...item}
                imageClassName="object-contain p-3 transition duration-300 group-hover:scale-105"
                titleClassName="line-clamp-2 text-xs font-semibold leading-snug"
              />
            )}
          />
        </div>

        {miniProducts.length > 0 && (
          <div className="mt-4 rounded-sm bg-white p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[#007185]">
                  Featured picks for you
                </p>
                <h2 className="text-xl font-extrabold text-charcoal">
                  Popular products right now
                </h2>
              </div>
              <Link href="/products" className="text-sm font-bold text-[#007185] hover:text-gold-dark">
                Shop all
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {miniProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group rounded-sm border border-slate-200 p-3 transition hover:border-[#febd69] hover:shadow-soft"
                >
                  <div className="relative h-40 overflow-hidden rounded-sm bg-[#f7fafa]">
                    {getProductDiscount(product) && (
                      <span className="absolute left-2 top-2 z-10 rounded-sm bg-red-600 px-2.5 py-1 text-[10px] font-extrabold text-white">
                        {getProductDiscount(product)}% OFF
                      </span>
                    )}

                    <Image
                      src={product?.variants?.[0]?.images?.[0]?.secure_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-4 transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-sm font-bold text-charcoal">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-base font-extrabold text-[#b12704]">
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

interface DisplayCardProps<T extends { id: string }> {
  title: string
  href: string
  items: T[]
  footerText: string

  bgColor?: string
  imgBgColor?: string
  showArrow?: boolean

  renderItem: (item: T & { imgBgColor?: string }) => ReactNode

  gridClassName?: string
}

export function DisplayCard<T extends { id: string }>({
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
    <div className={`rounded-sm ${bgColor} p-4 shadow-soft`}>
      <Link
        href={href}
        className="group flex items-center justify-between"
      >
        <h2 className="text-lg font-extrabold text-charcoal">
          {title}
        </h2>

        {showArrow && (
          <ChevronRight className="h-5 w-5 text-[#007185] transition group-hover:text-gold-dark" />
        )}
      </Link>

      <div className={cn('mt-3 grid gap-3', gridClassName)}>
        {items.map((item) => (
          <Fragment key={item.id}>
            {renderItem({ ...item, imgBgColor })}
          </Fragment>
        ))}
      </div>

      <Link
        href={href}
        className="mt-4 inline-block text-sm font-bold text-[#007185] hover:text-gold-dark"
      >
        {footerText}
      </Link>
    </div>
  )
}

const MiniGridItem = ({
  href,
  image,
  imageClassName,
  imgBgColor = 'bg-gray-300',
  title,
  titleClassName,
}: {
  id: string
  href: string
  title: string
  image?: string
  imageClassName: string
  imgBgColor?: string
  titleClassName: string
}) => {
  return (
    <Link
      href={href}
      className="group block"
    >
      <div className={`relative h-28 overflow-hidden rounded-sm ${imgBgColor}`}>
        <Image
          src={image || '/placeholder-product.jpg'}
          alt={title}
          fill
          sizes="(max-width: 768px) 45vw, 160px"
          className={imageClassName}
        />
      </div>

      <p className={cn('mt-2 text-charcoal', titleClassName)}>
        {title}
      </p>
    </Link>
  )
}
