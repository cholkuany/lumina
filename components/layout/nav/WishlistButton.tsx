'use client'

import { useLoggedInUser } from '@/hooks/useLoggedInUser'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CountBadge } from '@/components/layout/nav/CountBadge'
import { useAddToWishlist, useWishlistItems, useRemoveFromWishlist, useWishlistItemCount } from '@/stores/wishlist/wishlist.selectors'
import { cn } from '@/lib/utils'
import type { TProduct } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
  const router = useRouter()
  const user = useLoggedInUser()

  const addItemToWishlist = useAddToWishlist()
  const removeItem = useRemoveFromWishlist()
  const wishlistItems = useWishlistItems()
  const isInWishlist = wishlistItems.some((item) => item.product.id === product.id)

  async function request(method: 'POST' | 'DELETE', body: Record<string, string | string[]>) {
    const res = await fetch('/api/wishlist', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return res.json()
  }

  const addToList = () => request('POST', { product: product.id })
  const removeFromList = () => request('DELETE', { products: [product.id] })

  const handleWishlist = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user.user) router.push('/login')

    if (isInWishlist) {
      removeItem(product.id) // optimistic (removal)
      toast.promise(removeFromList(), {
        loading: 'Removing from wishlist...',
        success: 'Removed from wishlist',
        error: () => {
          addItemToWishlist(product) // on failure: rollback
          return 'Could not remove from wishlist.'
        }
      })
    } else {
      addItemToWishlist(product) // optimistic (add)
      toast.promise(addToList(), {
        loading: 'Adding to wishlist',
        success: 'Added to wishlist',
        error: () => {
          removeItem(product.id) // on failure: rollback
          return 'Could not add to wishlist.'
        }
      })
    }
  }

  return (
    <button
      className={cn(
        'absolute right-2 top-2 rounded-full bg-surface backdrop-blur-sm transition-all duration-200',
        isCompact ? 'p-1.5' : 'p-2',
        isInWishlist && user?.user ? 'border-danger bg-danger-light' : 'border-border-light hover:border-border'
      )}

      onClick={handleWishlist}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-colors',
          isInWishlist && user?.user ? 'fill-danger text-danger' : 'text-muted'
        )}
      />
    </button>
  )
}