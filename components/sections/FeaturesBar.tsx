// components/sections/FeaturesBar.tsx
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react'

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', description: '100% protected' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', description: 'Dedicated help' },
]

export function FeaturesBar() {
  return (
    <section className="py-8 border-b border-warm-gray-light">
      <div className="container-lumina">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-linen flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-medium text-charcoal text-sm">
                  {feature.title}
                </h4>
                <p className="text-warm-gray-dark text-xs">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}