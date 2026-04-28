import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CategoryFormData } from '@/lib/validations/category.validation'

export const useCategoryMutations = (showInactive: boolean) => {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['categories'] })

  // CREATE / UPDATE
  const saveCategory = useMutation({
    mutationFn: async ({
      data,
      categoryId,
    }: {
      data: CategoryFormData
      categoryId?: string
    }) => {
      const url = categoryId
        ? `/api/categories/${categoryId}`
        : '/api/categories'

      const method = categoryId ? 'PUT' : 'POST'

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
    },

    onSuccess: invalidate,
  })

  // DELETE
  const deleteCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }
    },

    onSuccess: invalidate,
  })

  return {
    saveCategory,
    deleteCategory,
  }
}
