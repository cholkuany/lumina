import Link from 'next/link'

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c8e637] text-lg font-black text-[#172a22]">L</span>
    <span className="text-2xl font-black tracking-[-.06em] text-[#172a22] lg:text-3xl">
      LUMINA<span className="text-[#e64d25]">.</span>
    </span>
  </Link>
)
