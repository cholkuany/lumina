// import { Product } from "./db/models"
import { IImage } from "./db/models/Product"
import { DBReview } from "./queries/get.reviews"
import { ProductFormData } from "./validations/product.validation"
import { ZUser } from "./validations/user.validation"

export interface Product {
  id: string
  name: string
  description: string
  longDescription?: string
  slug: string
  price: number
  originalPrice?: number
  category: {
    name: string
    parent?: string | null
    ancestors?: string[] | null
  },
  unitsSold?: number
  rating: number
  reviewCount: number
  stockCount?: number
  variants: ProductVariant[]
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
  // [key: string]: string | undefined
} & Record<string, string>

export interface ProductVariant {
  id: string
  attributes: Attribute
  price: number
  originalPrice?: number
  stock: number
  sku: string
  images: IImage[]
}


export type CartProductVariant = Omit<ProductVariant, 'stock'>
//  & {
// quantity: number
// image: string
// }
export type CartProduct = Pick<Product, 'id' | 'name' | 'price'>
  & {
    variant: CartProductVariant
  }

export interface CartItem {
  id: string
  product: CartProduct
  quantity: number
  // selectedVariants?: Partial<Attribute>
  variantImage?: string
}

export interface WishlistItem {
  id: string
  product: Product
  addedAt: Date
}

export interface Review {
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

export interface ReviewSubmission {
  productId: string
  rating: number
  title: string
  content: string
  images: IImage[]
  recommendProduct: boolean | null
}

export interface ReviewForModeration extends Review {
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
  reports: ReviewReport[]
  moderationHistory: ModerationAction[]
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  createdAt: string
}

export interface ReviewReport {
  id: string
  reason: string
  details?: string
  reportedBy: string
  createdAt: string
}

export interface ModerationAction {
  id: string
  action: 'approved' | 'rejected' | 'flagged' | 'edited'
  reason?: string
  moderatorId: string
  moderatorName: string
  createdAt: string
}

export interface ModerationStats {
  pending: number
  approved: number
  rejected: number
  flagged: number
  totalToday: number
  averageResponseTime: string
}

export interface Address {
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

export type ShippingAddress = Address
export type BillingAddress = Omit<Address, 'isDefault' | 'phone'>

export interface Order {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: ShippingAddress
  trackingNumber?: string
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderProps {
  id: string
  orderNumber: string
  date: string
  dateRaw: string
  status: OrderStatus
  total: number
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
  shippingAddress: ShippingAddress
  billingAddress: BillingAddress
  paymentMethod: {
    type: string
    brand: string
    last4: string
    expiryMonth: number
    expiryYear: number
  }
  subtotal: number
  shipping: number
  tax: number
  discount: number
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

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged'
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

export interface AdminNotification {
  id: string
  type: 'order' | 'review' | 'user' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export type ActionType = 'approve' | 'reject' | 'delete' | 'activate' | 'deactivate' | 'publish' | 'unpublish' | 'edit' | 'cancel'

export type Resource = 'review' | 'product' | 'user'

export const ENDPOINT_MAP: Record<Resource, string> = {
  review: '/api/reviews',
  product: '/api/products',
  user: '/api/users',
}

export type ConfirmState<R extends Resource> = {
  open: boolean
  type: ActionType
  ids: string[]
  resource: R
}

export interface BaseEntity {
  id: string
  status?: string
}

export type DBProduct = ProductFormData & {
  id: string,
}

export type DBUser = ZUser & {
  id: string
}

export interface ResourceMap {
  review: DBReview
  product: DBProduct
  user: DBUser
}

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
} as const

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}