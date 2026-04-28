// components/account/AddressCard.tsx
import { MapPin, Edit2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Address } from '@/lib/types'

interface AddressCardProps {
  address: Address
  onEdit: () => void
  onDelete: () => void
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <div className="border border-warm-gray-light rounded-brand p-5 relative">
      {address.isDefault && (
        <Badge variant="gold" className="absolute top-4 right-4">
          Default
        </Badge>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-linen rounded-full flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h4 className="font-medium text-charcoal">
            {address.firstName} {address.lastName}
          </h4>
          <p className="text-sm text-warm-gray-dark">{address.phone}</p>
        </div>
      </div>

      <div className="text-sm text-warm-gray-dark space-y-0.5 mb-4">
        <p>{address.street}</p>
        {address.apartment && <p>{address.apartment}</p>}
        <p>
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p>{address.country}</p>
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-warm-gray-light">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-sm text-charcoal hover:text-gold transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 text-sm text-charcoal hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  )
}