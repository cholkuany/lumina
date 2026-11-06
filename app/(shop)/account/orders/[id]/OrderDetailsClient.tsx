'use client'

import { useState } from 'react'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CancelOrderContent } from '@/components/account/order/CancelOrderContent'
import { HelpContent } from '@/components/account/order/HelpContent'
import { Modal } from '@/components/account/order/Modal'
import { getReturnedQuantities, type CustomerReturn } from '@/lib/returnTypes'
import type { TOrderProps } from '@/lib/types'
import { OrderActions } from '@/components/account/order/OrderActions'
import { OrderHeader } from '@/components/account/order/OrderHeader'
import { OrderItemsCard } from '@/components/account/order/OrderItemsCard'
import { OrderTimeline } from '@/components/account/order/OrderTimeline'
import { PaymentCard } from '@/components/account/order/PaymentCard'
import { ReturnItemsContent } from '@/components/account/order/ReturnItemsContent'
import { ReturnRequestsCard } from '@/components/account/order/ReturnRequestsCard'
import { ShippingAddressCard } from '@/components/account/order/ShippingAddressCard'
import { TrackingCard } from '@/components/account/order/TrackingCard'
import { OrderNotFound } from './OrderNotFound'

type ModalName = 'return' | 'cancel' | 'help' | null

type Props = {
  order: TOrderProps | null
  returns?: CustomerReturn[]
}

export function OrderDetailsClient({ order, returns = [] }: Props) {
  const [openModal, setOpenModal] = useState<ModalName>(null)
  const close = () => setOpenModal(null)

  if (!order) return <OrderNotFound />

  const returnedQuantities = getReturnedQuantities(returns)
  const canReturn = order.items.some((item) => item.quantity - (returnedQuantities[item.id] ?? 0) > 0)

  return (
    <main className="pb-16">
      <div className="container-lumina py-4">
        <Breadcrumb
          items={[
            { label: 'My Account', href: '/account' },
            { label: 'Orders', href: '/account/orders' },
            { label: order.orderNumber },
          ]}
        />
      </div>

      <div className="container-lumina">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block">
            <AccountSidebar />
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <OrderHeader order={order} />
            <TrackingCard order={order} />
            <OrderTimeline timeline={order.timeline} />
            <OrderItemsCard order={order} returnedQuantities={returnedQuantities} />
            <ReturnRequestsCard returns={returns} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ShippingAddressCard address={order.shippingAddress} />
              <PaymentCard paymentMethod={order.paymentMethod} billingAddress={order.billingAddress} />
            </div>

            <OrderActions
              order={order}
              canReturn={canReturn}
              onReturn={() => setOpenModal('return')}
              onCancel={() => setOpenModal('cancel')}
              onHelp={() => setOpenModal('help')}
            />
          </div>
        </div>
      </div>

      {/* Modal bodies mount only while open, so forms start fresh every time. */}
      <Modal isOpen={openModal === 'return'} onClose={close} title="Return Items">
        <ReturnItemsContent order={order} returns={returns} onClose={close} />
      </Modal>

      <Modal isOpen={openModal === 'cancel'} onClose={close} title="Cancel Order">
        <CancelOrderContent order={order} onClose={close} />
      </Modal>

      <Modal isOpen={openModal === 'help'} onClose={close} title="Get Help">
        <HelpContent order={order} onClose={close} />
      </Modal>
    </main>
  )
}