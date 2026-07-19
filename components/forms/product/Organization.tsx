import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

import { ProductFormData } from '@/lib/validations/product.validation/product.schema'
import { FormSelect } from '@/components/ui/FormSelect'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CategoryOption } from './types'

interface SelectOption {
  value: string
  label: string
}

interface BreadcrumbItem {
  href: string
  label: string
}

interface OrganizationProps {
  control: Control<ProductFormData>
  watch: UseFormWatch<ProductFormData>
  setValue: UseFormSetValue<ProductFormData>
  errors: FieldErrors<ProductFormData>
  availableCategories: CategoryOption[]
  categoryOptions: SelectOption[]
  breadcrumbs: BreadcrumbItem[]
}

export function Organization({
  control,
  watch,
  setValue,
  errors,
  availableCategories,
  categoryOptions,
  breadcrumbs,
}: OrganizationProps) {
  const watchedCategory = watch('category')

  return (
    <div className="bg-white rounded-brand border border-border p-6 space-y-5">
      <h2 className="text-lg font-medium text-text-primary">Organization</h2>

      <Controller
        name="category.name"
        control={control}
        render={() => {
          const currentName = watch('category.name')
          const matchingCategory = availableCategories.find(
            (category) => category.name === currentName
          )
          const currentId = matchingCategory?._id || ''

          return (
            <FormSelect
              label="Category"
              options={categoryOptions}
              placeholder="Select category"
              error={errors.category?.name?.message}
              value={currentId}
              onChange={(e) => {
                const selectedId = e.target.value
                const selectedCategory = availableCategories.find(
                  (category) => category._id === selectedId
                )

                if (selectedCategory) {
                  setValue(
                    'category',
                    {
                      name: selectedCategory.name,
                      parent: selectedCategory.parent || null,
                      ancestors: selectedCategory.ancestors || [],
                    },
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    }
                  )
                } else {
                  setValue('category', {
                    name: '',
                    parent: null,
                    ancestors: [],
                  })
                }
              }}
            />
          )
        }}
      />

      {watchedCategory?.name && (
        <div className="w-auto h-auto flex flex-wrap">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
    </div>
  )
}