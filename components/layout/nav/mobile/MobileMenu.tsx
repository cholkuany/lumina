import { cn } from '@/lib/utils'
import { MobileUserSection } from './MobileUserSection'
import { MobileNavLinks } from './MobileNavLinks'
import { MobileAccountLinks } from './MobileAccountLinks'
import { LoginUser } from '@/lib/types'
import type { NavItem } from '../Navbar'

import Link from 'next/link'

import { Package, Heart } from 'lucide-react'

type MobileMenuProps = {
  open: boolean
  setOpen: (open: boolean) => void
  user: LoginUser | null
  firstName: string
  lastName: string
  navigation: NavItem[]
}
export const MobileMenu = ({ open, setOpen, user, firstName, lastName, navigation }: MobileMenuProps) => (
  < div className={
    cn("lg:hidden fixed inset-0 top-26.25 bg-ivory z-40 transition-transform duration-300",
      open ? "translate-x-0" : "-translate-x-full")
  } >
    <div className="container-lumina py-6 bg-ivory">
      <MobileUserSection
        user={user}
        firstName={firstName}
        lastName={lastName}
        close={() => setOpen(false)}
        setOpen={setOpen}
      />
      <MobileNavLinks navigation={navigation} setOpen={setOpen} />
      <MobileAccountLinks user={user} setOpen={setOpen} />
      <NavQuickLinks user={user} setOpen={setOpen} />
    </div>
  </div>
)

const NavQuickLinks = (
  { user, setOpen }: { user: LoginUser | null, setOpen: (open: boolean) => void }
) => {
  if (!user) return null

  return (
    <div className="mt-6 pt-6 border-t border-warm-gray-light">
      <div className="flex flex-col gap-1">
        <Link
          href="/account/orders"
          className="flex items-center gap-3 py-3 text-charcoal hover:text-gold transition-colors"
          onClick={() => setOpen(false)}
        >
          <Package className="w-5 h-5" />
          Track Order
        </Link>
        <Link
          href="/wishlist"
          className="flex items-center gap-3 py-3 text-charcoal hover:text-gold transition-colors"
          onClick={() => setOpen(false)}
        >
          <Heart className="w-5 h-5" />
          Wishlist
        </Link>
      </div>
    </div>
  )
}

