'use client'

import { useCartItems, useAddToCart } from '@/stores/cart/cart.selectors'
import { getDefaultVariant } from '@/lib/utils'
import type { TProduct } from '@/lib/types'

const PLACEHOLDER_IMAGE = '/placeholder-product.jpg'

/**
 * All cart/variant logic for a product card.
 * - `quantity`: total of this product in the cart, across variants (drives the cart indicator)
 * - `canAdd`: whether the *displayed* variant still has stock left to add
 */
export function useProductCardState(product: TProduct) {
  const addItemToCart = useAddToCart()
  const items = useCartItems()

  const currentVariant = getDefaultVariant(product)

  const productItems = items?.filter((item) => item.product.id === product.id) ?? []

  const quantity = productItems.reduce((sum, item) => sum + item.quantity, 0)
  const isInCart = quantity > 0


  const variantCartQuantity = productItems.find((item) => JSON.stringify(item.product.variant.attributes) === JSON.stringify(currentVariant.attributes))?.quantity ?? 0

  const canAdd = variantCartQuantity < currentVariant.stock

  const image = currentVariant.images?.[0]?.secure_url || PLACEHOLDER_IMAGE

  const addToCart = () =>
    addItemToCart(
      product,
      1,
      currentVariant.attributes,
    )

  return {
    currentVariant,
    image,
    quantity,
    isInCart,
    canAdd,
    addToCart,
  }
}