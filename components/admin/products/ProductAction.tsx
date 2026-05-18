import Link from 'next/link'
import { SquarePen, Trash2 } from 'lucide-react'
import { ActionType } from '@/lib/types'

export function ProductActions({
  id,
  actionText,
  onDelete,
}: {
  id: string
  actionText: ActionType
  onDelete: (actionText: ActionType, id: string) => void
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/products/edit/${id}`}
        className="p-2 text-warm-gray-dark hover:text-gold hover:bg-linen rounded-lg transition-colors"
      >
        <SquarePen className="w-4 h-4" />
      </Link>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(actionText, id)
        }}
        className="p-2 text-warm-gray-dark hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}