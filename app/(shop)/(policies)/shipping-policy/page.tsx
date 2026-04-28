// app/shipping-policy/page.tsx
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  Truck,
  Package,
  Clock,
  MapPin,
  Globe,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  DollarSign
} from 'lucide-react'

const lastUpdated = 'December 15, 2024'

const shippingMethods = [
  {
    name: 'Standard Shipping',
    time: '5-7 business days',
    cost: 'Free on orders $75+',
    costBelow: '$5.99',
    description: 'Reliable ground shipping for non-urgent orders',
  },
  {
    name: 'Express Shipping',
    time: '2-3 business days',
    cost: '$12.99',
    costBelow: '$12.99',
    description: 'Faster delivery for time-sensitive orders',
  },
  {
    name: 'Next Day Shipping',
    time: '1 business day',
    cost: '$24.99',
    costBelow: '$24.99',
    description: 'Order by 2 PM EST for next business day delivery',
  },
  {
    name: 'Same Day Delivery',
    time: 'Same day',
    cost: '$34.99',
    costBelow: '$34.99',
    description: 'Available in select metro areas, order by 12 PM',
  },
]

const internationalZones = [
  { zone: 'Canada', time: '7-14 business days', cost: 'Starting at $15.99' },
  { zone: 'Mexico', time: '10-18 business days', cost: 'Starting at $19.99' },
  { zone: 'UK & Europe', time: '10-21 business days', cost: 'Starting at $24.99' },
  { zone: 'Australia & New Zealand', time: '14-28 business days', cost: 'Starting at $29.99' },
  { zone: 'Asia', time: '14-28 business days', cost: 'Starting at $29.99' },
  { zone: 'Rest of World', time: '21-35 business days', cost: 'Starting at $39.99' },
]

