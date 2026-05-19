'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { DBReview } from '@/lib/queries/get.reviews'
import {
  ActionType,
  // Resource,
  // ENDPOINT_MAP,
  RESOURCE_CONFIG,
  ResourceMap,
  ListResponse,
  // BaseEntity,
  ACTION_STATUS_MAP
} from '@/lib/types'

type MutationInput<R extends keyof ResourceMap> = {
  resource: R
  action: ActionType
  ids: string[]
}

type MutationContext<R extends keyof ResourceMap> = {
  previousData: ListResponse<ResourceMap[R]> | undefined
  queryKey: readonly string[]
}

export function useResourceMutation<R extends keyof ResourceMap>(options?: {
  onSuccess?: () => void
  onError?: (err: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, MutationInput<R>, MutationContext<R>>({
    mutationFn: async ({ action, ids, resource }) => {
      const { endpoint } = RESOURCE_CONFIG[resource]

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids, resource }),
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      return res.json()
    },

    // 🔥 Optimistic update
    onMutate: async ({ action, ids, resource }) => {
      const { queryKey } = RESOURCE_CONFIG[resource]
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<ListResponse<ResourceMap[R]>>(queryKey)

      if (!previousData) return { previousData: undefined, queryKey }

      const newStatus = ACTION_STATUS_MAP[action]

      const updatedItems = previousData.items.reduce<ResourceMap[R][]>((acc, item) => {
        if (!ids.includes(item.id)) {
          acc.push(item)
          return acc
        }

        // Drop item entirely on delete
        if (action === 'delete') return acc

        // Update status if this action maps to one
        acc.push(
          newStatus
            ? { ...item, status: newStatus }
            : item
        )

        return acc
      }, [])

      queryClient.setQueryData<ListResponse<ResourceMap[R]>>(queryKey, {
        ...previousData,
        items: updatedItems,
      })

      return { previousData, queryKey }
    },

    // ❌ rollback if failed
    onError: (err, _vars, context) => {
      if (context?.previousData !== undefined && context.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData)
      }
      options?.onError?.(err)
    },
    // ✅ Sync with server using config queryKey
    onSettled: (_data, _err, variables) => {
      const { queryKey } = RESOURCE_CONFIG[variables.resource]
      queryClient.invalidateQueries({ queryKey })
    },
    // ✅ sync with server
    onSuccess: () => {
      options?.onSuccess?.()
    },
  })
}