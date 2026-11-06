'use server'

import { revalidatePath } from 'next/cache'
import { processReturn } from '@/lib/queries/return.queries'
import { RETURN_STATUS_LABELS, isReturnStatus } from '@/lib/returnTypes'

export interface ProcessReturnState {
  ok: boolean
  message?: string
  error?: string
}

export async function processReturnAction(
  _prev: ProcessReturnState,
  formData: FormData
): Promise<ProcessReturnState> {

  const id = String(formData.get('returnId') ?? '')
  const to = formData.get('status')
  const note = String(formData.get('note') ?? '')

  if (!isReturnStatus(to)) return { ok: false, error: 'Invalid action.' }

  const result = await processReturn({ id, to, note })
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/admin/returns')
  return {
    ok: true,
    message: `${result.returnNumber} is now ${RETURN_STATUS_LABELS[result.status].toLowerCase()}.`,
  }
}