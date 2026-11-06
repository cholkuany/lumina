import Link from "next/link"

import { Package } from "lucide-react"

import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { Button } from "@/components/ui/Button"

export const OrderNotFound = () => {
  return (
    <main className="pb-16">
      <div className="container-lumina py-4">
        <Breadcrumb
          items={[
            { label: 'My Account', href: '/account' },
            { label: 'Orders', href: '/account/orders' },
            { label: 'Order Not Found' },
          ]}
        />
      </div>

      <div className="container-lumina">
        <div className="text-center py-16 bg-surface rounded-brand">
          <Package className="w-16 h-16 text-border-dark mx-auto mb-4" />
          <h2 className="font-serif text-xl text-foreground mb-2">
            Order Not Found
          </h2>
          <p className="text-border-dark mb-6">
            We couldn&apos;t find an order with that number.
          </p>
          <Link href="/account/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}