import Link from 'next/link'
import { ArrowLeft, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function CheckoutCancelPage() {
  return (
    <main className="container-lumina py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="font-serif text-3xl text-charcoal mb-4">
          Payment Cancelled
        </h1>
        <p className="text-warm-gray-dark mb-8">
          Your cart is still saved. You can return to checkout when you&apos;re ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout">
            <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Checkout
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="secondary">View Cart</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
