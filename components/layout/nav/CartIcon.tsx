'use client'

import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CountBadge } from '@/components/layout/nav/CountBadge'

export const CartIcon = ({ count, variant = 'full' }: { count: number, variant?: 'compact' | 'full' }) => {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="xxxl"
      className="relative flex items-center gap-1.5 text-background px-1 py-0.5 hover:text-ink"
      onClick={() => router.push('/cart')}
      aria-label={count > 0 ? `View cart, ${count} items` : 'View cart'}
    >
      <span className='relative'>
        <ShoppingCart className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
        {count > 0 && <CountBadge count={count} />}
      </span>
      {variant === 'full' && <span className="text-[13px] font-semibold">Cart</span>}
    </Button>
  )
}