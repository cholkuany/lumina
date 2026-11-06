import { IImage } from "./db/models/Product"
import { DBReview } from "./queries/get.reviews"
import { ProductFormData } from "./validations/product.validation/product.schema"
import { ZUser } from "./validations/user.validation"
import { PurchaseFormValues } from "./validations/purchase.validation"
import { NotificationType } from "./db/models/Notification"

export type WithId<T> = T & { id: string }

export interface Timestamped {
  createdAt: string
}

// -----------------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------------

export interface TProduct {
  id: string
  name: string
  description: string
  longDescription?: string
  slug: string
  category: {
    name: string
    parent?: string | null
    ancestors?: string[] | null
  },
  unitsSold?: number
  rating: number
  reviewCount: number
  variants: TProductVariant[]
  specifications?: {
    key: string,
    value: string
  }[]
  ratingBreakdown?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  }
  isNewArrival?: boolean
  isSale?: boolean
  isFeatured?: boolean
  brand?: string
}

export type Attribute = {
  color: string
  size: string
  material?: string
} & Record<string, string>

export interface TProductVariant {
  id: string
  attributes: Attribute
  price: number
  originalPrice?: number
  stock: number
  sku: string
  images: IImage[]
}

export type TCartProduct = Pick<TProduct, 'id' | 'name'>
  & {
    variant: TProductVariant
  }

export interface TCartItem {
  id: string
  product: TCartProduct
  quantity: number
  variantImage?: string
}

export interface TWishlistItem {
  id: string
  product: TProduct
  addedAt: Date
}

// -----------------------------------------------------------------------------
// Reviews
// -----------------------------------------------------------------------------

export type TReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged'

export interface TReview {
  id: string
  author: string
  avatar?: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
  images?: string[]
  recommendProduct?: boolean
  response?: {
    author: string
    content: string
    date: string
  }
}

export interface TReviewSubmission extends Pick<TReview, 'rating' | 'title' | 'content'> {
  productId: string
  images: IImage[]
  recommendProduct: boolean | null
}

export interface TReviewForModeration extends TReview, Timestamped {
  product: {
    id: string
    name: string
    image: string
  }
  customer: {
    id: string
    name: string
    email: string
    totalOrders: number
    totalReviews: number
  }
  reports: TReviewReport[]
  moderationHistory: TModerationAction[]
  status: TReviewStatus
}

export interface TReviewReport extends Timestamped {
  id: string
  reason: string
  details?: string
  reportedBy: string
}

export interface TModerationAction extends Timestamped {
  id: string
  action: 'approved' | 'rejected' | 'flagged' | 'edited'
  reason?: string
  moderatorId: string
  moderatorName: string
}

export interface TModerationStats extends Record<TReviewStatus, number> {
  totalToday: number
  averageResponseTime: string
}

// -----------------------------------------------------------------------------
// Addresses
// -----------------------------------------------------------------------------

export interface TAddress {
  id: string
  firstName: string
  lastName: string
  street: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
}

export type TBillingAddress = Omit<TAddress, 'isDefault' | 'phone'>
export type TOrderAddress = Omit<TAddress, 'id' | 'isDefault'>

// -----------------------------------------------------------------------------
// Orders
// -----------------------------------------------------------------------------


export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type TPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type TInventoryStatus = 'pending' | 'adjusted' | 'failed';
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'received'

export interface OrderBase {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
}

