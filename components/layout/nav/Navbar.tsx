// 'use client'

// import { useState } from 'react'

// // Custom Hooks
// import { useLoggedInUser } from '@/hooks/useLoggedInUser'
// import { useCart } from '@/context/CartContext'
// import { Category, useCategories } from '@/hooks/useCategories'

// import { DesktopNavigation } from './DesktopNavigation'
// import { MobileMenu } from './mobile/MobileMenu'
// import { MobileMenuToggle } from './MobileMenuToggle'
// import { NavbarActions } from './NavbarAction'
// import { HeaderBanner } from './HeaderBanner'
// import { Logo } from './Logo'


// export type NavbarItem = {
//   name: string
//   href: string
//   children?: Category[]
// }

// export function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const { itemCount } = useCart()
//   const { user, firstName, lastName } = useLoggedInUser()
//   const { data } = useCategories(false)

//   const navigation: NavbarItem[] = [
//     { name: 'Home', href: '/' },
//     {
//       name: 'Categories',
//       href: '/categories',
//       children: []
//     },
//     { name: 'Deals', href: '/products?filter=sale' },
//     { name: 'New Arrivals', href: '/products?filter=new' },
//   ]

//   let categories: Category[] = []
//   if (data) {
//     categories = data.categories
//     if (categories.length > 0) {
//       navigation[1].children = categories
//     }
//   }
//   console.log('All categories:', categories)

//   return (
//     <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-warm-gray-light">
//       <HeaderBanner />

//       <nav className="container-lumina">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           <MobileMenuToggle open={mobileOpen} setOpen={setMobileOpen} />
//           <Logo />
//           <DesktopNavigation categories={navigation[1].children || []} />
//           {/* <DesktopNavigationWrapper navigation={navigation} /> */}
//           <NavbarActions
//             user={user}
//             firstName={firstName}
//             lastName={lastName}
//             itemCount={itemCount}
//           />
//         </div>
//       </nav>

//       <MobileMenu
//         open={mobileOpen}
//         setOpen={setMobileOpen}
//         user={user}
//         firstName={firstName}
//         lastName={lastName}
//         categories={categories}
//       />
//     </header>
//   )
// }

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

  const navigation: NavItem[] = [
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
          <DesktopNavigationWrapper navigation={navigation} />
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
        navigation={navigation}
      />
    </header>
  )
}
