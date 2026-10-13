'use client'

import { Heart } from 'lucide-react'
// import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CountBadge } from '@/components/layout/nav/CountBadge'
import { useAddToWishlist, useWishlistItems, useRemoveFromWishlist, useWishlistItemCount } from '@/stores/wishlist/wishlist.selectors'
import { cn } from '@/lib/utils'
import type { TProduct } from '@/lib/types'
import { useRouter } from 'next/navigation'

export const WishlistButtonIcon = () => {
  const itemsCount = useWishlistItemCount()
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative flex"
      onClick={() => router.push('/wishlist')}
      aria-label={itemsCount > 0 ? `View wishlist, ${itemsCount} items` : 'View wishlist'}
    >
      <Heart className="w-5 h-5" aria-hidden="true" />
      {itemsCount > 0 && (
        <CountBadge count={itemsCount} />
      )}
    </Button>
  )
}

export const WishlistButton = (
  {
    isCompact = false,
    product,
  }: {
    isCompact?: boolean
    product: TProduct
  }) => {
  const addItemToWishlist = useAddToWishlist()
  const removeItem = useRemoveFromWishlist()
  const wishlistItems = useWishlistItems()
  const isInWishlist = wishlistItems.some((item) => item.product.id === product.id)

  return (
    <button
      className={cn(
        'absolute right-2 top-2 rounded-full bg-white/90 backdrop-blur-sm transition-all',
        isCompact ? 'p-1.5' : 'p-2',
      )}
      onClick={(e) => {
        e.preventDefault()
        if (isInWishlist) {
          removeItem(product.id)
        } else {
          addItemToWishlist(product)
        }
      }}
    >
      <Heart
        className={cn(isCompact ? 'h-4 w-4' : 'h-5 w-5')}
        fill={isInWishlist ? '#B8956C' : 'none'}
        stroke={isInWishlist ? '#B8956C' : 'currentColor'}
      />
    </button>
  )
}