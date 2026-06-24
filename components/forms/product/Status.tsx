import { Control, Controller } from 'react-hook-form'
import { ProductFormData } from '@/lib/validations/product.validation/product.schema'
import { FormSwitch } from '@/components/ui/FormSwitch'

interface StatusProps {
  control: Control<ProductFormData>
}

export function Status({ control }: StatusProps) {
  return (
    <div className="bg-white rounded-brand border border-warm-gray p-6 space-y-5">
      <h2 className="text-lg font-medium text-charcoal">Status</h2>

      <Controller
        name="isFeatured"
        control={control}
        render={({ field }) => (
          <FormSwitch
            label="Featured"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="isNewArrival"
        control={control}
        render={({ field }) => (
          <FormSwitch
            label="New Arrival"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="isSale"
        control={control}
        render={({ field }) => (
          <FormSwitch
            label="On Sale"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  )
}