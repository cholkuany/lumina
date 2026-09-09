'use client'

import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CountBadge } from '@/components/layout/nav/CountBadge'
import { useWishlistItemCount } from '@/stores/wishlist/wishlist.selectors'

export const WishlistButton = () => {
  const itemsCount = useWishlistItemCount()
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative flex"
      onClick={() => router.push('/wishlist')}
    >
      <Heart className="w-5 h-5" />
      {itemsCount > 0 && (
        <CountBadge count={itemsCount} />
      )}
    </Button>
  )
}
