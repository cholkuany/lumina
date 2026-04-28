// components/ui/CategoryCard.tsx
import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  name: string
  image: string
  category: string
  itemCount?: number
}

export function CategoryCard({ name, image, category, itemCount }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category}`} className="group">
      <div className="relative overflow-hidden rounded-brand aspect-4/5 bg-linen">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-charcoal/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-serif text-white text-xl font-semibold mb-1">
            {name}
          </h3>
          {itemCount && (
            <p className="text-white/80 text-sm">
              {itemCount} items
            </p>
          )}

          {/* Animated Arrow */}
          <div className="flex items-center gap-2 mt-3 text-white text-sm font-medium">
            <span>Explore</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}