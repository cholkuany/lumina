'use client'

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Notification {
  _id: string
  type: 'ORDER' | 'REVIEW' | 'USER' | 'SYSTEM'
  message: string
  read: boolean
  link?: string
  createdAt: string
}

interface NotificationsResponse {
  notifications: Notification[]
  count: number
}

// Query key
export const notificationKeys = {
  all: ['notifications'] as const,
}

// Fetch function
async function fetchNotifications(): Promise<NotificationsResponse> {
  const res = await fetch('/api/notifications')
  if (!res.ok) throw new Error('Failed to fetch notifications')
  return res.json()
}

export function useNotifications() {
  const queryClient = useQueryClient()

  // Polling every 30s
  const { data, isLoading, error } = useQuery({
    queryKey: notificationKeys.all,
    queryFn: fetchNotifications,
    // refetchInterval: 300_000,
    refetchIntervalInBackground: false,
    // staleTime: 200_000,
  })

  // Shared optimistic update helper
  const updateCache = useCallback(
    (updater: (prev: Notification[]) => Notification[]) => {
      queryClient.setQueryData<NotificationsResponse>(
        notificationKeys.all,
        (old) => {
          if (!old) return old
          const updated = updater(old.notifications)
          return {
            notifications: updated,
            count: updated.filter((n) => !n.read).length,
          }
        }
      )
    },
    [queryClient]
  )

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/notifications/${id}`, { method: 'PATCH' }).then((r) => r.json()),

    onMutate: (id) => {
      // snapshot for rollback
      const previous = queryClient.getQueryData(notificationKeys.all)
      updateCache((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      )
      return { previous }
    },

    onError: (_err, _id, context) => {
      // rollback to snapshot
      queryClient.setQueryData(notificationKeys.all, context?.previous)
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      fetch('/api/notifications', { method: 'PATCH' }).then((r) => r.json()),

    onMutate: () => {
      const previous = queryClient.getQueryData(notificationKeys.all)
      updateCache((prev) => prev.map((n) => ({ ...n, read: true })))
      return { previous }
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(notificationKeys.all, context?.previous)
    },
  })

  const deleteOneMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/notifications/${id}`, { method: 'DELETE' }).then((r) => r.json()),

    onMutate: (id) => {
      const previous = queryClient.getQueryData(notificationKeys.all)
      updateCache((prev) => prev.filter((n) => n._id !== id))
      return { previous }
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(notificationKeys.all, context?.previous)
    },
  })

  const clearReadMutation = useMutation({
    mutationFn: () =>
      fetch('/api/notifications', { method: 'DELETE' }).then((r) => r.json()),

    onMutate: () => {
      const previous = queryClient.getQueryData(notificationKeys.all)
      updateCache((prev) => prev.filter((n) => !n.read))
      return { previous }
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(notificationKeys.all, context?.previous)
    },
  })

  const notifications = data?.notifications ?? []

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    isLoading,
    error: error?.message ?? null,
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    deleteOne: (id: string) => deleteOneMutation.mutate(id),
    clearRead: () => clearReadMutation.mutate(),
  }
}