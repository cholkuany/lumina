import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Settings,
} from 'lucide-react'

export const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'Categories',
    href: '/categories',
    children: [
      { name: 'Electronics', href: '/categories/electronics' },
      { name: 'Fashion', href: '/categories/fashion' },
      { name: 'Home & Living', href: '/categories/home' },
      { name: 'Beauty', href: '/categories/beauty' },
      { name: 'Sports', href: '/categories/sports' },
      { name: 'View All Categories', href: '/categories' },
    ],
  },
  { name: 'Deals', href: '/products?filter=sale' },
  { name: 'New Arrivals', href: '/products?filter=new' },
]

export const userMenuItems = [
  { name: 'My Account', href: '/account', icon: User },
  { name: 'Orders', href: '/account/orders', icon: Package },
  { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Payment Methods', href: '/account/payment-methods', icon: CreditCard },
  { name: 'Wishlist', href: '/wishlist', icon: Heart },
  { name: 'Settings', href: '/account/settings', icon: Settings },
]