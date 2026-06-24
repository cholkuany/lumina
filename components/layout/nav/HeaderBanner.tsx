import Link from 'next/link'

export const HeaderBanner = () => (
  <div className="bg-charcoal text-white" >
    <div className="container-lumina flex items-center gap-6 overflow-x-auto py-3 text-sm whitespace-nowrap scrollHiddened">
      <Link href="/sale" className="font-extrabold text-gold">Today&apos;s Deals</Link>
      <Link href="/products?sort=popular" className="hover:text-gold">Best Sellers</Link>
      <Link href="/products?sort=newest" className="hover:text-gold">New Arrivals</Link>
      <Link href="/products?category=electronics" className="hover:text-gold">Electronics</Link>
      <Link href="/products?category=fashion" className="hover:text-gold">Fashion</Link>
      <Link href="/products?category=home" className="hover:text-gold">Home</Link>
      <Link href="/products?category=beauty" className="hover:text-gold">Beauty</Link>
      <Link href="/products" className="font-bold text-gold">Shop all</Link>
    </div>
  </div>
)