export interface OrderTotals {
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export interface OrderTotalsWithDiscount extends OrderTotals {
  discount: number
}

export interface TOrder extends OrderBase, OrderTotals {
  items: TCartItem[]
  shippingAddress: TAddress
  trackingNumber?: string
}

export interface TOrderProps extends OrderBase, OrderTotalsWithDiscount {
  dateRaw: string
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  deliveredDate?: string
  items: Array<{
    id: string
    product: {
      id: string
      name: string
      images: IImage[]
      price: number
      color: string | null
      size: string | null
      sku: string
    }
    quantity: number
  }>
  shippingAddress: TAddress
  billingAddress: TBillingAddress
  paymentMethod: {
    type: string
    brand: string
    last4: string
    expiryMonth: number
    expiryYear: number
  }
  timeline?: Array<{
    status: string
    date: string
    completed: boolean
  }>
}

export type LoginUser = {
  email: string;
  emailVerified: boolean;
  id: string;
  image?: string | null;
  name: string;
  createdAt: Date;
}

export interface TAdminOrder extends OrderBase, OrderTotalsWithDiscount {
  customer: { name: string; email: string }
  items: number
  orderItems: Array<{
    id: string
    productId: string
    name: string
    variant: string
    quantity: number
    price: number
    image: string
  }>
  paymentStatus: TPaymentStatus
  shippingAddress: TOrderAddress
  statusHistory: Array<{
    status: OrderStatus
    date: string
    note?: string
  }>
  returnRequests: Array<{
    id: string
    returnNumber: string
    status: ReturnStatus
    adminNote?: string
    createdAt: string
    items: Array<{
      orderItemId: string
      productName: string
      image?: string
      quantity: number
      reason: string
    }>
  }>
}

export type AdminOrderStats = Record<OrderStatus, number>

// -----------------------------------------------------------------------------
// Admin
// -----------------------------------------------------------------------------

export type UserStatus = 'active' | 'inactive' | 'suspended'
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
export type PurchaseStatus = 'pending' | 'ordered' | 'in_transit' | 'received' | 'cancelled'

export interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  pendingOrders: number
  pendingReviews: number
}

export interface DashboardActivity {
  id: string
  type: 'order' | 'review' | 'user' | 'product'
  message: string
  time: string
}

export interface TableColumn<T> {
  key: string
  title: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface FilterOption {
  value: string
  label: string
}

export interface AdminNotification extends Timestamped {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
}

export type ActionType = 'approve' | 'reject' | 'delete' | 'activate' | 'deactivate' | 'publish' | 'unpublish' | 'edit' | 'cancel'

// -----------------------------------------------------------------------------
// Resources / API config
// -----------------------------------------------------------------------------

export interface ResourceMap {
  review: DBReview
  product: DBProduct
  user: DBUser
  order: TAdminOrder
  purchase: DBPurchase
}

export type Resource = keyof ResourceMap

export const RESOURCE_CONFIG = {
  review: {
    endpoint: '/api/reviews',
    queryKey: ['reviews-dashboard'],
  },
  product: {
    endpoint: '/api/products',
    queryKey: ['products-dashboard'],
  },
  user: {
    endpoint: '/api/users',
    queryKey: ['users-dashboard'],
  },
  order: {
    endpoint: '/api/orders',
    queryKey: ['orders-dashboard'],
  },
  purchase: {
    endpoint: '/api/purchases',
    queryKey: ['purchases-dashboard'],
  }
} as const satisfies Record<Resource, { endpoint: string; queryKey: readonly string[] }>

export const ENDPOINT_MAP: Record<Resource, string> = Object.fromEntries(
  Object.entries(RESOURCE_CONFIG).map(([resource, config]) => [resource, config.endpoint])
) as Record<Resource, string>

export type ConfirmState<R extends Resource> = {
  open: boolean
  type: ActionType
  ids: string[]
  resource: R
}

export type DBProduct = WithId<ProductFormData>
export type DBPurchase = WithId<PurchaseFormValues>
export type DBUser = WithId<ZUser>

export interface ListResponse<T> {
  items: T[]
  total?: number
}

export const ACTION_STATUS_MAP: Partial<Record<ActionType, string>> = {
  approve: 'approved',
  reject: 'rejected',
  activate: 'active',
  deactivate: 'disabled',
  publish: 'published',
  unpublish: 'draft',
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

export type RedirectProps = {
  searchParams?: Promise<{
    redirectTo?: string
  }>
}

// -----------------------------------------------------------------------------
// Checkout
// -----------------------------------------------------------------------------

export type TShippingMethod = 'standard' | 'express' | 'overnight'

export type TShippingFormData = Omit<TAddress, 'id' | 'isDefault'> & {
  email: string
  shippingMethod: TShippingMethod
  saveAddress: boolean
  createAccount: boolean
}

export interface TPaymentFormProps {
  onSubmit: (data: TPaymentFormData) => void
  onBack: () => void
  isProcessing?: boolean
}

export type TPaymentMethod = 'stripe'
export type TPaymentFormData = {
  paymentMethod: TPaymentMethod,
  sameAsShipping: boolean,
  billingAddress: string,
  billingCity: string,
  billingState: string,
  billingZip: string,
}

// -----------------------------------------------------------------------------
// B2B Purchases
// -----------------------------------------------------------------------------

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