import Link from 'next/link'

export const HeaderBanner = () => (
  <div className="bg-text-primary text-white" >
    <div className="container-lumina flex items-center gap-6 overflow-x-auto py-3 text-sm whitespace-nowrap scrollHiddened">
      <Link href="/sale" className="font-extrabold text-primary">Today&apos;s Deals</Link>
      <Link href="/products?sort=popular" className="hover:text-primary">Best Sellers</Link>
      <Link href="/products?sort=newest" className="hover:text-primary">New Arrivals</Link>
      <Link href="/products?category=electronics" className="hover:text-primary">Electronics</Link>
      <Link href="/products?category=fashion" className="hover:text-primary">Fashion</Link>
      <Link href="/products?category=home" className="hover:text-primary">Home</Link>
      <Link href="/products?category=beauty" className="hover:text-primary">Beauty</Link>
      <Link href="/products" className="font-bold text-primary">Shop all</Link>
    </div>
  </div>
)