'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/context/SidebarContext'
import { useNotifications } from '@/hooks/useNotification'
import {
  Star, Bell, User, ClipboardList,
  Menu, X, Trash2, CheckCheck, AlertCircle,
} from 'lucide-react'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/purchases': 'Purchases',
  '/admin/users': 'Users',
  '/admin/reviews': 'Reviews',
  '/admin/settings': 'Settings',
}

const notificationIcon = {
  ORDER: { icon: ClipboardList, className: 'bg-primary-100 text-primary-600' },
  REVIEW: { icon: Star, className: 'bg-amber-100 text-amber-600' },
  USER: { icon: User, className: 'bg-success-100 text-success-600' },
  SYSTEM: { icon: AlertCircle, className: 'bg-red-100 text-red-600' },
}

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { toggle } = useSidebar()
  const [showNotifications, setShowNotifications] = useState(false)

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteOne,
    clearRead,
  } = useNotifications()

  const title = Object.entries(pageTitles).find(
    ([path]) => pathname === path || (path !== '/admin' && pathname.startsWith(path))
  )?.[1] ?? 'Dashboard'

  const breadcrumbs = generateBreadcrumbs(pathname)

  const handleNotificationClick = async (id: string, link?: string) => {
    await markAsRead(id)
    setShowNotifications(false)
    if (link) router.push(link)
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="lg:hidden p-2 -ml-1 rounded-lg text-border-dark hover:text-text-primary hover:bg-surface transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop title + breadcrumbs */}
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
            <nav className="flex items-center gap-1.5 text-xs text-border-dark">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  {index > 0 && <span>/</span>}
                  <span className={cn(crumb.current && 'text-primary')}>
                    {crumb.name}
                  </span>
                </span>
              ))}
            </nav>
          </div>

          {/* Mobile title */}
          <h1 className="sm:hidden text-base font-semibold text-text-primary">
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-border-dark hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 bg-primary text-white text-[10px] 
                font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                {/* backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />

                <div className="absolute right-0 mt-2 w-96 bg-white rounded-brand shadow-xl border border-border z-20 flex flex-col max-h-130">

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text-primary">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Mark all read */}
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          title="Mark all as read"
                          className="p-1.5 text-border-dark hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      {/* Clear read */}
                      <button
                        onClick={clearRead}
                        title="Clear read notifications"
                        className="p-1.5 text-border-dark hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {/* Close */}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1.5 text-border-dark hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="overflow-y-auto flex-1">
                    {isLoading ? (
                      <div className="flex flex-col gap-3 p-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-8 h-8 bg-surface rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-surface rounded w-3/4" />
                              <div className="h-2 bg-surface rounded w-1/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-border-dark">
                        <Bell className="w-8 h-8 mb-3 opacity-30" />
                        <p className="text-sm">No new notifications</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const { icon: Icon, className } = notificationIcon[n.type]
                        return (
                          <div
                            key={n._id}
                            className={cn(
                              'flex gap-3 px-4 py-3 border-b border-border',
                              'last:border-b-0 group transition-colors',
                              n.read
                                ? 'bg-white hover:bg-surface/50'
                                : 'bg-primary/5 hover:bg-primary/10',
                              n.link && 'cursor-pointer'
                            )}
                            onClick={() => handleNotificationClick(n._id, n.link)}
                          >
                            {/* Icon */}
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center',
                              'justify-center shrink-0 mt-0.5',
                              className
                            )}>
                              <Icon className="w-4 h-4" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                'text-sm',
                                n.read ? 'text-text-primary/70' : 'text-text-primary font-medium'
                              )}>
                                {n.message}
                              </p>
                              <p className="text-xs text-border-dark mt-0.5">
                                {formatDistanceToNow(new Date(n.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              {!n.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(n._id)
                                  }}
                                  title="Mark as read"
                                  className="p-1 text-border-dark hover:text-primary rounded transition-colors"
                                >
                                  <CheckCheck className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteOne(n._id)
                                }}
                                title="Delete"
                                className="p-1 text-border-dark hover:text-red-500 rounded transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Unread dot */}
                            {!n.read && (
                              <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>

                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

const generateBreadcrumbs = (pathname: string) =>
  pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + arr.slice(0, index + 1).join('/'),
      current: index === arr.length - 1,
    }))