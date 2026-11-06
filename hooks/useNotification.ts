'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { NotificationType } from '@/lib/db/models/Notification'

export interface Notification {
  _id: string
  type: NotificationType
  message: string
  read: boolean
  link?: string
  createdAt: string
}

interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}

interface SuccessResponse {
  success: boolean
}

interface MarkReadResponse extends SuccessResponse {
  notification: Notification
}

interface UseNotificationsOptions {
  onMutationError?: (error: Error) => void
}

// ---------- Query keys ----------

export const notificationKeys = {
  all: ['notifications'] as const,
  mutations: ['notifications', 'mutation'] as const,
}

// ---------- API helpers ----------

async function request<T = unknown>(url: string, method?: 'PATCH' | 'DELETE'): Promise<T> {
  const res = await fetch(url, method ? { method } : undefined)
  if (!res.ok) throw new Error(`${method ?? 'GET'} ${url} failed (${res.status})`)
  return (res.status === 204 ? undefined : await res.json()) as T
}

const api = {
  list: () => request<NotificationsResponse>('/api/notifications'),
  markRead: (id: string) => request<MarkReadResponse>(`/api/notifications/${id}`, 'PATCH'),
  markAllRead: () => request<SuccessResponse>('/api/notifications', 'PATCH'),
  delete: (id: string) => request<SuccessResponse>(`/api/notifications/${id}`, 'DELETE'),
  clearRead: () => request<SuccessResponse>('/api/notifications', 'DELETE'),
}

// ---------- Cache helpers ----------

const withCount = (notifications: Notification[]): NotificationsResponse => ({
  notifications,
  unreadCount: notifications.filter((n) => !n.read).length,
})

/**
 * Generic optimistic mutation for the notifications cache:
 * cancel in-flight fetches -> snapshot -> apply update -> rollback on error
 * -> refetch once, after the last in-flight notification mutation settles.
 */
function useOptimisticMutation<TVariables = void, TData = unknown>(options: {
  mutationFn: (variables: TVariables) => Promise<TData>
  update: (notifications: Notification[], variables: TVariables) => Notification[]
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: notificationKeys.mutations,
    mutationFn: options.mutationFn,

    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all })

      const previous = queryClient.getQueryData<NotificationsResponse>(notificationKeys.all)

      queryClient.setQueryData<NotificationsResponse>(notificationKeys.all, (old) =>
        old ? withCount(options.update(old.notifications, variables)) : old
      )

      return { previous }
    },

    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.all, context.previous)
      }
      options.onError?.(error)
    },

    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: notificationKeys.mutations }) === 1) {
        return queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      }
    },
  })
}

// ---------- Hook ----------

export function useNotifications({ onMutationError }: UseNotificationsOptions = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: notificationKeys.all,
    queryFn: api.list,
    refetchInterval: 300_000,
    refetchIntervalInBackground: false,
    staleTime: 250_000,
  })

  const markAsRead = useOptimisticMutation<string>({
    mutationFn: api.markRead,
    update: (list, id) => list.map((n) => (n._id === id ? { ...n, read: true } : n)),
    onError: onMutationError,
  })

  const markAllAsRead = useOptimisticMutation({
    mutationFn: api.markAllRead,
    update: (list) => list.map((n) => ({ ...n, read: true })),
    onError: onMutationError,
  })

  const deleteOne = useOptimisticMutation<string>({
    mutationFn: api.delete,
    update: (list, id) => list.filter((n) => n._id !== id),
    onError: onMutationError,
  })

  const clearRead = useOptimisticMutation({
    mutationFn: api.clearRead,
    update: (list) => list.filter((n) => !n.read),
    onError: onMutationError,
  })

  const notifications = useMemo(() => data?.notifications ?? [], [data])
  const unread = useMemo(() => data?.unreadCount ?? 0, [data])

  return {
    notifications,
    unreadCount: unread,
    hasRead: notifications.length > unread,
    isLoading,
    error: error?.message ?? null,
    refetch,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    deleteOne: deleteOne.mutate,
    clearRead: clearRead.mutate,
  }
}