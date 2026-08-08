import Link from 'next/link'
import { ArrowRight, Home, Search } from 'lucide-react'

export function NotFoundContent() {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-[#f8fafc] px-6 py-20 sm:px-10">
      <div
        aria-hidden="true"
        className="absolute -left-28 top-12 h-72 w-72 rounded-full bg-[#c8e637]/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#e64d25]/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-3xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-[#172a22]/10 bg-white shadow-[0_16px_50px_rgba(23,42,34,0.12)]">
          <Search aria-hidden="true" className="h-9 w-9 text-[#172a22]" strokeWidth={2.25} />
        </div>

        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.28em] text-[#e64d25]">
          404
        </p>
        <h1 className="text-balance text-5xl font-black tracking-[-0.055em] text-[#172a22] sm:text-7xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-[#5f6f68] sm:text-lg">
          The page you&apos;re looking for may have moved, or never existed.
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#172a22] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#243d33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172a22] focus-visible:ring-offset-2"
          >
            <Home aria-hidden="true" className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#172a22]/15 bg-white px-6 text-sm font-bold text-[#172a22] shadow-sm transition hover:-translate-y-0.5 hover:border-[#172a22]/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172a22] focus-visible:ring-offset-2"
          >
            Browse products
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-12 text-sm text-[#7b8983]">
          Need a hand?{' '}
          <Link
            href="/#footer"
            className="font-bold text-[#172a22] underline decoration-[#c8e637] decoration-2 underline-offset-4"
          >
            Contact support
          </Link>
        </p>
      </div>
    </main>
  )
}
