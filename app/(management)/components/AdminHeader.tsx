'use client'

import { usePathname } from 'next/navigation'
import { useSidebar } from '@/context/SidebarContext'
import { Menu } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Notifications } from './notification/Notifications'

export function AdminHeader() {
  const pathname = usePathname()
  const { toggle } = useSidebar()

  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile menu/toggle */}
          <button
            onClick={toggle}
            className="lg:hidden p-2 -ml-1 rounded-lg text-border-dark hover:text-foreground hover:bg-surface transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Right -> Notifications */}
        <Notifications />
      </div>
    </header>
  )
}

const generateBreadcrumbs = (pathname: string) =>
  pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + arr.slice(0, index + 1).join('/'),
      // current: index === arr.length - 1,
    }))