import { ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

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
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center font-medium">
        {count}
      </span>
    </Button>
  )
}

