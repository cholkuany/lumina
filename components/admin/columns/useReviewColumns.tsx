import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import type { DBReview } from '@/lib/queries/get.reviews'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ActionType, ConfirmState, Resource } from '@/lib/types'
import Image from 'next/image'
import { StarRating } from '@/components/ui/StarRating'
import { BadgeCheck, Check, Eye, Shield, X } from 'lucide-react'

export function useReviewColumns(
  { confirm, setReviewDetail }
    : {
      confirm:
      {
        state: ConfirmState<Resource>;
        open: (type: ActionType, ids: string | string[]) => void;
        close: () => void;
        confirm: () => void;
      },
      setReviewDetail: (val: DBReview | null) => void
    }
): ColumnDef<DBReview>[] {

  return useMemo(() => [
    {
      accessorKey: 'review',
      title: 'Review',
      cell: ({ row }) => (
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-linen shrink-0 overflow-hidden">
            {row.original.productInfo.image ? (
              <Image
                src={row.original.productInfo.image}
                alt={row.original.productInfo.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-warm-gray-light" />
            )}

          </div>
          <div className="min-w-0">
            <p className="font-medium text-charcoal truncate">{row.original.productInfo.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating value={row.original.rating} readonly size="sm" />
              <span className="text-xs text-warm-gray-dark">
                by {row.original.authorName}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Content',
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="font-medium text-charcoal text-sm truncate">{row.original.title}</p>
          <p className="text-xs text-warm-gray-dark line-clamp-2 mt-0.5">
            {row.original.content}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={row.original.status} size="sm" />
          {row.original.reports.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded">
              Reported
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'verified',
      header: 'Verified',
      cell: ({ row }) => (
        row.original.verified ? (
          <span className="text-green-600">
            <BadgeCheck className="w-5 h-5" />
          </span>
        ) : (
          <span className="text-warm-gray-light">
            <Shield className="w-5 h-5" />
          </span>
        )
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-sm text-warm-gray-dark">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setReviewDetail(row.original)
            }}
            className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.original.status === 'pending' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // setActionModal({ open: true, type: 'approve', reviewId: review.id })
                  confirm.open('approve', row.original.id)
                }}
                className="p-2 text-warm-gray-dark hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // setActionModal({ open: true, type: 'reject', reviewId: review.id })
                  confirm.open('reject', row.original.id)
                }}
                className="p-2 text-warm-gray-dark hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
      meta: {
        className: 'w-32',
      },
    },
  ], [confirm, setReviewDetail])
}