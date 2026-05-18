'use client'

import { useState } from 'react'
import { useLoggedInUser } from '@/hooks/useLoggedInUser'
import { useCart } from '@/context/CartContext'
import { NestedCategory, useCategories } from '@/hooks/useCategories'
import { DesktopNavigationWrapper } from './DesktopNavigation'
import { MobileMenu } from './mobile/MobileMenu'
import { MobileMenuToggle } from './MobileMenuToggle'
import { NavbarActions } from './NavbarAction'
import { HeaderBanner } from './HeaderBanner'
import { Logo } from './Logo'

export type NavItem = {
  name: string
  href: string
  children?: NestedCategory[]
}

export function Navbar() {
  const [toggleMobileMenu, setToggleMobileMenu] = useState(false)
  const { itemCount } = useCart()
  const { user, firstName, lastName } = useLoggedInUser()
  const { data } = useCategories(false)

  const navigationItems: NavItem[] = [
    { name: 'Home', href: '/' },
    {
      name: 'Categories',
      href: '/categories',
      children: data?.categories ?? [],
    },
    { name: 'Deals', href: '/products?filter=sale' },
    { name: 'New Arrivals', href: '/products?filter=new' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-warm-gray-light">
      <HeaderBanner />

      <nav className="container-lumina">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <MobileMenuToggle open={toggleMobileMenu} setOpen={setToggleMobileMenu} />
          <Logo />
          <DesktopNavigationWrapper navigation={navigationItems} />
          <NavbarActions
            user={user}
            firstName={firstName}
            lastName={lastName}
            itemCount={itemCount}
          />
        </div>
      </nav>

      <MobileMenu
        open={toggleMobileMenu}
        setOpen={setToggleMobileMenu}
        user={user}
        firstName={firstName}
        lastName={lastName}
        navigation={navigationItems}
      />
    </header>
  )
}
