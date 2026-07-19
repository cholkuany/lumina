import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'

export const ProductsHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Products</h1>
        <p className="text-border-dark mt-1">
          Manage your product catalog
        </p>
      </div>
      <Link href="/admin/products/new">
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </Link>
    </div>
  )
}