// app/categories/[slug]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { ChevronRight } from 'lucide-react'

type categoryData = {
  id: string,
  name: string,
  description: string,
  image: string,
  itemCount: number,
  subcategories: { name: string, slug: string, count: number, image: string }[],
  featuredProducts:
  {
    id: string,
    name: string,
    price: number,
    originalPrice?: number,
    image: string,
    description: string,
    rating: number,
    reviewCount: number,
    isSale?: boolean,
    isNewArrival?: boolean
  }[],
}

// Mock data - replace with actual data fetching
const categoriesData: Record<string, categoryData> = {
  electronics: {
    id: 'electronics',
    name: 'Electronics',
    description: 'Discover the latest gadgets, audio equipment, smart home devices, and more. Quality tech for modern living.',
    image: '/images/categories/electronics-hero.jpg',
    itemCount: 1250,
    subcategories: [
      { name: 'Headphones & Audio', slug: 'audio', count: 234, image: '/images/subcategories/audio.jpg' },
      { name: 'Smart Home', slug: 'smart-home', count: 189, image: '/images/subcategories/smart-home.jpg' },
      { name: 'Phones & Tablets', slug: 'phones-tablets', count: 312, image: '/images/subcategories/phones.jpg' },
      { name: 'Computers & Laptops', slug: 'computers', count: 267, image: '/images/subcategories/computers.jpg' },
      { name: 'Cameras', slug: 'cameras', count: 145, image: '/images/subcategories/cameras.jpg' },
      { name: 'Gaming', slug: 'gaming', count: 203, image: '/images/subcategories/gaming.jpg' },
    ],
    featuredProducts: [
      {
        id: '1',
        name: 'Wireless Noise-Canceling Headphones',
        price: 249.99,
        originalPrice: 299.99,
        image: '/images/products/headphones.jpg',
        description: '',
        rating: 4.8,
        reviewCount: 234,
        isSale: true,
      },
      {
        id: '4',
        name: 'Smart Home Speaker',
        price: 129.99,
        originalPrice: 159.99,
        image: '/images/products/speaker.jpg',
        description: '',
        rating: 4.6,
        reviewCount: 312,
        isSale: true,
      },
      {
        id: '8',
        name: 'Bluetooth Earbuds',
        price: 99.99,
        image: '/images/products/earbuds.jpg',
        description: '',
        rating: 4.3,
        reviewCount: 278,
        isNewArrival: true,
      },
      {
        id: '9',
        name: '4K Ultra HD Smart TV',
        price: 599.99,
        image: '/images/products/tv.jpg',
        description: '',
        rating: 4.7,
        reviewCount: 156,
      },
    ],
  },
  fashion: {
    id: 'fashion',
    name: 'Fashion',
    description: 'Express yourself with our curated collection of clothing, footwear, and accessories for every occasion.',
    image: '/images/categories/fashion-hero.jpg',
    itemCount: 3420,
    subcategories: [
      { name: "Women's Clothing", slug: 'womens-clothing', count: 1245, image: '/images/subcategories/womens.jpg' },
      { name: "Men's Clothing", slug: 'mens-clothing', count: 987, image: '/images/subcategories/mens.jpg' },
      { name: 'Shoes', slug: 'shoes', count: 543, image: '/images/subcategories/shoes.jpg' },
      { name: 'Accessories', slug: 'accessories', count: 432, image: '/images/subcategories/accessories.jpg' },
      { name: 'Jewelry', slug: 'jewelry', count: 213, image: '/images/subcategories/jewelry.jpg' },
    ],
    featuredProducts: [
      {
        id: '2',
        name: 'Premium Leather Watch',
        price: 189.99,
        image: '/images/products/watch.jpg',
        description: '',
        rating: 4.9,
        reviewCount: 156,
        isNewArrival: true,
      },
      {
        id: '6',
        name: 'Running Shoes Pro',
        price: 159.99,
        image: '/images/products/shoes.jpg',
        description: '',
        rating: 4.8,
        reviewCount: 445,
        isNewArrival: true,
      },
    ],
  },
  home: {
    id: 'home',
    name: 'Home & Living',
    description: 'Transform your space with our selection of furniture, decor, bedding, and home essentials.',
    image: '/images/categories/home-hero.jpg',
    itemCount: 890,
    subcategories: [
      { name: 'Furniture', slug: 'furniture', count: 234, image: '/images/subcategories/furniture.jpg' },
      { name: 'Bedding', slug: 'bedding', count: 156, image: '/images/subcategories/bedding.jpg' },
      { name: 'Lighting', slug: 'lighting', count: 189, image: '/images/subcategories/lighting.jpg' },
      { name: 'Decor', slug: 'decor', count: 167, image: '/images/subcategories/decor.jpg' },
      { name: 'Kitchen', slug: 'kitchen', count: 144, image: '/images/subcategories/kitchen.jpg' },
    ],
    featuredProducts: [
      {
        id: '3',
        name: 'Organic Cotton Throw Blanket',
        price: 79.99,
        image: '/images/products/blanket.jpg',
        description: '',
        rating: 4.7,
        reviewCount: 89,
      },
      {
        id: '5',
        name: 'Minimalist Desk Lamp',
        price: 89.99,
        image: '/images/products/lamp.jpg',
        description: '',
        rating: 4.5,
        reviewCount: 67,
      },
      {
        id: '7',
        name: 'Ceramic Plant Pot Set',
        price: 49.99,
        image: '/images/products/pots.jpg',
        description: '',
        rating: 4.4,
        reviewCount: 123,
      },
    ],
  },
  beauty: {
    id: 'beauty',
    name: 'Beauty',
    description: 'Discover skincare, makeup, and personal care products from top brands.',
    image: '/images/categories/beauty-hero.jpg',
    itemCount: 756,
    subcategories: [
      { name: 'Skincare', slug: 'skincare', count: 234, image: '/images/subcategories/skincare.jpg' },
      { name: 'Makeup', slug: 'makeup', count: 189, image: '/images/subcategories/makeup.jpg' },
      { name: 'Haircare', slug: 'haircare', count: 156, image: '/images/subcategories/haircare.jpg' },
      { name: 'Fragrance', slug: 'fragrance', count: 98, image: '/images/subcategories/fragrance.jpg' },
      { name: 'Tools & Brushes', slug: 'tools', count: 79, image: '/images/subcategories/beauty-tools.jpg' },
    ],
    featuredProducts: [],
  },
}

