'use client'

import { useState } from 'react'

import { Resource, ActionType, ConfirmState } from '@/lib/types'

type UseConfirmActionOptions<R extends Resource> = {
  resource: R
  onConfirm: (params: { action: ActionType; ids: string[], resource: R }) => void
}

export function useConfirmAction<R extends Resource>({ resource, onConfirm }: UseConfirmActionOptions<R>) {
  const [state, setState] = useState<ConfirmState<R>>({
    open: false,
    type: 'approve',
    ids: [],
    resource,
  })

  const open = (type: ActionType, ids: string | string[]) => {
    setState({
      open: true,
      type,
      ids: Array.isArray(ids) ? ids : [ids],
      resource
    })
  }

  // Close modal
  const close = () => setState((prev) => ({ ...prev, open: false }))

  // Confirm action
  const confirm = () => {
    if (!state.ids.length || !state.open) return
    onConfirm({ action: state.type, ids: state.ids, resource: state.resource })
  }

  return { state, open, close, confirm }
}