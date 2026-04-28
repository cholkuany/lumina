// app/return-policy/page.tsx
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  RotateCcw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  AlertTriangle,
  Info,
  HelpCircle,
  ArrowRight,
  Gift,
  Truck,
  Camera,
  Mail,
  FileText
} from 'lucide-react'

const lastUpdated = 'December 15, 2024'

const returnableItems = [
  'Clothing and apparel (unworn, with tags attached)',
  'Shoes (unworn, in original box)',
  'Accessories (unused, in original packaging)',
  'Home goods (unused, in original packaging)',
  'Electronics (unopened, in original packaging)',
  'Beauty products (unopened, sealed)',
]

const nonReturnableItems = [
  'Personalized or custom-made items',
  'Intimate apparel and swimwear',
  'Final sale or clearance items',
  'Gift cards',
  'Perishable goods',
  'Items marked as non-returnable',
  'Used, worn, or altered items',
  'Items without original tags or packaging',
]

const refundTimeline = [
  { step: 'Return Initiated', time: 'Day 1', description: 'You request a return through your account' },
  { step: 'Return Shipped', time: 'Day 1-3', description: 'Ship your items using the provided label' },
  { step: 'Return Received', time: 'Day 5-10', description: 'We receive and inspect your return' },
  { step: 'Refund Processed', time: 'Day 6-11', description: 'Refund is processed after inspection' },
  { step: 'Funds Returned', time: 'Day 8-16', description: 'Funds appear in your original payment method' },
]