interface CategoryPageProps {
  params: { slug: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categoriesData[params.slug]

  if (!category) {
    notFound()
  }

  return (
    <main className="pb-16">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-75 lg:min-h-100 flex items-center">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-charcoal/70 via-charcoal/50 to-transparent" />

        <div className="container-lumina relative z-10">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Breadcrumb
              items={[
                { label: 'Categories', href: '/categories' },
                { label: category.name },
              ]}
            />
          </div>

          <h1 className="font-serif text-4xl lg:text-5xl text-white font-semibold mb-4">
            {category.name}
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-6">
            {category.description}
          </p>
          <p className="text-white/60">
            {category.itemCount.toLocaleString()} products
          </p>
        </div>
      </section>

      <div className="container-lumina">
        {/* Subcategories */}
        <section className="py-12 lg:py-16">
          <h2 className="font-serif text-2xl text-charcoal mb-6">
            Shop by Subcategory
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/products?category=${category.id}&subcategory=${sub.slug}`}
                className="group text-center"
              >
                <div className="relative aspect-square rounded-brand overflow-hidden bg-linen mb-3">
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/40 transition-colors" />
                </div>
                <h3 className="font-medium text-charcoal text-sm group-hover:text-gold transition-colors">
                  {sub.name}
                </h3>
                <p className="text-warm-gray-dark text-xs">
                  {sub.count} items
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        {category.featuredProducts.length > 0 && (
          <section className="py-12 lg:py-16 border-t border-warm-gray-light">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-charcoal">
                Featured in {category.name}
              </h2>
              <Link
                href={`/products?category=${category.id}`}
                className="flex items-center gap-1 text-sm text-gold hover:underline"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {category.featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 lg:py-16">
          <div className="bg-linen rounded-brand p-8 lg:p-12 text-center">
            <h2 className="font-serif text-2xl lg:text-3xl text-charcoal mb-4">
              Explore All {category.name}
            </h2>
            <p className="text-warm-gray-dark mb-6 max-w-lg mx-auto">
              Browse our complete collection with filters for price, brand, ratings, and more.
            </p>
            <Link href={`/products?category=${category.id}`}>
              <Button size="lg">
                Shop All {category.name}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

// Generate static params for all categories
export function generateStaticParams() {
  return Object.keys(categoriesData).map((slug) => ({
    slug,
  }))
}