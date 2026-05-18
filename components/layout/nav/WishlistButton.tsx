'use client'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export const WishlistButton = () => {
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="flex"
      onClick={() => router.push('/wishlist')}
    >
      <Heart className="w-5 h-5" />
    </Button>
  )
}
