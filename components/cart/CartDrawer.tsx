// components/cart/CartDrawer.tsx
'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CartItem } from './CartItem'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { state, closeCart, subtotal, itemCount } = useCart()

  const shipping = subtotal >= 50 ? 0 : 5.99
  const total = subtotal + shipping

  return (
    <Transition show={state.isOpen} as={Fragment}>
      <Dialog onClose={closeCart} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-charcoal/50" />
        </Transition.Child>

        {/* Drawer */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-screen max-w-md">
                  <div className="flex h-full flex-col bg-ivory shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray-light">
                      <Dialog.Title className="font-serif text-xl text-charcoal">
                        Shopping Cart ({itemCount})
                      </Dialog.Title>
                      <button
                        onClick={closeCart}
                        className="p-2 -mr-2 text-warm-gray-dark hover:text-charcoal transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    {state.items.length > 0 ? (
                      <>
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                          <div className="space-y-4">
                            {state.items.map((item) => (
                              <CartItem key={item.id} item={item} />
                            ))}
                          </div>
                        </div>

                        {/* Free Shipping Progress */}
                        {subtotal < 50 && (
                          <div className="px-6 py-3 bg-linen">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-warm-gray-dark">
                                Add {formatPrice(50 - subtotal)} for free shipping
                              </span>
                              <span className="text-gold font-medium">
                                {Math.round((subtotal / 50) * 100)}%
                              </span>
                            </div>
                            <div className="h-2 bg-warm-gray-light rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Summary & Checkout */}
                        <div className="border-t border-warm-gray-light px-6 py-6 space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-warm-gray-dark">Subtotal</span>
                              <span className="text-charcoal">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-warm-gray-dark">Shipping</span>
                              <span className="text-charcoal">
                                {shipping === 0 ? 'Free' : formatPrice(shipping)}
                              </span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-warm-gray-light">
                              <span className="text-charcoal">Total</span>
                              <span className="text-charcoal">{formatPrice(total)}</span>
                            </div>
                          </div>

                          <Link href="/checkout" onClick={closeCart}>
                            <Button className="w-full" size="lg">
                              Checkout
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>

                          <Link
                            href="/cart"
                            onClick={closeCart}
                            className="block text-center text-sm text-warm-gray-dark hover:text-charcoal transition-colors"
                          >
                            View Full Cart
                          </Link>
                        </div>
                      </>
                    ) : (
                      /* Empty Cart */
                      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                        <div className="w-20 h-20 bg-linen rounded-full flex items-center justify-center mb-6">
                          <ShoppingBag className="w-10 h-10 text-warm-gray-dark" />
                        </div>
                        <h3 className="font-serif text-xl text-charcoal mb-2">
                          Your cart is empty
                        </h3>
                        <p className="text-warm-gray-dark text-center mb-6">
                          Looks like you haven&apos;t added anything yet.
                        </p>
                        <Link href="/products" onClick={closeCart}>
                          <Button>Start Shopping</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}