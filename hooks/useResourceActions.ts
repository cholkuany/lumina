'use client'

import { useResourceMutation } from '@/hooks/useResourceMutation'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { Resource } from '@/lib/types'

export function useResourceActions(resource: Resource, setSelectedProducts: (val: string[]) => void) {
  const mutation = useResourceMutation<Resource>({
    onSuccess: () => {
      confirm.close()
      setSelectedProducts([])
    },
  })

  const confirm = useConfirmAction<Resource>({
    resource,
    onConfirm: ({ action, ids, resource }) => {
      mutation.mutate({ action, ids, resource })
    },
  })

  return { mutation, confirm }
}
