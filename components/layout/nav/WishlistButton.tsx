'use client'

import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CountBadge } from '@/components/layout/nav/CountBadge'
import { useWishlist } from '@/context/WishlistContext'

export const WishlistButton = () => {
  const { itemCount } = useWishlist()
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative flex"
      onClick={() => router.push('/wishlist')}
    >
      <Heart className="w-5 h-5" />
      {itemCount > 0 && (
        <CountBadge count={itemCount} />
      )}
    </Button>
  )
}
