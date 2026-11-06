import { RETURN_STATUS_LABELS, type ReturnRequestStatus } from '@/lib/returnTypes'

const STYLES: Record<ReturnRequestStatus, string> = {
  pending: 'bg-warning-light text-warning-dark',
  approved: 'bg-primary-light text-primary-dark',
  rejected: 'bg-danger-light text-danger-dark',
  received: 'bg-success-light text-success-dark',
}

export function ReturnStatusBadge({ status }: { status: ReturnRequestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${STYLES[status]}`}
    >
      {RETURN_STATUS_LABELS[status]}
    </span>
  )
}

export default ReturnStatusBadge