export default function ShippingPolicyPage() {
  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb items={[{ label: 'Shipping Policy' }]} />
      </div>

      {/* Hero Section */}
      <section className="bg-linen py-12 lg:py-16">
        <div className="container-lumina">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-4">
              Shipping Policy
            </h1>
            <p className="text-warm-gray-dark">
              Fast, reliable shipping to your doorstep. Learn about our delivery options and policies.
            </p>
            <p className="text-sm text-warm-gray-dark mt-4">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="container-lumina py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-warm-gray-light rounded-brand p-5 text-center">
            <DollarSign className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-medium text-charcoal mb-1">Free Shipping</h3>
            <p className="text-sm text-warm-gray-dark">On orders $75+</p>
          </div>
          <div className="bg-white border border-warm-gray-light rounded-brand p-5 text-center">
            <Clock className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-medium text-charcoal mb-1">Fast Processing</h3>
            <p className="text-sm text-warm-gray-dark">Ships within 1-2 days</p>
          </div>
          <div className="bg-white border border-warm-gray-light rounded-brand p-5 text-center">
            <Globe className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-medium text-charcoal mb-1">Global Delivery</h3>
            <p className="text-sm text-warm-gray-dark">Ships to 100+ countries</p>
          </div>
          <div className="bg-white border border-warm-gray-light rounded-brand p-5 text-center">
            <MapPin className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-medium text-charcoal mb-1">Order Tracking</h3>
            <p className="text-sm text-warm-gray-dark">Real-time updates</p>
          </div>
        </div>
      </section>

      <div className="container-lumina py-8">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Domestic Shipping */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-gold" />
              Domestic Shipping (United States)
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linen">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Shipping Method</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Delivery Time</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-gray-light">
                    {shippingMethods.map((method, index) => (
                      <tr key={index} className="hover:bg-linen/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-charcoal">{method.name}</p>
                          <p className="text-sm text-warm-gray-dark">{method.description}</p>
                        </td>
                        <td className="px-6 py-4 text-warm-gray-dark">{method.time}</td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-charcoal">{method.cost}</span>
                          {method.cost.includes('Free') && (
                            <p className="text-sm text-warm-gray-dark">{method.costBelow} under $75</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="font-medium text-green-800">Free Shipping Threshold</p>
                    <p className="text-sm text-green-700 mt-1">
                      Spend $75 or more to qualify for free standard shipping on your order.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800">Processing Time</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Orders placed before 2 PM EST are processed the same business day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-gold" />
              International Shipping
            </h2>

            <p className="text-warm-gray-dark mb-6">
              We ship to over 100 countries worldwide. International shipping rates and delivery times vary by destination.
            </p>

            <div className="bg-white border border-warm-gray-light rounded-brand overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linen">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Destination</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Delivery Time</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Shipping Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-gray-light">
                    {internationalZones.map((zone, index) => (
                      <tr key={index} className="hover:bg-linen/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-charcoal">{zone.zone}</td>
                        <td className="px-6 py-4 text-warm-gray-dark">{zone.time}</td>
                        <td className="px-6 py-4 text-warm-gray-dark">{zone.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Customs & Duties</p>
                  <p className="text-sm text-amber-700 mt-1">
                    International orders may be subject to customs duties, taxes, and fees imposed by the destination country.
                    These charges are the responsibility of the recipient and are not included in our shipping costs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Order Processing */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-gold" />
              Order Processing
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6 space-y-4">
              <div>
                <h3 className="font-medium text-charcoal mb-2">Processing Times</h3>
                <ul className="list-disc pl-6 text-warm-gray-dark space-y-2">
                  <li>Orders are processed Monday through Friday, excluding holidays</li>
                  <li>Orders placed before 2:00 PM EST ship the same business day</li>
                  <li>Orders placed after 2:00 PM EST or on weekends ship the next business day</li>
                  <li>During peak seasons (holidays, sales), processing may take 1-2 additional days</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-charcoal mb-2">Order Confirmation</h3>
                <p className="text-warm-gray-dark">
                  You will receive an email confirmation when your order is placed and another when it ships with
                  tracking information. You can also track your order in your account dashboard.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-charcoal mb-2">Multiple Items</h3>
                <p className="text-warm-gray-dark">
                  If your order contains multiple items, they may ship separately from different warehouses.
                  You will receive tracking information for each shipment.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping Restrictions */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-gold" />
              Shipping Restrictions
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6 space-y-4">
              <div>
                <h3 className="font-medium text-charcoal mb-2">PO Boxes & APO/FPO Addresses</h3>
                <p className="text-warm-gray-dark">
                  We can ship to PO Boxes and APO/FPO addresses via USPS. Express and Next Day shipping options
                  are not available for these addresses.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-charcoal mb-2">Restricted Destinations</h3>
                <p className="text-warm-gray-dark">
                  Due to shipping carrier restrictions, we cannot ship to certain countries. If your country is not
                  available at checkout, we are unable to deliver to that location at this time.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-charcoal mb-2">Hazardous Materials</h3>
                <p className="text-warm-gray-dark">
                  Some products containing batteries, liquids, or aerosols may have shipping restrictions and
                  may not be available for all shipping methods or international destinations.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-charcoal mb-2">Large or Heavy Items</h3>
                <p className="text-warm-gray-dark">
                  Oversized or heavy items may incur additional shipping charges. These charges will be displayed
                  at checkout before you complete your order.
                </p>
              </div>
            </div>
          </section>

          {/* Tracking Your Order */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-gold" />
              Tracking Your Order
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6 space-y-4">
              <p className="text-warm-gray-dark">
                Once your order ships, you will receive an email with tracking information. You can track your order by:
              </p>
              <ul className="list-disc pl-6 text-warm-gray-dark space-y-2">
                <li>Clicking the tracking link in your shipping confirmation email</li>
                <li>Logging into your account and viewing your order history</li>
                <li>Entering your tracking number on the carrier&apos;s website</li>
              </ul>
              <p className="text-warm-gray-dark">
                Please allow up to 24 hours for tracking information to become active after receiving your
                shipping confirmation.
              </p>
            </div>
          </section>

          {/* Delivery Issues */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-gold" />
              Delivery Issues
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6 space-y-6">
              <div>
                <h3 className="font-medium text-charcoal mb-2">Lost or Stolen Packages</h3>
                <p className="text-warm-gray-dark">
                  If your package is marked as delivered but you haven&apos;t received it, please check with neighbors
                  and any secure locations at your address. If you still can&apos;t locate your package, contact us
                  within 7 days of the delivery date and we will work with the carrier to resolve the issue.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-charcoal mb-2">Damaged Packages</h3>
                <p className="text-warm-gray-dark">
                  If your order arrives damaged, please take photos of the packaging and products, then contact
                  our customer service team within 48 hours. We will arrange for a replacement or refund.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-charcoal mb-2">Incorrect Address</h3>
                <p className="text-warm-gray-dark">
                  Please ensure your shipping address is correct before placing your order. If you need to change
                  the address after placing an order, contact us immediately. Once the order has shipped, we cannot
                  guarantee address changes.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-charcoal mb-2">Delayed Shipments</h3>
                <p className="text-warm-gray-dark">
                  Occasionally, shipments may be delayed due to weather, carrier issues, or customs processing.
                  If your order is significantly delayed, please contact our customer service team for assistance.
                </p>
              </div>
            </div>
          </section>

          {/* Holiday Shipping */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-gold" />
              Holiday Shipping Deadlines
            </h2>

            <div className="bg-white border border-warm-gray-light rounded-brand p-6">
              <p className="text-warm-gray-dark mb-4">
                To ensure your gifts arrive on time for the holidays, please order by the following dates:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linen">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Holiday</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Standard</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Express</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Next Day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-gray-light">
                    <tr>
                      <td className="px-4 py-3 font-medium text-charcoal">Christmas</td>
                      <td className="px-4 py-3 text-warm-gray-dark">Dec 14</td>
                      <td className="px-4 py-3 text-warm-gray-dark">Dec 20</td>
                      <td className="px-4 py-3 text-warm-gray-dark">Dec 23</td>
                    </tr>
                    <tr className="bg-linen/50">
                      <td className="px-4 py-3 font-medium text-charcoal">Valentine&apos;s Day</td>
                      <td className="px-4 py-3 text-warm-gray-dark">Feb 7</td>
                      <td className="px-4 py-3 text-warm-gray-dark">Feb 11</td>
                      <td className="px-4 py-3 text-warm-gray-dark">Feb 13</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-charcoal">Mother&apos;s Day</td>
                      <td className="px-4 py-3 text-warm-gray-dark">May 3</td>
                      <td className="px-4 py-3 text-warm-gray-dark">May 8</td>
                      <td className="px-4 py-3 text-warm-gray-dark">May 10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-warm-gray-dark mt-4">
                * Dates are subject to change. Check our website for current holiday deadlines.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-serif text-2xl text-charcoal mb-6">Questions?</h2>
            <div className="bg-linen rounded-brand p-6">
              <p className="text-warm-gray-dark mb-4">
                If you have any questions about shipping or need help with an order, our customer service team is here to help.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 text-gold hover:underline">
                  Contact Us
                </Link>
                <a href="mailto:shipping@lumina.com" className="inline-flex items-center gap-2 text-gold hover:underline">
                  shipping@lumina.com
                </a>
                <a href="tel:1-800-LUMINA" className="inline-flex items-center gap-2 text-gold hover:underline">
                  1-800-LUMINA
                </a>
              </div>
            </div>
          </section>

          {/* Related Links */}
          <div className="p-6 bg-white border border-warm-gray-light rounded-brand">
            <h3 className="font-serif text-lg text-charcoal mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/return-policy" className="inline-flex items-center gap-2 text-gold hover:underline">
                Return Policy
              </Link>
              <Link href="/terms" className="inline-flex items-center gap-2 text-gold hover:underline">
                Terms of Service
              </Link>
              <Link href="/privacy" className="inline-flex items-center gap-2 text-gold hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}