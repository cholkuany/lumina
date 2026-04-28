'use client'

import { useState } from 'react'
import { CategoryTree } from '@/components/admin/CategoryTree'
import { CategoryModal } from '@/components/admin/CategoryModal'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { SearchFilter } from '@/components/admin/SearchFilter'
import { Button } from '@/components/ui/Button'
import { CategoryFormData } from '@/lib/validations/category.validation'
import { useCategories } from '@/hooks/useCategories'

import { useQueryClient } from '@tanstack/react-query'

import { Plus } from 'lucide-react';
import { NestedCategory } from '@/hooks/useCategories'
import { useFlatCategories } from '@/hooks/useFlatCategories'
import { normalizedValue } from '@/lib/utils'

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const queryClient = useQueryClient()
  // const { data: categories = [] } = useCategories(showInactive)

  // Modal states
  const [modal, setModal] = useState<{
    type: 'create' | 'edit' | 'delete' | null
    category?: NestedCategory | null
    parentId?: string | null
  }>({ type: null })

  const { data, isPending, isError } = useCategories(showInactive)
  const { data: flatCategoryData, isPending: isFlatPending, isError: isFlatError } = useFlatCategories(true)

  const pending = isPending && isFlatPending
  const hasErred = isError && isFlatError

  if (pending) return <div>Loading...</div>
  if (hasErred) return <div>Error fetching categories.</div>

  const categories = data?.categories ?? []
  const categoryMap = data?.categoryMap ?? new Map()
  const flatCategories = flatCategoryData ?? []

  // Filter categories based on search
  const filteredCategories = searchQuery
    ? filterCategories(categories, searchQuery)
    : categories

  const saveCategory = async (data: CategoryFormData) => {
    const url = modal.category
      ? `/api/categories/${modal.category.id}`
      : '/api/categories'

    const method = modal.category ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save category')
    }

    return response.json()
  }
  // create / edit submit
  const handleSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)

    const previous = queryClient.getQueryData(['categories', showInactive])

    try {
      // 🧪 Optimistic update (simple refetch-free approach)
      await saveCategory(data)

      queryClient.invalidateQueries({
        queryKey: ['categories', showInactive],
      })

      setModal({ type: null })
    } catch (error) {
      // Rollback
      queryClient.setQueryData(['categories', showInactive], previous)
      alert(error instanceof Error ? error.message : 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!modal.category) return

    setIsSubmitting(true)

    const previous = queryClient.getQueryData(['categories', showInactive])

    try {
      const response = await fetch(
        `/api/categories/${modal.category.id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }

      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })

      setModal({ type: null })
    } catch (error) {
      queryClient.setQueryData(['categories', showInactive], previous)
      alert(error instanceof Error ? error.message : 'Failed to delete category')
    } finally {
      setIsSubmitting(false)
    }
  }


  // Stats calculation
  const stats = {
    total: flatCategories.length,
    active: flatCategories.filter((c) => {
      const fullCat = categories.find((cat) => findCategoryById(cat, c.id))
      return fullCat ? true : false
    }).length,
    root: categories.length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Categories</h1>
          <p className="text-warm-gray-dark mt-1">
            Products categories
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setModal({ type: 'create', parentId: null })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <p className="text-2xl font-semibold text-charcoal">{categoryMap.size}</p>
          <p className="text-sm text-warm-gray-dark">Total Categories</p>
        </div>
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <p className="text-2xl font-semibold text-charcoal">{stats.root}</p>
          <p className="text-sm text-warm-gray-dark">Root Categories</p>
        </div>
        <div className="bg-white rounded-brand border border-warm-gray p-4">
          <p className="text-2xl font-semibold text-charcoal">
            {categoryMap.size - stats.root}
          </p>
          <p className="text-sm text-warm-gray-dark">Subcategories</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchFilter
            searchPlaceholder="Search categories..."
            onSearchChange={setSearchQuery}
            onFilterChange={() => { }}
          />
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-brand border border-warm-gray cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="w-4 h-4 rounded border-warm-gray text-gold focus:ring-gold/30"
          />
          <span className="text-sm text-charcoal">Show inactive</span>
        </label>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-brand border border-warm-gray p-4">
        {isPending ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-6 h-6 bg-warm-gray-light rounded" />
                <div className="w-8 h-8 bg-warm-gray-light rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-warm-gray-light rounded w-1/3 mb-2" />
                  <div className="h-3 bg-warm-gray-light rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CategoryTree
            categories={filteredCategories}
            onEdit={(category) => setModal({ type: 'edit', category })}
            onDelete={(category) => setModal({ type: 'delete', category })}
            onAddChild={(parentId) => setModal({ type: 'create', parentId })}
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <CategoryModal
        isOpen={modal.type === 'create' || modal.type === 'edit'}
        onClose={() => setModal({ type: null })}
        category={modal.category}
        parentId={modal.parentId}
        categories={flatCategories}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={modal.type === 'delete'}
        onClose={() => setModal({ type: null })}
        onConfirm={handleDelete}
        title="Delete Category"
        message={
          modal.category?.children?.length
            ? `Cannot delete "${modal.category.name}" because it has subcategories. Please delete or move subcategories first.`
            : modal.category?.productCount
              ? `Cannot delete "${modal.category?.name}" because it has ${modal.category.productCount} associated products. Please reassign products first.`
              : `Are you sure you want to delete "${modal.category?.name}"? This action cannot be undone.`
        }
        confirmLabel="Delete"
        variant="danger"
        isLoading={isSubmitting}
        resource='product'
        action='delete'
      />
    </div>
  )
}

function filterCategories(categories: NestedCategory[], query: string): NestedCategory[] {
  const normalizedQuery = normalizedValue(query)

  return categories.flatMap((category) => {
    const matchesQuery =
      normalizedValue(category.name).includes(normalizedQuery) ||
      normalizedValue(category.slug).includes(normalizedQuery)

    const filteredChildren = filterCategories(category.children ?? [], normalizedQuery)

    if (!matchesQuery && filteredChildren.length === 0) {
      return []
    }

    return [{
      ...category,
      children: filteredChildren,
    }]
  })
}

function findCategoryById(category: NestedCategory, id: string): NestedCategory | null {
  if (category.id === id) return category
  for (const child of category.children || []) {
    const found = findCategoryById(child, id)
    if (found) return found
  }
  return null
}