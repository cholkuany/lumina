import { Button } from '@/components/ui/Button'

interface FormHeaderProps {
  isEditMode: boolean
  isPending: boolean
  isDirty: boolean
  onCancel: () => void
}

export function FormHeader({
  isEditMode,
  isPending,
  isDirty,
  onCancel,
}: FormHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">
          {isEditMode ? 'Edit Product' : 'Create New Product'}
        </h1>
        <p className="text-warm-gray-dark mt-1">
          {isEditMode
            ? 'Update your product information'
            : 'Add a new product to your catalog'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          disabled={!isDirty}
        >
          {isEditMode ? 'Save All Changes' : 'Create Product'}
        </Button>
      </div>
    </div>
  )
}