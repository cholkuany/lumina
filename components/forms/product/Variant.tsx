import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form'
import { X, Layers } from 'lucide-react'

import { ProductFormData } from '@/lib/validations/product.validation/product.schema'
import { FormInput } from '@/components/ui/FormInput'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'

interface VariantProps {
  control: Control<ProductFormData>
  register: UseFormRegister<ProductFormData>
  errors: FieldErrors<ProductFormData>
  fields: FieldArrayWithId<ProductFormData, 'variants', 'id'>[]
  append: UseFieldArrayAppend<ProductFormData, 'variants'>
  remove: UseFieldArrayRemove
}

export function Variant({
  control,
  register,
  errors,
  fields,
  append,
  remove,
}: VariantProps) {
  return (
    <div className="bg-white rounded-brand border border-border p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-text-primary">
          Product Variants
        </h2>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            append({
              stock: 0,
              price: 0,
              originalPrice: null,
              images: [],
              sku: '',
              attributes: {
                color: '',
                size: '',
                material: '',
              },
            })
          }
        >
          Add Variant
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-lg">
          <Layers className="w-6 h-6 text-border-dark mx-auto mb-4" />
          <p className="text-text-primary font-medium">No variants added</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 bg-surface rounded-lg space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-text-primary">
                  Variant {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1 text-border-dark hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white rounded-brand border border-border p-6">
                <Controller
                  name={`variants.${index}.images`}
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      images={field.value}
                      onChange={field.onChange}
                      maxImages={8}
                      label="Product Images"
                      error={errors.variants?.[index]?.images?.message}
                      folder="lumina/products"
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormInput
                  label="stock"
                  placeholder="variant stock"
                  error={errors.variants?.[index]?.stock?.message}
                  {...register(`variants.${index}.stock`, {
                    valueAsNumber: true,
                  })}
                  optional={false}
                />

                <FormInput
                  label="price"
                  placeholder="variant price"
                  error={errors.variants?.[index]?.price?.message}
                  {...register(`variants.${index}.price`, {
                    valueAsNumber: true,
                  })}
                  optional={false}
                />

                <Controller
                  name={`variants.${index}.originalPrice`}
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      value={field.value ?? ''}
                      label="O. price"
                      placeholder="variant original price"
                      error={
                        errors.variants?.[index]?.originalPrice?.message
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : null
                        )
                      }
                    />
                  )}
                />

                <FormInput
                  label="sku"
                  placeholder="Enter sku"
                  error={errors.variants?.[index]?.sku?.message}
                  {...register(`variants.${index}.sku`)}
                  optional={false}
                />

                <FormInput
                  label="size"
                  placeholder="variant size"
                  error={
                    errors.variants?.[index]?.attributes?.size?.message
                  }
                  {...register(`variants.${index}.attributes.size`)}
                  optional={false}
                />

                <FormInput
                  label="color"
                  placeholder="variant color"
                  error={
                    errors.variants?.[index]?.attributes?.color?.message
                  }
                  {...register(`variants.${index}.attributes.color`)}
                  optional={false}
                />

                <FormInput
                  label="material"
                  placeholder="variant material"
                  error={
                    errors.variants?.[index]?.attributes?.material?.message
                  }
                  {...register(`variants.${index}.attributes.material`)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}