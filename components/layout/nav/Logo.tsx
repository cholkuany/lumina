import Link from 'next/link'

export const Logo = () => (
  <Link href="/" className="flex items-baseline gap-0.5 whitespace-nowrap font-serif text-xl font-bold text-white md:text-2xl">
    Lumina
    <span className="text-2xl leading-none text-gold md:text-[28px]">.</span>
  </Link>
)