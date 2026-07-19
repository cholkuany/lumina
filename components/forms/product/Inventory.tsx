// import { FieldErrors, UseFormRegister } from 'react-hook-form'
// import { ProductFormData } from '@/lib/validations/product.validation/product.schema'
// import { FormInput } from '@/components/ui/FormInput'

interface InventoryProps {
  // register: UseFormRegister<ProductFormData>
  // errors: FieldErrors<ProductFormData>
  stockCount: number
  label: string
}

export function Inventory({
  stockCount,
  label
  // register,
  // errors,
}: InventoryProps) {
  return (
    <div className="bg-white rounded-radius-brand border border-border p-6 space-y-5">
      <h2 className="text-lg font-medium text-text-primary">Inventory</h2>

      <div className="flex gap-1 items-center">
        <label
          htmlFor="stockCount"
          className="block text-sm font-medium text-text-primary capitalize"
        >
          {label}:
        </label>
        <p>{stockCount}</p>
      </div>
    </div>
  )
}