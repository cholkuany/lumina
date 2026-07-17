'use client'

import { ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CountBadge } from '@/components/layout/nav/CountBadge'

export const CartButton = ({ count }: { count: number }) => {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => router.push('/cart')}
    >
      <ShoppingBag className="w-5 h-5" />
      {count > 0 && <CountBadge count={count} />}
    </Button>
  )
}

