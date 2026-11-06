'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
// import { useRouter } from 'next/navigation'
import {
  Bell, X, Trash2, CheckCheck, AlertCircle,
} from 'lucide-react'
import { useNotifications, type Notification } from '@/hooks/useNotification'
import { NotificationSkeleton } from './NotificationSkeleton'
import { NotificationItem } from './NotificationItem'

export function Notifications() {
  // const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMutationError = useCallback((error: Error) => {
    setActionError(`That didn't work. Your change was undone.\n, ${error.message}`)
    if (errorTimer.current) clearTimeout(errorTimer.current)
    errorTimer.current = setTimeout(() => setActionError(null), 4000)
  }, [])

  useEffect(() => () => {
    if (errorTimer.current) clearTimeout(errorTimer.current)
  }, [])

  const {
    notifications,
    unreadCount,
    hasRead,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteOne,
    clearRead,
  } = useNotifications({ onMutationError: handleMutationError })

  const close = useCallback(() => setShowNotifications(false), [])

  // Close on Escape while the panel is open
  useEffect(() => {
    if (!showNotifications) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showNotifications, close])

  const handleSelect = useCallback(
    (n: Notification) => {
      if (!n.read) markAsRead(n._id)
      // close()
      // if (n.link) router.push(n.link)
    },
    [markAsRead]
    // [markAsRead, close, router]
  )

  console.log("READ NOTIFICATIONS", unreadCount)
  const iconButton =
    'p-1.5 text-border-dark hover:text-foreground hover:bg-surface rounded-lg transition-colors'

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications((v) => !v)}
        className="relative p-2 text-border-dark hover:text-foreground hover:bg-surface rounded-lg transition-colors"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={showNotifications}
        aria-haspopup="dialog"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-0 right-0 min-w-4 h-4 bg-warning text-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-10" onClick={close} aria-hidden="true" />

          <div
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-brand shadow-xl border border-border z-20 flex flex-col max-h-130"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-primary-light text-primary-dark rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    title="Mark all as read"
                    aria-label="Mark all as read"
                    className={iconButton}
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {hasRead && (
                  <button
                    onClick={() => clearRead()}
                    title="Clear read notifications"
                    aria-label="Clear read notifications"
                    className="p-1.5 text-border-dark hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={close} title="Close" aria-label="Close" className={iconButton}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Transient mutation error */}
            {actionError && (
              <div
                role="alert"
                className="px-4 py-2 text-xs text-danger bg-background border-b border-danger-light shrink-0"
              >
                {actionError}
              </div>
            )}

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <NotificationSkeleton />
              ) : error && notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <AlertCircle className="w-8 h-8 mb-3 text-danger" />
                  <p className="text-sm text-foreground">Couldn&apos;t load notifications</p>
                  <button
                    onClick={() => refetch()}
                    className="mt-3 text-sm font-medium text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-border-dark">
                  <Bell className="w-8 h-8 mb-3 opacity-30" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <ul>
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n._id}
                      notification={n}
                      onSelect={handleSelect}
                      onMarkRead={markAsRead}
                      onDelete={deleteOne}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}