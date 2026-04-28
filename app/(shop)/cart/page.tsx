'use client'

import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { state, clearCart, itemCount } = useCart()

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb items={[{ label: 'Shopping Cart' }]} />
      </div>

      <div className="container-lumina">
        <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-8">
          Shopping Cart
        </h1>

        {state.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-warm-gray-light mb-4">
                <span className="text-sm text-warm-gray-dark">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
                <button
                  onClick={clearCart}
                  className="text-sm text-warm-gray-dark hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {/* Items */}
              <div className="divide-y divide-warm-gray-light">
                {state.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 mt-6 text-sm text-warm-gray-dark hover:text-charcoal transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div>
              <CartSummary />
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-linen rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-warm-gray-dark" />
            </div>
            <h2 className="font-serif text-2xl text-charcoal mb-3">
              Your cart is empty
            </h2>
            <p className="text-warm-gray-dark mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added anything to your cart yet.
              Start shopping to fill it up!
            </p>
            <Link href="/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}