import Link from 'next/link'

export const ProductInfo = ({ id, name, category }: { id: string, name: string, category: string }) => {
  return (
    <div>
      <Link
        href={`/admin/products/edit/${id}`}
        className="font-medium text-charcoal hover:text-gold transition-colors"
      >
        {name}
      </Link>
      <p className="text-xs text-warm-gray-dark">
        {category}
      </p>
    </div>
  )
}