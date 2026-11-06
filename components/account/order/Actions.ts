'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from '@/lib/auth-server'
import { createReturnRequest } from '@/lib/queries/return.queries'
import type { SubmitReturnInput, SubmitReturnResult } from '@/lib/returnTypes'

const MAX_LINES = 50

// Server actions are public endpoints, so check the shape of the input before using it.
function parseInput(input: unknown): SubmitReturnInput | null {
  if (typeof input !== 'object' || input === null) return null
  const { orderNumber, items } = input as Record<string, unknown>
  if (typeof orderNumber !== 'string' || !orderNumber || !Array.isArray(items)) return null
  if (items.length === 0 || items.length > MAX_LINES) return null

  const parsed: SubmitReturnInput['items'] = []
  for (const raw of items) {
    if (typeof raw !== 'object' || raw === null) return null
    const { orderItemId, quantity, reason } = raw as Record<string, unknown>
    if (typeof orderItemId !== 'string' || typeof quantity !== 'number' || typeof reason !== 'string') {
      return null
    }
    parsed.push({ orderItemId, quantity, reason })
  }
  return { orderNumber, items: parsed }
}

export async function submitReturnRequest(input: unknown): Promise<SubmitReturnResult> {
  // const user = await requireUser()
  const session = await getServerSession()
  const user = session?.user

  const parsed = parseInput(input)
  if (!parsed) return { ok: false, error: 'Something was wrong with that request. Please try again.' }

  const result = await createReturnRequest({ ...parsed, userId: user?.id ?? '' })
  if (result.ok) {
    revalidatePath('/account/orders', 'layout')
    revalidatePath('/admin/returns')
  }
  return result
}