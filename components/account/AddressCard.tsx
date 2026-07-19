// components/account/AddressCard.tsx
import { MapPin, Edit2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { TAddress } from '@/lib/types'

interface AddressCardProps {
  address: TAddress
  onEdit: () => void
  onDelete: () => void
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <div className="border border-border-light rounded-brand p-5 relative">
      {address.isDefault && (
        <Badge variant="primary" className="absolute top-4 right-4">
          Default
        </Badge>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-text-primary">
            {address.firstName} {address.lastName}
          </h4>
          <p className="text-sm text-border-dark">{address.phone}</p>
        </div>
      </div>

      <div className="text-sm text-border-dark space-y-0.5 mb-4">
        <p>{address.street}</p>
        {address.apartment && <p>{address.apartment}</p>}
        <p>
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p>{address.country}</p>
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-border-light">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-sm text-text-primary hover:text-primary transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 text-sm text-text-primary hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  )
}