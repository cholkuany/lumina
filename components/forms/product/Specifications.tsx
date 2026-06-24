import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form'
import { X } from 'lucide-react'

import { ProductFormData } from '@/lib/validations/product.validation/product.schema'
import { FormInput } from '@/components/ui/FormInput'
import { Button } from '@/components/ui/Button'

interface SpecificationsProps {
  register: UseFormRegister<ProductFormData>
  errors: FieldErrors<ProductFormData>
  fields: FieldArrayWithId<ProductFormData, 'specifications', 'id'>[]
  append: UseFieldArrayAppend<ProductFormData, 'specifications'>
  remove: UseFieldArrayRemove
}

export function Specifications({
  register,
  errors,
  fields,
  append,
  remove,
}: SpecificationsProps) {
  return (
    <div className="bg-white rounded-brand border border-warm-gray p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-charcoal">
          Specifications
        </h2>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ key: '', value: '' })}
        >
          Add Specification
        </Button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex items-start gap-3 p-3 bg-linen rounded-lg"
        >
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              placeholder="Name (e.g., Weight)"
              error={errors.specifications?.[index]?.key?.message}
              {...register(`specifications.${index}.key`)}
            />

            <FormInput
              placeholder="Value (e.g., 2.5 kg)"
              error={errors.specifications?.[index]?.value?.message}
              {...register(`specifications.${index}.value`)}
            />
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="p-2 text-warm-gray-dark hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  )
}