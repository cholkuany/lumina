import type {
  TCartItem,
  TProduct,
  Attribute,
} from '@/lib/types'

export interface CartState {
  items: TCartItem[]
  isOpen: boolean
  hasHydrated: boolean
}

export interface Actions {
  addItem: (product: TProduct, quantity: number, variants?: Partial<Attribute>, image?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}