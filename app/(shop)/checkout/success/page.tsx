import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getStripe } from '@/lib/stripe'
import { CheckoutSuccessClient } from './CheckoutSuccessClient'
import { formatPrice } from '@/lib/utils'

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string
  }>
}

async function getCheckoutSession(sessionId?: string) {
  if (!sessionId) return null

  try {
    const stripe = getStripe()
    return await stripe.checkout.sessions.retrieve(sessionId)
  } catch {
    return null
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id } = await searchParams
  const stripeSession = await getCheckoutSession(session_id)
  const amountTotal = stripeSession?.amount_total

  return (
    <main className="container-lumina py-16">
      <CheckoutSuccessClient
        sessionId={stripeSession?.payment_status === 'paid' ? stripeSession.id : undefined}
      />

      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="font-serif text-3xl text-charcoal mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-warm-gray-dark mb-2">
          Your payment was completed securely with Stripe.
        </p>

        {stripeSession && (
          <div className="bg-linen rounded-brand p-4 my-8 text-left">
            <p className="text-sm text-warm-gray-dark">Confirmation</p>
            <p className="text-charcoal font-medium break-all">{stripeSession.id}</p>
            {amountTotal !== null && amountTotal !== undefined && (
              <>
                <p className="text-sm text-warm-gray-dark mt-4">Total paid</p>
                <p className="text-charcoal font-semibold">
                  {formatPrice(amountTotal / 100)}
                </p>
              </>
            )}
          </div>
        )}

        <p className="text-sm text-warm-gray-dark mb-8">
          We&apos;ve sent a confirmation email with your order details.
          You can track your order status in your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account/orders">
            <Button variant="secondary">View Order</Button>
          </Link>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
