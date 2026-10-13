import type {
  TCartItem,
  TProduct,
  Attribute,
  TProductVariant,
} from '@/lib/types'

export interface CartState {
  items: TCartItem[]
  isOpen: boolean
  hasHydrated: boolean
}

export interface Actions {
  addItem: (product: TProduct, quantity: number, variants: Attribute) => void
  removeItem: (variant: TProductVariant) => void
  updateQuantity: (variant: TProductVariant, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}