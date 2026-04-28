'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  categorySchema,
  CategoryFormData,
} from '@/lib/validations/category.validation'
import { FormInput } from '@/components/ui/FormInput'
import { FormTextarea } from '@/components/ui/FormTextarea'
import { FormSelect } from '@/components/ui/FormSelect'
import { FormSwitch } from '@/components/ui/FormSwitch'
import { ImageUpload } from '../ui/ImageUpload'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

import { Trash2 } from 'lucide-react'
import type { Category } from './CategoryModal'

interface CategoryFormProps {
  initialCategory?: Category | null
  parentId?: string | null
  categories: { id: string; name: string; level: number }[]
  onSubmit: (data: CategoryFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function CategoryForm({
  initialCategory,
  parentId,
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CategoryFormProps) {
  const [imageUrl, setImageUrl] = useState<string[]>(
    initialCategory?.image ? [initialCategory.image] : []
  )

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialCategory?.name || '',
      description: initialCategory?.description || '',
      image: initialCategory?.image || '',
      parent: parentId || initialCategory?.parent?.id || null,
      isActive: initialCategory?.isActive ?? true,
      sortOrder: initialCategory?.sortOrder || 0,
    },
  })

  // Update image field when imageUrl changes
  useEffect(() => {
    setValue('image', imageUrl[0] || '')
  }, [imageUrl, setValue])

  // Build parent options with indentation
  const parentOptions = [
    { value: '', label: 'None (Root Category)' },
    ...categories
      .filter((cat) => cat.id !== initialCategory?.id)
      .map((cat) => ({
        value: cat.id,
        label: `${'—'.repeat(cat.level)} ${cat.name}`,
      })),
  ]

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Category Image */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Category Image
        </label>
        <div className="flex items-start gap-4">
          {imageUrl.length > 0 ? (
            <div className="relative w-24 h-24 rounded-brand overflow-hidden bg-linen border border-warm-gray group">
              <Image
                src={imageUrl[0]}
                alt="Category"
                fill
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl([])}
                className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <ImageUpload
              images={imageUrl}
              onChange={setImageUrl}
              maxImages={1}
              folder="lumina/categories"
            />
          )}
          <div className="flex-1">
            <p className="text-sm text-warm-gray-dark">
              Recommended (size): 400x400. Max file size: 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Category Name */}
      <FormInput
        label="Category Name"
        placeholder="e.g., Living Room Furniture"
        error={errors.name?.message}
        {...register('name')}
        required
      />

      {/* Description */}
      <FormTextarea
        label="Description"
        placeholder="Brief description of this category..."
        rows={3}
        maxLength={500}
        showCount
        error={errors.description?.message}
        {...register('description')}
      />

      {/* Parent Category */}
      <Controller
        name="parent"
        control={control}
        render={({ field }) => (
          <FormSelect
            label="Parent Category"
            options={parentOptions}
            error={errors.parent?.message}
            {...register('parent')}
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value || null)}
          />
        )}
      />

      {/* Sort Order */}
      <Controller
        name="sortOrder"
        control={control}
        render={({ field }) => (
          <FormInput
            label="Sort Order"
            type="number"
            min="0"
            placeholder="0"
            hint="Lower numbers appear first"
            error={errors.sortOrder?.message}
            value={field.value}
            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
          />
        )}
      />

      {/* Active Status */}
      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <FormSwitch
            label="Active"
            description="Inactive categories won't be visible on the storefront"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-warm-gray">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={!isDirty && !parentId}
          className="flex-1"
        >
          {initialCategory ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}