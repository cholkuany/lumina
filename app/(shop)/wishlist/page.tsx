// app/wishlist/page.tsx
'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/lib/types'

export default function WishlistPage() {
  const { state, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  console.log('wishlist state', state)
  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    removeItem(product.id)
  }

  const handleAddAllToCart = () => {
    state.items.forEach(item => {
      addItem(item.product, 1)
    })
    clearWishlist()
  }

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />
      </div>

      <div className="container-lumina">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal">
              My Wishlist
            </h1>
            <p className="text-warm-gray-dark mt-1">
              {state.items.length} {state.items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {state.items.length > 0 && (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={clearWishlist}>
                Clear All
              </Button>
              <Button onClick={handleAddAllToCart}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add All to Cart
              </Button>
            </div>
          )}
        </div>

        {state.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-warm-gray-light rounded-brand overflow-hidden group"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.product.id}`}
                  className="relative aspect-square block bg-linen overflow-hidden"
                >
                  <Image
                    src={item.product.variants[0].images[0].secure_url}
                    alt={item.product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      removeItem(item.product.id)
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full 
                               hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Badges */}
                  {item.product.isSale && (
                    <span className="absolute top-3 left-3 bg-gold text-white text-xs px-2 py-1 rounded-full">
                      SALE
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-medium text-charcoal text-sm mb-1 line-clamp-2 hover:text-gold transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-semibold text-charcoal">
                      {formatPrice(item.product.price)}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-warm-gray-dark line-through">
                        {formatPrice(item.product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {item.product.stockCount ? (
                    <p className="text-xs text-green-600 mb-3">In Stock</p>
                  ) : (
                    <p className="text-xs text-red-500 mb-3">Out of Stock</p>
                  )}

                  {/* Add to Cart */}
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handleAddToCart(item.product)}
                    disabled={!item.product.stockCount}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Wishlist */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-linen rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-warm-gray-dark" />
            </div>
            <h2 className="font-serif text-2xl text-charcoal mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-warm-gray-dark mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon on any product.
              They&apos;ll appear here for easy access later.
            </p>
            <Link href="/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}