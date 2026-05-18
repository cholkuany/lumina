'use client'

import { useState, useMemo } from 'react'

import { ResourceTable } from '@/components/tables/ResourceTable'
import { useResourceController, useTableInstanceController } from '@/hooks/useResourceController'
import { ResourceTableToolbar } from '@/components/tables/ResourceTableToolbar'
import { ResourceTablePagination } from '@/components/tables/ResourceTablePagination'
import { ResourceHeader } from '@/components/admin/resource/ResourceHeader'

import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Button } from '@/components/ui/Button'
import { useAllReviews } from '@/hooks/useProductReviews'
import { DBReview } from '@/lib/queries/get.reviews'
import { ReviewDetailModal } from '@/components/admin/ReviewDetailModal'

import { Check, X, Clock, Flag, Star } from "lucide-react"
import { useReviewColumns } from '@/components/admin/columns/useReviewColumns'

const reviewStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'flagged', label: 'Flagged' },
]

const ratingOptions = [
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
]

export default function ReviewsPage() {
  const [reviewDetail, setReviewDetail] = useState<DBReview | null>(null)

  const { data, isLoading, error } = useAllReviews()

  const reviews = useMemo(() => data?.reviews ?? [], [data])
  const stats = data?.stats[0]

  const {
    filterValues,
    setFilterValues,

    confirm,
    mutation,
    // handleDelete,

    pagination,
    setPagination,

    rowSelection,
    setRowSelection,

    globalFilter,
    setGlobalFilter
  } = useResourceController('review')

  const columns = useReviewColumns({ setReviewDetail, confirm })

  const { table } = useTableInstanceController(
    columns,
    reviews,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
    (review) => review.id
  )

  const selectedIds =
    table
      .getSelectedRowModel()
      .rows.map((row) =>
        row.original.id
      )

  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedIds.length > 0) {
      confirm.open(action, selectedIds)
    }
  }

  if (isLoading) return <div>Loading reviews...</div>
  if (error) return <div>Error loading reviews: {error.message}</div>
  if (!reviews || reviews.length === 0) return <div>No reviews found.</div>

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <ResourceHeader
        title='Reviews'
        description='Moderate and manage customer reviews'
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatWrapper
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          label="Pending"
          value={stats?.pending ?? '-'}
          bgColor="bg-amber-100"
        />
        <StatWrapper
          icon={<Check className="w-5 h-5 text-green-600" />}
          label="Approved"
          value={stats?.approved ?? '-'}
          bgColor="bg-green-100"
        />
        <StatWrapper
          icon={<Flag className="w-5 h-5 text-orange-600" />}
          label="Flagged"
          value={stats?.flagged ?? '-'}
          bgColor="bg-orange-100"
        />

        <StatWrapper
          icon={<Star className="w-5 h-5 text-gold" />}
          label="Avg Rating"
          value={stats?.avgRating.toFixed(2) ?? '-'}
          bgColor="bg-gold/10"
        />
      </div>

      <ResourceTableToolbar
        searchPlaceholder="Search reviews..."
        search={globalFilter}
        onSearchChange={setGlobalFilter}
        filters={[
          { key: 'status', label: 'Status', options: reviewStatuses },
          { key: 'rating', label: 'Rating', options: ratingOptions },
        ]}
        onFilterChange={setFilterValues}
        filterValues={filterValues}
        actions={
          selectedIds.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleBulkAction('approve')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Check className="w-4 h-4 mr-1" />
                Approve ({selectedIds.length})
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleBulkAction('reject')}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Reject ({selectedIds.length})
              </Button>
            </div>
          )
        }
      />

      {/* Data Table */}
      <ResourceTable
        table={table}
        onRowClick={(review) => setReviewDetail(review)}
        selectable={true}
        emptyMessage='No data found'
        isLoading={false}
      />

      <ResourceTablePagination table={table} />

      {/* Review Detail Modal */}
      {reviewDetail && (
        <ReviewDetailModal
          review={reviewDetail}
          onClose={() => setReviewDetail(null)}
          onApprove={() => {
            setReviewDetail(null)
            confirm.open('approve', reviewDetail.id)
          }}
          onReject={() => {
            setReviewDetail(null)
            confirm.open('reject', reviewDetail.id)
          }}
        />
      )}

      <ConfirmModal
        isOpen={confirm.state.open}
        onClose={confirm.close}
        onConfirm={confirm.confirm}
        action={confirm.state.type}
        count={confirm.state.ids.length}
        isLoading={mutation.isPending}
        resource={confirm.state.resource}
      />
    </div>
  )
}

const StatWrapper = (
  { icon, label, value, bgColor }:
    { icon: React.ReactNode; label: string; value: string | number; bgColor: string }
) => (
  <div className="bg-white rounded-brand border border-warm-gray p-4">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-charcoal">{value}</p>
        <p className="text-xs text-warm-gray-dark">{label}</p>
      </div>
    </div>
  </div>
)
