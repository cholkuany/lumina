// components/sections/Hero.tsx
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/andrey-ilkevich-7aUb9PSKmc8-unsplash.jpg"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-lumina relative z-10">
        <div className="max-w-xl">
          <span className="inline-block text-gold font-medium text-sm tracking-wider mb-4">
            NEW COLLECTION 2025
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-semibold leading-tight mb-6">
            Discover What
            <br />
            <span className="text-gold">Inspires You</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-md">
            Explore our curated collection of premium products.
            Quality meets style in every piece.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" variant="gold">
              Shop Collection
            </Button>
            <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white hover:text-charcoal">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}