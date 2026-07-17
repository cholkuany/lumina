export type PurchaseStatus = 'pending' | 'ordered' | 'in_transit' | 'received' | 'cancelled'

export type AdminPurchaseItem = {
  id: string
  productId: string
  variantId: string
  name: string
  sku: string
  variantLabel: string
  image: string | null
  quantity: number
  cost: number
}

export type AdminPurchase = {
  id: string
  purchaseNumber: string
  supplier: { name: string; email: string }
  items: AdminPurchaseItem[]
  itemCount: number
  total: number
  status: PurchaseStatus
  expectedDate: string
  receivedDate: string | null
  inventoryAppliedAt: string | null
  date: string
  notes?: string
}

export type PurchaseStats = Record<PurchaseStatus, number> & { monthSpend: number }
