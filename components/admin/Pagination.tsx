'use client'

import { cn } from '@/lib/utils'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const pages = generatePagination(currentPage, totalPages)

  const startItem = totalItems
    ? (currentPage - 1) * (itemsPerPage || 10) + 1
    : 0
  const endItem = totalItems
    ? Math.min(currentPage * (itemsPerPage || 10), totalItems)
    : 0

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-warm-gray">
      {/* Items info */}
      {totalItems && (
        <p className="text-sm text-warm-gray-dark">
          Showing <span className="font-medium text-charcoal">{startItem}</span> to{' '}
          <span className="font-medium text-charcoal">{endItem}</span> of{' '}
          <span className="font-medium text-charcoal">{totalItems}</span> results
        </p>
      )}

      {/* Pagination controls */}
      <nav className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-lg transition-colors',
            currentPage === 1
              ? 'text-warm-gray-light cursor-not-allowed'
              : 'text-warm-gray-dark hover:bg-linen hover:text-charcoal'
          )}
        >
          <ChevronLeft className="w-5.5 h-5.5" />
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={cn(
              'min-w-10 h-10 px-3 rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-gold text-white'
                : page === '...'
                  ? 'text-warm-gray-dark cursor-default'
                  : 'text-charcoal hover:bg-linen'
            )}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-lg transition-colors',
            currentPage === totalPages
              ? 'text-warm-gray-light cursor-not-allowed'
              : 'text-warm-gray-dark hover:bg-linen hover:text-charcoal'
          )}
        >
          <ChevronRight className="w-5.5 h-5.5" />
        </button>
      </nav>
    </div>
  )
}

function generatePagination(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, '...', totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}
