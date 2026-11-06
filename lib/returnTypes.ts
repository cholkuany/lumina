export type ReturnRequestStatus = 'pending' | 'approved' | 'rejected' | 'received'

export const RETURN_STATUSES: ReturnRequestStatus[] = ['pending', 'approved', 'rejected', 'received']

export const RETURN_STATUS_LABELS: Record<ReturnRequestStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  received: 'Received',
}

// pending -> approved | rejected, approved -> received. Rejected and received are final.
export const RETURN_TRANSITIONS: Record<ReturnRequestStatus, ReturnRequestStatus[]> = {
  pending: ['approved', 'rejected'],
  approved: ['received'],
  rejected: [],
  received: [],
}

export const RETURN_ACTION_LABELS: Record<ReturnRequestStatus, string> = {
  pending: 'Reopen',
  approved: 'Approve return',
  rejected: 'Reject return',
  received: 'Mark as received',
}

export function isReturnStatus(value: unknown): value is ReturnRequestStatus {
  return typeof value === 'string' && (RETURN_STATUSES as string[]).includes(value)
}

export function canTransition(from: ReturnRequestStatus, to: ReturnRequestStatus): boolean {
  return RETURN_TRANSITIONS[from].includes(to)
}

// Plain, serializable shapes passed from server queries to components.
export interface ReturnListItem {
  id: string
  returnNumber: string
  status: ReturnRequestStatus
  createdAt: string
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail?: string
  itemCount: number
  estimatedValue: number
}

export interface ReturnDetailItem {
  productName: string
  image?: string
  quantity: number
  reason: string
  unitPrice: number
}

export interface ReturnDetailHistoryEntry {
  status: ReturnRequestStatus
  timestamp: string
  note?: string
}

export interface ReturnDetail extends ReturnListItem {
  items: ReturnDetailItem[]
  statusHistory: ReturnDetailHistoryEntry[]
  adminNote?: string
}

// ---------------------------------------------------------------------------
// Customer-facing definitions (order page -> return request)
// ---------------------------------------------------------------------------

// Days after delivery that a customer may request a return. Set to null to disable the check.
export const RETURN_WINDOW_DAYS: number | null = 30
export const MAX_RETURN_REASON_LENGTH = 300

export const RETURN_CUSTOMER_MESSAGES: Record<ReturnRequestStatus, string> = {
  pending: "We're reviewing your request.",
  approved: "Approved. We'll process it once we receive your items.",
  rejected: "This request wasn't approved.",
  received: "We've received your items.",
}

export interface CustomerReturn {
  id: string
  returnNumber: string
  status: ReturnRequestStatus
  createdAt: string
  items: Array<{ orderItemId: string; productName: string; quantity: number; reason: string }>
  adminNote?: string
}

export interface SubmitReturnInput {
  orderNumber: string
  items: Array<{ orderItemId: string; quantity: number; reason: string }>
}

export type SubmitReturnResult =
  | { ok: true; returnNumber: string }
  | { ok: false; error: string }

// Quantity already tied up in a return per order item. Rejected requests free the quantity again.
export function getReturnedQuantities(
  // returns: CustomerReturn[]
  returns: Array<{
    status: ReturnRequestStatus
    items: Array<{ orderItemId: string; quantity: number }>
  }>
): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const r of returns) {
    if (r.status === 'rejected') continue
    for (const item of r.items) {
      totals[item.orderItemId] = (totals[item.orderItemId] ?? 0) + item.quantity
    }
  }
  return totals
}