import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ProductFormData } from '@/lib/validations/product.validation/product.schema'
import { FormInput } from '@/components/ui/FormInput'
import { FormTextarea } from '@/components/ui/FormTextarea'

interface BasicFieldsProps {
  register: UseFormRegister<ProductFormData>
  errors: FieldErrors<ProductFormData>
}

export function BasicFields({
  register,
  errors,
}: BasicFieldsProps) {
  return (
    <div className="bg-white rounded-brand border border-warm-gray p-6 space-y-5">
      <h2 className="text-lg font-medium text-charcoal">Product Details</h2>

      <FormInput
        label="Product Name"
        placeholder="Enter product name"
        error={errors.name?.message}
        {...register('name')}
        optional={false}
      />

      <FormInput
        label="Brand Name"
        placeholder="Enter brand name"
        error={errors.brand?.message}
        {...register('brand')}
      />

      <FormTextarea
        label="Short Description"
        placeholder="Brief description for product cards"
        rows={3}
        maxLength={1000}
        showCount
        error={errors.description?.message}
        {...register('description')}
        optional={false}
      />

      <FormTextarea
        label="Long Description"
        placeholder="Detailed product description"
        rows={6}
        maxLength={1000}
        showCount
        hint="Supports markdown formatting"
        error={errors.longDescription?.message}
        {...register('longDescription')}
        optional={true}
      />
    </div>
  )
}