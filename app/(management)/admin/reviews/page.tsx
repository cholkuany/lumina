'use client'

import { useState, useMemo } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { SearchFilter } from '@/components/admin/SearchFilter'
import { Pagination } from '@/components/admin/Pagination'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'
import { useAllReviews } from '@/hooks/useProductReviews'
import { DBReview } from '@/lib/queries/get.reviews'
import { normalizedValue } from '@/lib/utils'
import { usePagination } from '@/hooks/usePagination'
import { useResourceMutation } from '@/hooks/useResourceMutation'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { ReviewDetailModal } from '@/components/admin/ReviewDetailModal'

import Image from 'next/image'

import { Eye, Check, X, Clock, Flag, Star, BadgeCheck, Shield } from "lucide-react"

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

const ITEMS_PER_PAGE = 10

export default function ReviewsPage() {
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [reviewDetail, setReviewDetail] = useState<DBReview | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const reviewMutation = useResourceMutation<'review'>({
    onSuccess: () => {
      confirmAction.close()
      setSelectedReviews([])
    }
  })

  const confirmAction = useConfirmAction<'review'>({
    resource: 'review',
    onConfirm: ({ action, ids, resource }) => {
      reviewMutation.mutate({ action, ids, resource })
    },
  })

  const { data, isLoading, error } = useAllReviews()

  const reviews = data?.reviews
  const stats = data?.stats[0]

  console.log('reviews', reviews)
  console.log('statistics...', stats)

  const filteredReviews = useMemo(() => {
    if (!reviews) return []
    const q = normalizedValue(searchQuery)
    return reviews.filter((review) => {
      const matchesSearch =
        searchQuery === '' ||
        normalizedValue(review.authorName).includes(q) ||
        normalizedValue(review.title).includes(q) ||
        normalizedValue(review.content).includes(q) ||
        normalizedValue(review.productInfo.name).includes(q)

      const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true
        return String((review as Record<string, unknown>)[key]) === value
      })

      return matchesSearch && matchesFilters
    })
  }, [reviews, searchQuery, activeFilters])

  const { currentPage, totalPages, paginatedItems, setCurrentPage, resetPage } =
    usePagination(filteredReviews, ITEMS_PER_PAGE)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    resetPage()
  }

  const handleFilterChange = (filters: Record<string, string>) => {
    setActiveFilters(filters)
    resetPage()
  }

  const handleBulkAction = (action: 'approve' | 'reject') => {
    if (selectedReviews.length > 0) {
      confirmAction.open(action, selectedReviews)
    }
  }

  const columns = useMemo(() => [
    {
      key: 'review',
      title: 'Review',
      render: (review: DBReview) => (
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-linen shrink-0 overflow-hidden">
            {review.productInfo.image ? (
              <Image
                src={review.productInfo.image}
                alt={review.productInfo.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-warm-gray-light" />
            )}

          </div>
          <div className="min-w-0">
            <p className="font-medium text-charcoal truncate">{review.productInfo.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating value={review.rating} readonly size="sm" />
              <span className="text-xs text-warm-gray-dark">
                by {review.authorName}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'content',
      title: 'Content',
      render: (review: DBReview) => (
        <div className="max-w-xs">
          <p className="font-medium text-charcoal text-sm truncate">{review.title}</p>
          <p className="text-xs text-warm-gray-dark line-clamp-2 mt-0.5">
            {review.content}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (review: DBReview) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={review.status} size="sm" />
          {review.reports.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded">
              Reported
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'verified',
      title: 'Verified',
      render: (review: DBReview) => (
        review.verified ? (
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
      key: 'date',
      title: 'Date',
      render: (review: DBReview) => (
        <span className="text-sm text-warm-gray-dark">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (review: DBReview) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setReviewDetail(review)
            }}
            className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {review.status === 'pending' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // setActionModal({ open: true, type: 'approve', reviewId: review.id })
                  confirmAction.open('approve', review.id)
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
                  confirmAction.open('reject', review.id)
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
      className: 'w-32',
    },
  ], [confirmAction])

  if (isLoading) return <div>Loading reviews...</div>
  if (error) return <div>Error loading reviews: {error.message}</div>
  if (!reviews || reviews.length === 0) return <div>No reviews found.</div>

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Reviews</h1>
          <p className="text-warm-gray-dark mt-1">
            Moderate and manage customer reviews
          </p>
        </div>
      </div>

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
          value={stats?.avgRating ?? '-'}
          bgColor="bg-gold/10"
        />
      </div>

      {/* Search & Filters */}
      <SearchFilter
        searchPlaceholder="Search reviews..."
        onSearchChange={handleSearch}
        filters={[
          { key: 'status', label: 'Status', options: reviewStatuses },
          { key: 'rating', label: 'Rating', options: ratingOptions },
        ]}
        onFilterChange={handleFilterChange}
        actions={
          selectedReviews.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleBulkAction('approve')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Check className="w-4 h-4 mr-1" />
                Approve ({selectedReviews.length})
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleBulkAction('reject')}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Reject ({selectedReviews.length})
              </Button>
            </div>
          )
        }
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedItems}
        keyExtractor={(review) => review.id}
        onRowClick={(review) => setReviewDetail(review)}
        selectable
        onSelectionChange={setSelectedReviews}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredReviews.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* Review Detail Modal */}
      {reviewDetail && (
        <ReviewDetailModal
          review={reviewDetail}
          onClose={() => setReviewDetail(null)}
          onApprove={() => {
            setReviewDetail(null)
            confirmAction.open('approve', reviewDetail.id)
          }}
          onReject={() => {
            setReviewDetail(null)
            confirmAction.open('reject', reviewDetail.id)
          }}
        />
      )}

      <ConfirmModal
        isOpen={confirmAction.state.open}
        onClose={confirmAction.close}
        onConfirm={confirmAction.confirm}
        action={confirmAction.state.type}
        count={confirmAction.state.ids.length}
        isLoading={reviewMutation.isPending}
        resource={confirmAction.state.resource}
      />
    </div>
  )
}

const StatWrapper = ({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: string | number; bgColor: string }) => (
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
