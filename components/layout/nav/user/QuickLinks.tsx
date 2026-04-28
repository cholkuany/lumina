import Link from 'next/link'
import { Package, Heart } from 'lucide-react'

export const QuickLinks = ({ setUserMenuOpen }: { setUserMenuOpen: (open: boolean) => void }) => (
  <div className="p-2 border-t border-warm-gray-light">
    <Link
      href="/account/orders"
      onClick={() => setUserMenuOpen(false)}
      className="flex items-center gap-3 px-3 py-2.5 text-sm text-charcoal hover:bg-linen hover:text-gold rounded-lg transition-colors"
    >
      <Package className="w-4 h-4" />
      Track Order
    </Link>
    <Link
      href="/wishlist"
      onClick={() => setUserMenuOpen(false)}
      className="flex items-center gap-3 px-3 py-2.5 text-sm text-charcoal hover:bg-linen hover:text-gold rounded-lg transition-colors"
    >
      <Heart className="w-4 h-4" />
      Wishlist
    </Link>
  </div>)