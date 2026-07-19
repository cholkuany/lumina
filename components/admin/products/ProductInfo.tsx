import Link from 'next/link'

export const ProductInfo = ({ id, name, category }: { id: string, name: string, category: string }) => {
  return (
    <div>
      <Link
        href={`/admin/products/edit/${id}`}
        className="font-medium text-text-primary hover:text-primary transition-colors"
      >
        {name}
      </Link>
      <p className="text-xs text-border-dark">
        {category}
      </p>
    </div>
  )
}