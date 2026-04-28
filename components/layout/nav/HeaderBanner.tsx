import Link from 'next/link'

export const HeaderBanner = () => (
  <div className="bg-charcoal text-white text-center py-2 text-sm">
    Free shipping on orders over $50 ✨{' '}
    <Link href="/products?filter=sale" className="underline hover:text-gold">
      Shop Deals
    </Link>
  </div>
)