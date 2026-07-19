'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LoginUser } from '@/lib/types'
import { useSidebar } from '@/context/SidebarContext'
import {
  Folder, X, LayoutGrid, Box, ClipboardList,
  ShoppingCart, Users, Star, LogOut, Settings, CircleQuestionMark,
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth-client'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutGrid },
  { name: 'Products', href: '/admin/products', icon: Box, badge: null },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Purchases', href: '/admin/purchases', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Categories', href: '/admin/categories', icon: Folder },
]

const secondaryNavigation = [
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Help', href: '/admin/help', icon: CircleQuestionMark },
]

export function Sidebar({ user }: { user: LoginUser }) {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-text-primary/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border',
          'transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">

          {/* Logo + close button */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-text-primary tracking-wide">
                  LUMINA
                </span>
                <span className="block text-xs text-border-dark -mt-0.5">
                  Admin Panel
                </span>
              </div>
            </Link>

            {/* Close button — mobile only */}
            <button
              onClick={close}
              className="lg:hidden p-1.5 rounded-lg text-border-dark hover:text-text-primary hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="px-3 mb-2 text-xs font-semibold text-border-dark uppercase tracking-wider">
              Main Menu
            </p>

            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-brand text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-primary/70 hover:bg-surface hover:text-text-primary'
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-5 h-5 shrink-0',
                      active ? 'text-primary' : 'text-border-dark'
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                </Link>
              )
            })}

            <div className="pt-6">
              <p className="px-3 mb-2 text-xs font-semibold text-border-dark uppercase tracking-wider">
                Support
              </p>
              {secondaryNavigation.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-brand text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-primary/70 hover:bg-surface hover:text-text-primary'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'w-5 h-5 shrink-0',
                        active ? 'text-primary' : 'text-border-dark'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-brand bg-surface">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {user.name.split(' ').map((n) => n.charAt(0))}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-border-dark truncate">Administrator</p>
              </div>
              <button onClick={() => signOut({
                fetchOptions: {
                  onSuccess: () => redirect('/login')
                }
              })} className="p-1.5 text-border-dark hover:text-text-primary transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </aside>
    </>
  )
}
