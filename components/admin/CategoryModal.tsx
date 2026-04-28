'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { CategoryForm } from './CategoryForm'
import { CategoryFormData } from '@/lib/validations/category.validation'
import { X } from 'lucide-react'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: { id: string; name: string } | null
  isActive: boolean
  sortOrder: number
  productCount: number
}

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
  parentId?: string | null
  categories: { id: string; name: string; level: number }[]
  onSubmit: (data: CategoryFormData) => Promise<void>
  isSubmitting?: boolean
}

export function CategoryModal({
  isOpen,
  onClose,
  category,
  parentId,
  categories,
  onSubmit,
  isSubmitting = false,
}: CategoryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  const title = category
    ? 'Edit Category'
    : parentId
      ? 'Add Subcategory'
      : 'Create Category'

  const parentCategory = parentId
    ? categories.find((c) => c.id === parentId)
    : null

  console.log("parent category", parentCategory)
  console.log("parent id", parentId)
  console.log("flat categories", categories)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative bg-white rounded-brand shadow-xl',
          'w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col',
          'animate-in fade-in zoom-in-95 duration-200'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-warm-gray">
          <div>
            <h2 className="text-lg font-semibold text-charcoal">{title}</h2>
            {parentCategory && (
              <p className="text-sm text-warm-gray-dark">
                Parent: {parentCategory.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-warm-gray-dark hover:text-charcoal hover:bg-linen rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <CategoryForm
            initialCategory={category}
            parentId={parentId}
            categories={categories}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
