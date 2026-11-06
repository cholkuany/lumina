import { CreditCard } from 'lucide-react'
import type { TOrderProps } from '@/lib/types'
import { InfoCard } from './InfoCard'

type Props = {
  paymentMethod: TOrderProps['paymentMethod']
  billingAddress?: TOrderProps['billingAddress']
}

export function PaymentCard({ paymentMethod, billingAddress }: Props) {
  const expiry =
    paymentMethod?.expiryMonth && paymentMethod?.expiryYear
      ? `${String(paymentMethod.expiryMonth).padStart(2, '0')}/${paymentMethod.expiryYear}`
      : null

  return (
    <InfoCard icon={CreditCard} title="Payment Method">
      <div className="text-border-dark">
        <p className="font-medium text-foreground">
          {paymentMethod?.brand ?? 'Card'} •••• {paymentMethod?.last4 ?? '----'}
        </p>
        {expiry && <p className="text-sm">Expires {expiry}</p>}
      </div>

      <div className="mt-4 pt-4 border-t border-border-light">
        <p className="text-sm font-medium text-foreground mb-2">Billing Address</p>
        {billingAddress ? (
          <address className="not-italic text-sm text-border-dark leading-snug">
            <p>
              {billingAddress.firstName} {billingAddress.lastName}
            </p>
            <p>{billingAddress.street}</p>
            <p>
              {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
            </p>
          </address>
        ) : (
          <p className="text-sm text-border-dark">Same as shipping address</p>
        )}
      </div>
    </InfoCard>
  )
}