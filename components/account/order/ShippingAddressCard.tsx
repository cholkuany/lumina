import { MapPin } from 'lucide-react'
import type { TOrderProps } from '@/lib/types'
import { InfoCard } from './InfoCard'

export function ShippingAddressCard({ address }: { address: TOrderProps['shippingAddress'] }) {
  return (
    <InfoCard icon={MapPin} title="Shipping Address">
      <address className="not-italic text-border-dark text-sm leading-snug">
        <p className="font-medium text-foreground">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.street} </p>
        {address.apartment && <p>{address.apartment}</p>}
        <p>
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p className='uppercase'>{address.country}</p>
        {address.phone && <p className="mt-2">{address.phone}</p>}
      </address>
    </InfoCard>
  )
}