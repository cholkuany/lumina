'use client'

import { memo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  Star, User, ClipboardList, X, Check, AlertCircle, RotateCcw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Notification } from '@/hooks/useNotification'

const notificationIcon = {
  ORDER: { Icon: ClipboardList, className: 'bg-primary-light text-primary-dark' },
  REVIEW: { Icon: Star, className: 'bg-warning-light text-warning-dark' },
  USER: { Icon: User, className: 'bg-success text-success-dark' },
  SYSTEM: { Icon: AlertCircle, className: 'bg-danger-light text-danger-dark' },
  RETURN: { Icon: RotateCcw, className: 'bg-primary-light text-primary-dark' },
} as const


interface NotificationItemProps {
  notification: Notification
  onSelect: (n: Notification) => void
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}

export const NotificationItem = memo(function NotificationItem({
  notification: n,
  onSelect,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  // Fall back so an unknown server-side type can't crash the list
  const { Icon, className } = notificationIcon[n.type] ?? notificationIcon.SYSTEM

  return (
    <li
      className={cn(
        'flex items-start gap-1 pr-3 border-b border-border',
        'last:border-b-0 group transition-colors',
        n.read ? 'bg-white hover:bg-surface/50' : 'bg-primary/5 hover:bg-primary/10'
      )}
    >
      {/* Main (clickable) area */}
      <button
        type="button"
        onClick={() => onSelect(n)}
        className="flex flex-1 min-w-0 gap-3 pl-4 pr-1 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset"
      >
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
            className
          )}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-[13px]',
              n.read ? 'text-foreground/70' : 'text-foreground font-medium'
            )}
          >
            {n.message}
          </p>
          <p className="text-xs text-border-dark mt-0.5">
            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
          </p>
        </div>
      </button>

      {/* Actions: hover-revealed on pointer devices, always visible on touch, reachable by keyboard */}
      <div
        className={cn(
          'flex items-center gap-1 pt-3 shrink-0 transition-opacity',
          'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
          '[@media(hover:none)]:opacity-100'
        )}
      >
        {!n.read && (
          <button
            type="button"
            onClick={() => onMarkRead(n._id)}
            title="Mark as read"
            aria-label="Mark as read"
            className="p-1 text-border-dark hover:text-primary rounded transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(n._id)}
          title="Delete"
          aria-label="Delete notification"
          className="p-1 text-border-dark hover:text-red-500 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Unread indicator */}
      {!n.read && (
        <span
          className="w-2 h-2 bg-primary rounded-full shrink-0 mt-4.5"
          aria-label="Unread"
        />
      )}
    </li>
  )
})