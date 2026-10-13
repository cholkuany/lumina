import { Package, Heart } from 'lucide-react'
import { MenuLink } from './MenuLink'

export const QuickLinks = ({ setUserMenuOpen }: { setUserMenuOpen: (open: boolean) => void }) => {
  const close = () => setUserMenuOpen(false)

  return (
    <div className="border-t border-border-light p-2">
      <MenuLink href="/account/orders" icon={Package} onClick={close}>Track Order</MenuLink>
      <MenuLink href="/wishlist" icon={Heart} onClick={close}>Wishlist</MenuLink>
    </div>
  )
}