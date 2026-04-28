import { cn } from '@/lib/utils'

type StatusType =
  | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  | 'pending' | 'approved' | 'rejected' | 'flagged'
  | 'active' | 'inactive' | 'suspended'
  | 'in_stock' | 'low_stock' | 'out_of_stock'

interface StatusBadgeProps {
  status: StatusType
  size?: 'sm' | 'md'
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // Order statuses
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipped: { label: 'Shipped', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 border-red-200' },

  // Review statuses
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200' },
  flagged: { label: 'Flagged', className: 'bg-orange-100 text-orange-700 border-orange-200' },

  // User statuses
  active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  suspended: { label: 'Suspended', className: 'bg-red-100 text-red-700 border-red-200' },

  // Stock statuses
  in_stock: { label: 'In Stock', className: 'bg-green-100 text-green-700 border-green-200' },
  low_stock: { label: 'Low Stock', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  out_of_stock: { label: 'Out of Stock', className: 'bg-red-100 text-red-700 border-red-200' },
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}