export default function ReturnPolicyPage() {
  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb items={[{ label: 'Return Policy' }]} />
      </div>

      {/* Hero Section */}
      <section className="bg-linen py-12 lg:py-16">
        <div className="container-lumina">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-4">
              Return & Refund Policy
            </h1>
            <p className="text-warm-gray-dark">
              We want you to love your purchase. If you&pos;re not completely satisfied, we&pos;re here to help.
            </p>
            <p className="text-sm text-warm-gray-dark mt-4">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="container-lumina py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-warm-gray-light rounded-brand p-5 text-center">
            <Clock className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-medium text-charcoal mb-1">30-Day Returns</h3>
            <p className="text-sm text-warm-gray-dark">From delivery date</p>
          </div>
          <div className="bg-white border border-warm-gray-light rounded-brand p-5 text-center">
            <Truck className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-medium text-charcoal mb-1">Free Return Shipping</h3>
            <p className="text-sm text-warm-gray-dark">Prepaid labels included</p>
          </div>
          <div className="bg-white border border-warm-gray-light rounded-brand p-5 text-center">
            <CreditCard className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-medium text-charcoal mb-1">Full Refunds</h3>
            <p className="text-sm text-warm-gray-dark">To original payment</p>
          </div>
          <div className="bg-white border border-warm-gray-light rounded-brand p-5 text-center">
            <Gift className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-medium text-charcoal mb-1">Easy Exchanges</h3>
            <p className="text-sm text-warm-gray-dark">Swap for different size/color</p>
          </div>
        </div>
      </section>

      <div className="container-lumina py-8">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Return Policy Overview */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-gold" />
              Return Policy Overview
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6 space-y-4">
              <p className="text-warm-gray-dark">
                We offer a <strong className="text-charcoal">30-day return policy</strong> from the date of delivery.
                If you&pos;re not completely satisfied with your purchase, you can return it for a full refund or exchange
                within this period.
              </p>
              <p className="text-warm-gray-dark">
                Items must be returned in their original condition, unworn/unused, with all tags attached and in the
                original packaging. Items that show signs of wear, washing, or alterations will not be accepted.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="font-medium text-green-800">Extended Holiday Returns</p>
                    <p className="text-sm text-green-700 mt-1">
                      Orders placed between November 1 and December 31 can be returned until January 31 of the following year.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Returnable vs Non-Returnable */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-gold" />
              What Can Be Returned?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Returnable Items */}
              <div className="bg-white border border-green-200 rounded-brand p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-medium text-charcoal text-lg">Returnable Items</h3>
                </div>
                <ul className="space-y-3">
                  {returnableItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-warm-gray-dark">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Non-Returnable Items */}
              <div className="bg-white border border-red-200 rounded-brand p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <h3 className="font-medium text-charcoal text-lg">Non-Returnable Items</h3>
                </div>
                <ul className="space-y-3">
                  {nonReturnableItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-warm-gray-dark">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-1" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* How to Return */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-gold" />
              How to Start a Return
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6">
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-medium shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-charcoal mb-2">Initiate Your Return</h3>
                    <p className="text-warm-gray-dark text-sm mb-3">
                      Log into your account and go to your order history. Find the order you want to return and click
                      &quot;Return Items.&quot; Select the items you wish to return and provide a reason.
                    </p>
                    <Link
                      href="/account/orders"
                      className="inline-flex items-center gap-2 text-gold hover:underline text-sm"
                    >
                      Go to Order History
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-medium shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-charcoal mb-2">Print Your Return Label</h3>
                    <p className="text-warm-gray-dark text-sm">
                      Once your return is approved, you&pos;ll receive a prepaid return shipping label via email.
                      Print the label and attach it to your package. If you don&pos;t have a printer, you can use
                      a QR code at participating carrier locations.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-medium shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-charcoal mb-2">Pack Your Items</h3>
                    <p className="text-warm-gray-dark text-sm">
                      Place items in their original packaging with all tags attached. If you no longer have the
                      original packaging, use a sturdy box or mailer to protect your items during shipping.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-medium shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-charcoal mb-2">Drop Off Your Package</h3>
                    <p className="text-warm-gray-dark text-sm">
                      Drop off your package at any UPS, FedEx, or USPS location (depending on your return label).
                      Keep your receipt as proof of shipment until your return is processed.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-medium shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-charcoal mb-2">Receive Your Refund</h3>
                    <p className="text-warm-gray-dark text-sm">
                      Once we receive and inspect your return, we&pos;ll process your refund within 2-3 business days.
                      You&pos;ll receive an email confirmation when your refund is issued.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">No Account? No Problem!</p>
                  <p className="text-sm text-blue-700 mt-1">
                    If you checked out as a guest, you can initiate a return by contacting our customer service team
                    with your order number and email address.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Timeline */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-gold" />
              Refund Timeline
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6">
              <div className="space-y-4">
                {refundTimeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${index === refundTimeline.length - 1 ? 'bg-green-500' : 'bg-gold'}`} />
                      {index < refundTimeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-warm-gray-light" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-charcoal">{item.step}</h4>
                        <span className="text-sm text-gold font-medium">{item.time}</span>
                      </div>
                      <p className="text-sm text-warm-gray-dark mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-warm-gray-light">
                <h4 className="font-medium text-charcoal mb-3">Refund Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-warm-gray-dark">
                  <div className="flex items-start gap-2">
                    <CreditCard className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-charcoal">Credit/Debit Card</p>
                      <p>5-10 business days after processing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-charcoal">PayPal</p>
                      <p>3-5 business days after processing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Gift className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-charcoal">Store Credit</p>
                      <p>Instant - available immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-charcoal">Gift Card Payment</p>
                      <p>Refunded as store credit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Exchanges */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <Gift className="w-6 h-6 text-gold" />
              Exchanges
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6 space-y-4">
              <p className="text-warm-gray-dark">
                Need a different size or color? We make exchanges easy! Here&pos;s how our exchange process works:
              </p>

              <div className="space-y-4">
                <div className="bg-linen rounded-lg p-4">
                  <h4 className="font-medium text-charcoal mb-2">Option 1: Return & Reorder (Recommended)</h4>
                  <p className="text-sm text-warm-gray-dark">
                    For the fastest exchange, we recommend returning your item for a refund and placing a new order
                    for the desired item. This ensures you get your new item as quickly as possible, especially if
                    sizes are limited.
                  </p>
                </div>

                <div className="bg-linen rounded-lg p-4">
                  <h4 className="font-medium text-charcoal mb-2">Option 2: Direct Exchange</h4>
                  <p className="text-sm text-warm-gray-dark">
                    You can also request a direct exchange when initiating your return. Select &quot;Exchange&quot; instead of
                    &quot;Refund&quot; and choose your new size/color. Your new item will ship once we receive your return.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800">Price Differences</p>
                    <p className="text-sm text-amber-700 mt-1">
                      If your exchange item has a different price, you&pos;ll be charged or refunded the difference.
                      Sale prices apply at the time of the exchange.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Damaged or Defective Items */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-gold" />
              Damaged or Defective Items
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6 space-y-4">
              <p className="text-warm-gray-dark">
                If you receive a damaged or defective item, we sincerely apologize. Please contact us within
                <strong className="text-charcoal"> 48 hours of delivery</strong> and we&pos;ll make it right.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Camera className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-charcoal">Document the Damage</h4>
                    <p className="text-sm text-warm-gray-dark">
                      Take clear photos of the damaged item and packaging. This helps us process your claim quickly
                      and improve our packaging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-charcoal">Contact Customer Service</h4>
                    <p className="text-sm text-warm-gray-dark">
                      Email us at <a href="mailto:returns@lumina.com" className="text-gold hover:underline">returns@lumina.com</a> or
                      call 1-800-LUMINA with your order number and photos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-charcoal">Resolution Options</h4>
                    <p className="text-sm text-warm-gray-dark">
                      We&pos;ll offer a full refund or replacement at no additional cost. In most cases, you won&pos;t need
                      to return the damaged item.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* International Returns */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <Truck className="w-6 h-6 text-gold" />
              International Returns
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6 space-y-4">
              <p className="text-warm-gray-dark">
                We accept returns from international orders, though the process differs slightly from domestic returns.
              </p>

              <ul className="list-disc pl-6 text-warm-gray-dark space-y-2">
                <li>Return shipping costs for international orders are the responsibility of the customer</li>
                <li>We recommend using a trackable shipping method with insurance</li>
                <li>Customs duties and taxes paid on the original order are non-refundable</li>
                <li>Please mark the package as &quot;Returned Merchandise&quot; to avoid additional customs fees</li>
                <li>International returns may take 2-4 weeks to reach our warehouse</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 hrink-0" />
                  <div>
                    <p className="font-medium text-blue-800">Canadian Customers</p>
                    <p className="text-sm text-blue-700 mt-1">
                      We offer discounted return shipping rates for Canadian customers. Contact customer service
                      for a prepaid return label at a reduced rate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gift Returns */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <Gift className="w-6 h-6 text-gold" />
              Gift Returns
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6 space-y-4">
              <p className="text-warm-gray-dark">
                Received a gift that doesn&pos;t quite fit? We&pos;ve got you covered.
              </p>

              <div className="space-y-4">
                <div className="bg-linen rounded-lg p-4">
                  <h4 className="font-medium text-charcoal mb-2">With Gift Receipt</h4>
                  <p className="text-sm text-warm-gray-dark">
                    If you have a gift receipt, you can return the item for store credit equal to the purchase price.
                    You can also exchange for a different size or color.
                  </p>
                </div>

                <div className="bg-linen rounded-lg p-4">
                  <h4 className="font-medium text-charcoal mb-2">Without Gift Receipt</h4>
                  <p className="text-sm text-warm-gray-dark">
                    No gift receipt? No problem. Contact us with the gift giver&pos;s name or email address, and we&pos;ll
                    help locate the order. Refunds will be issued as store credit at the current selling price.
                  </p>
                </div>
              </div>

              <p className="text-sm text-warm-gray-dark">
                <strong>Note:</strong> Gift returns are processed as store credit to protect the gift giver&apos;s privacy.
                The original purchaser will not be notified of the return.
              </p>
            </div>
          </section>

          {/* Refund Exceptions */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-gold" />
              Refund Exceptions & Deductions
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6 space-y-4">
              <p className="text-warm-gray-dark">
                In certain circumstances, refunds may be subject to deductions or exceptions:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-charcoal">Original Shipping Costs</p>
                    <p className="text-sm text-warm-gray-dark">
                      Original shipping costs are non-refundable unless the return is due to our error (wrong item,
                      defective product, etc.)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-charcoal">Items Not in Original Condition</p>
                    <p className="text-sm text-warm-gray-dark">
                      Items returned with signs of wear, missing tags, or not in original packaging may be subject
                      to a restocking fee of up to 20% or may be rejected.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-charcoal">Late Returns</p>
                    <p className="text-sm text-warm-gray-dark">
                      Returns received after the 30-day window may be accepted at our discretion and refunded as
                      store credit only.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-charcoal">Promotional Items</p>
                    <p className="text-sm text-warm-gray-dark">
                      Free gifts or promotional items must be returned with the qualifying purchase, or their value
                      will be deducted from your refund.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-gold" />
              Frequently Asked Questions
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand divide-y divide-warm-gray-light">
              <div className="p-6">
                <h4 className="font-medium text-charcoal mb-2">How long do I have to return an item?</h4>
                <p className="text-sm text-warm-gray-dark">
                  You have 30 days from the delivery date to return your items. For holiday purchases made between
                  November 1 and December 31, you have until January 31 to return.
                </p>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-charcoal mb-2">Do I have to pay for return shipping?</h4>
                <p className="text-sm text-warm-gray-dark">
                  Return shipping is free for all domestic orders. We provide a prepaid return label. International
                  customers are responsible for return shipping costs.
                </p>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-charcoal mb-2">Can I return sale items?</h4>
                <p className="text-sm text-warm-gray-dark">
                  Yes, sale items can be returned within the standard 30-day window unless marked as &quot;Final Sale.&quot;
                  Final Sale items cannot be returned or exchanged.
                </p>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-charcoal mb-2">What if I lost my receipt?</h4>
                <p className="text-sm text-warm-gray-dark">
                  No problem! We can look up your order using your email address or the credit card used for purchase.
                  Contact customer service for assistance.
                </p>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-charcoal mb-2">Can I return an item to a store?</h4>
                <p className="text-sm text-warm-gray-dark">
                  Currently, we are an online-only retailer and do not have physical stores. All returns must be
                  shipped back to our warehouse using the provided return label.
                </p>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-charcoal mb-2">Why was my return rejected?</h4>
                <p className="text-sm text-warm-gray-dark">
                  Returns may be rejected if items are worn, washed, damaged, missing tags, or returned outside the
                  return window. If your return was rejected, we&pos;ll contact you to discuss options.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6">Need Help?</h2>
            <div className="bg-linen rounded-brand p-6">
              <p className="text-warm-gray-dark mb-4">
                Our customer service team is here to help with any questions about returns, refunds, or exchanges.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <Mail className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="font-medium text-charcoal text-sm">Email</p>
                  <a href="mailto:returns@lumina.com" className="text-gold hover:underline text-sm">
                    returns@lumina.com
                  </a>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <HelpCircle className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="font-medium text-charcoal text-sm">Phone</p>
                  <a href="tel:1-800-LUMINA" className="text-gold hover:underline text-sm">
                    1-800-LUMINA
                  </a>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="font-medium text-charcoal text-sm">Hours</p>
                  <p className="text-warm-gray-dark text-sm">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>
            </div>
          </section>

          {/* Related Links */}
          <div className="p-6 bg-white border border-warm-gray-light rounded-brand">
            <h3 className="font-serif text-lg text-charcoal mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/shipping-policy" className="inline-flex items-center gap-2 text-gold hover:underline">
                <Truck className="w-4 h-4" />
                Shipping Policy
              </Link>
              <Link href="/terms" className="inline-flex items-center gap-2 text-gold hover:underline">
                <FileText className="w-4 h-4" />
                Terms of Service
              </Link>
              <Link href="/privacy" className="inline-flex items-center gap-2 text-gold hover:underline">
                <FileText className="w-4 h-4" />
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}