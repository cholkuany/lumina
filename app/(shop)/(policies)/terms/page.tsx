// app/terms/page.tsx
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { FileText, Scale, Truck, RotateCcw } from 'lucide-react'

const lastUpdated = 'December 15, 2024'
const effectiveDate = 'December 15, 2024'

const tableOfContents = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'account', title: '2. Account Registration' },
  { id: 'products', title: '3. Products & Pricing' },
  { id: 'orders', title: '4. Orders & Payment' },
  { id: 'shipping', title: '5. Shipping & Delivery' },
  { id: 'returns', title: '6. Returns & Refunds' },
  { id: 'intellectual-property', title: '7. Intellectual Property' },
  { id: 'user-content', title: '8. User Content' },
  { id: 'prohibited', title: '9. Prohibited Activities' },
  { id: 'disclaimer', title: '10. Disclaimer of Warranties' },
  { id: 'limitation', title: '11. Limitation of Liability' },
  { id: 'indemnification', title: '12. Indemnification' },
  { id: 'termination', title: '13. Termination' },
  { id: 'governing-law', title: '14. Governing Law' },
  { id: 'changes', title: '15. Changes to Terms' },
  { id: 'contact', title: '16. Contact Information' },
]

export default function TermsOfServicePage() {
  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb
          items={[
            { label: 'Terms of Service' },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="bg-linen py-12 lg:py-16">
        <div className="container-lumina">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-4">
              Terms of Service
            </h1>
            <p className="text-warm-gray-dark">
              Please read these terms carefully before using our services.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-warm-gray-dark">
              <span>Last Updated: {lastUpdated}</span>
              <span>•</span>
              <span>Effective: {effectiveDate}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-lumina py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-warm-gray-light rounded-brand p-6">
              <h2 className="font-serif text-lg text-charcoal mb-4">
                Table of Contents
              </h2>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-warm-gray-dark hover:text-gold transition-colors py-1"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-warm-gray-light rounded-brand p-8 lg:p-12">
              {/* Introduction */}
              <div className="prose prose-warm max-w-none mb-12">
                <p className="text-lg text-warm-gray-dark leading-relaxed">
                  Welcome to LUMINA. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website,
                  mobile applications, and services (collectively, the &quot;Services&quot;). By accessing or using our Services,
                  you agree to be bound by these Terms and our Privacy Policy.
                </p>
                <p className="text-warm-gray-dark">
                  LUMINA is operated by Lumina Commerce Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), a company registered in Delaware,
                  United States. Our principal place of business is 123 Commerce Street, New York, NY 10001.
                </p>
              </div>

              {/* Section 1: Acceptance of Terms */}
              <section id="acceptance" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    1
                  </span>
                  Acceptance of Terms
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    By creating an account, making a purchase, or otherwise using our Services, you acknowledge that you
                    have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms,
                    please do not use our Services.
                  </p>
                  <p>
                    You must be at least 18 years old or the age of majority in your jurisdiction to use our Services.
                    If you are under 18, you may only use our Services with the involvement of a parent or guardian.
                  </p>
                  <p>
                    We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion,
                    including if we believe that your conduct violates these Terms or is harmful to other users, us,
                    or third parties.
                  </p>
                </div>
              </section>

              {/* Section 2: Account Registration */}
              <section id="account" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    2
                  </span>
                  Account Registration
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    To access certain features of our Services, you may need to create an account. When creating an
                    account, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Keep your password secure and confidential</li>
                    <li>Notify us immediately of any unauthorized access to your account</li>
                    <li>Accept responsibility for all activities that occur under your account</li>
                  </ul>
                  <p>
                    You may not use another person&apos;s account without permission. We reserve the right to suspend or
                    terminate accounts that violate these Terms or for any other reason at our discretion.
                  </p>
                </div>
              </section>

              {/* Section 3: Products & Pricing */}
              <section id="products" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    3
                  </span>
                  Products & Pricing
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <h3 className="font-medium text-charcoal">3.1 Product Information</h3>
                  <p>
                    We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant
                    that product descriptions, pricing, or other content is accurate, complete, reliable, current, or
                    error-free. Product images are for illustrative purposes and may vary from the actual product.
                  </p>

                  <h3 className="font-medium text-charcoal">3.2 Pricing</h3>
                  <p>
                    All prices are displayed in US Dollars unless otherwise specified. Prices are subject to change
                    without notice. We reserve the right to correct any pricing errors, even after an order has been
                    placed. In such cases, we will notify you and give you the option to proceed with the corrected
                    price or cancel your order.
                  </p>

                  <h3 className="font-medium text-charcoal">3.3 Availability</h3>
                  <p>
                    Product availability is subject to change. We do not guarantee that any product will be available
                    at any particular time. If a product becomes unavailable after you place an order, we will notify
                    you and provide a full refund for that item.
                  </p>
                </div>
              </section>

              {/* Section 4: Orders & Payment */}
              <section id="orders" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    4
                  </span>
                  Orders & Payment
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <h3 className="font-medium text-charcoal">4.1 Order Acceptance</h3>
                  <p>
                    Your order constitutes an offer to purchase products. We reserve the right to accept or decline
                    your order for any reason. An order is not accepted until we send you an order confirmation email.
                    We may cancel orders due to product unavailability, pricing errors, suspected fraud, or other reasons.
                  </p>

                  <h3 className="font-medium text-charcoal">4.2 Payment Methods</h3>
                  <p>
                    We accept various payment methods including credit cards (Visa, Mastercard, American Express, Discover),
                    debit cards, PayPal, Apple Pay, Google Pay, and other payment methods as displayed at checkout.
                  </p>

                  <h3 className="font-medium text-charcoal">4.3 Payment Processing</h3>
                  <p>
                    Payment is processed at the time of order placement. By providing payment information, you represent
                    that you are authorized to use the payment method and authorize us to charge the total amount of your
                    order, including applicable taxes and shipping fees.
                  </p>

                  <h3 className="font-medium text-charcoal">4.4 Sales Tax</h3>
                  <p>
                    Applicable sales tax will be calculated and added to your order based on your shipping address and
                    current tax rates. You are responsible for any applicable taxes in your jurisdiction.
                  </p>
                </div>
              </section>

              {/* Section 5: Shipping & Delivery */}
              <section id="shipping" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    5
                  </span>
                  Shipping & Delivery
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <h3 className="font-medium text-charcoal">5.1 Shipping Options</h3>
                  <p>
                    We offer various shipping options with estimated delivery times displayed at checkout. Delivery
                    times are estimates and not guaranteed. Factors such as carrier delays, weather, holidays, and
                    customs processing may affect delivery times.
                  </p>

                  <h3 className="font-medium text-charcoal">5.2 Shipping Costs</h3>
                  <p>
                    Shipping costs are calculated based on your shipping address, selected shipping method, and order
                    weight/size. Free shipping may be offered on orders meeting certain criteria as displayed on our
                    website.
                  </p>

                  <h3 className="font-medium text-charcoal">5.3 Risk of Loss</h3>
                  <p>
                    Risk of loss and title for products pass to you upon delivery to the carrier. We are not responsible
                    for delays or damages caused by the carrier. If your package is lost or damaged during shipping,
                    please contact us and we will work with the carrier to resolve the issue.
                  </p>

                  <h3 className="font-medium text-charcoal">5.4 International Shipping</h3>
                  <p>
                    For international orders, you are responsible for all customs duties, taxes, and fees imposed by
                    your country. We are not responsible for delays due to customs processing.
                  </p>
                </div>
              </section>

              {/* Section 6: Returns & Refunds */}
              <section id="returns" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    6
                  </span>
                  Returns & Refunds
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <h3 className="font-medium text-charcoal">6.1 Return Policy</h3>
                  <p>
                    We accept returns within 30 days of delivery for most items in their original condition with tags
                    attached. Some items, including personalized products, intimate apparel, and final sale items, are
                    not eligible for return.
                  </p>

                  <h3 className="font-medium text-charcoal">6.2 Return Process</h3>
                  <p>
                    To initiate a return, log into your account and request a return through your order history, or
                    contact our customer service team. You will receive a prepaid return label for eligible returns.
                  </p>

                  <h3 className="font-medium text-charcoal">6.3 Refunds</h3>
                  <p>
                    Refunds will be processed to the original payment method within 5-10 business days after we receive
                    and inspect your return. Shipping costs are non-refundable unless the return is due to our error.
                  </p>

                  <h3 className="font-medium text-charcoal">6.4 Exchanges</h3>
                  <p>
                    If you wish to exchange an item for a different size or color, please return the original item and
                    place a new order for the desired item.
                  </p>

                  <div className="bg-linen rounded-lg p-4 mt-4">
                    <p className="text-sm">
                      <strong>Note:</strong> Items must be returned in their original, unworn condition with all tags
                      attached. Items that show signs of wear, washing, or alteration will not be accepted for return.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7: Intellectual Property */}
              <section id="intellectual-property" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    7
                  </span>
                  Intellectual Property
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    All content on our Services, including text, graphics, logos, images, audio, video, software, and
                    other materials (collectively, &quot;Content&quot;), is owned by or licensed to LUMINA and is protected by
                    copyright, trademark, and other intellectual property laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly
                    perform, republish, download, store, or transmit any Content without our prior written consent, except:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your computer may temporarily store copies of such materials in RAM</li>
                    <li>You may store files that are automatically cached by your web browser</li>
                    <li>You may print or download one copy of pages for personal, non-commercial use</li>
                  </ul>
                  <p>
                    The LUMINA name, logo, and all related names, logos, product and service names, designs, and slogans
                    are trademarks of LUMINA or its affiliates. You may not use such marks without our prior written permission.
                  </p>
                </div>
              </section>

              {/* Section 8: User Content */}
              <section id="user-content" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    8
                  </span>
                  User Content
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    Our Services may allow you to submit content such as reviews, comments, photos, and other materials
                    (&quot;User Content&quot;). By submitting User Content, you grant us a non-exclusive, royalty-free, perpetual,
                    irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate,
                    create derivative works from, distribute, and display such content worldwide.
                  </p>
                  <p>
                    You represent and warrant that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You own or control all rights to the User Content you submit</li>
                    <li>Your User Content does not violate any third party&apos;s rights</li>
                    <li>Your User Content is accurate and not misleading</li>
                    <li>Your User Content complies with these Terms and applicable law</li>
                  </ul>
                  <p>
                    We reserve the right to remove any User Content at our discretion without notice.
                  </p>
                </div>
              </section>

              {/* Section 9: Prohibited Activities */}
              <section id="prohibited" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    9
                  </span>
                  Prohibited Activities
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    You agree not to engage in any of the following prohibited activities:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Using the Services for any illegal purpose or in violation of any laws</li>
                    <li>Attempting to interfere with, compromise, or disrupt the Services</li>
                    <li>Using automated systems (bots, scrapers, etc.) to access the Services</li>
                    <li>Impersonating another person or entity</li>
                    <li>Submitting false or misleading information</li>
                    <li>Engaging in fraudulent activities, including payment fraud</li>
                    <li>Harassing, threatening, or intimidating other users</li>
                    <li>Circumventing any security measures or access controls</li>
                    <li>Reselling products purchased from us without authorization</li>
                    <li>Using the Services to send spam or unsolicited communications</li>
                  </ul>
                </div>
              </section>

              {/* Section 10: Disclaimer of Warranties */}
              <section id="disclaimer" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    10
                  </span>
                  Disclaimer of Warranties
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800 uppercase font-medium">
                      THE SERVICES AND ALL PRODUCTS ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY
                      KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                      FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                  </div>
                  <p>
                    We do not warrant that the Services will be uninterrupted, secure, or error-free, that defects will
                    be corrected, or that the Services are free of viruses or other harmful components.
                  </p>
                </div>
              </section>

              {/* Section 11: Limitation of Liability */}
              <section id="limitation" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    11
                  </span>
                  Limitation of Liability
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    TO THE FULLEST EXTENT PERMITTED BY LAW, LUMINA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                    SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA,
                    USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.
                  </p>
                  <p>
                    IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT PAID BY YOU TO US
                    IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
                  </p>
                  <p>
                    Some jurisdictions do not allow the exclusion or limitation of certain warranties or liability, so
                    some of the above limitations may not apply to you.
                  </p>
                </div>
              </section>

              {/* Section 12: Indemnification */}
              <section id="indemnification" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    12
                  </span>
                  Indemnification
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    You agree to indemnify, defend, and hold harmless LUMINA and its officers, directors, employees,
                    agents, and affiliates from and against any claims, liabilities, damages, losses, costs, and
                    expenses (including reasonable attorneys&apos; fees) arising out of or related to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your use of the Services</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any rights of another party</li>
                    <li>Your User Content</li>
                  </ul>
                </div>
              </section>

              {/* Section 13: Termination */}
              <section id="termination" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    13
                  </span>
                  Termination
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    We may terminate or suspend your account and access to the Services immediately, without prior
                    notice or liability, for any reason, including if you breach these Terms.
                  </p>
                  <p>
                    Upon termination, your right to use the Services will immediately cease. All provisions of these
                    Terms which by their nature should survive termination shall survive, including ownership provisions,
                    warranty disclaimers, indemnity, and limitations of liability.
                  </p>
                  <p>
                    You may terminate your account at any time by contacting us or through your account settings.
                  </p>
                </div>
              </section>

              {/* Section 14: Governing Law */}
              <section id="governing-law" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    14
                  </span>
                  Governing Law
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the State of New York,
                    United States, without regard to its conflict of law provisions.
                  </p>
                  <p>
                    Any disputes arising out of or relating to these Terms or the Services shall be resolved exclusively
                    in the state or federal courts located in New York County, New York. You consent to the personal
                    jurisdiction of such courts.
                  </p>
                </div>
              </section>

              {/* Section 15: Changes to Terms */}
              <section id="changes" className="mb-12 scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    15
                  </span>
                  Changes to Terms
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    We reserve the right to modify these Terms at any time. We will notify you of any changes by posting
                    the new Terms on this page and updating the &quot;Last Updated&quot; date.
                  </p>
                  <p>
                    Your continued use of the Services after any changes constitutes your acceptance of the new Terms.
                    If you do not agree to the new Terms, please stop using the Services.
                  </p>
                  <p>
                    We encourage you to review these Terms periodically for any changes.
                  </p>
                </div>
              </section>

              {/* Section 16: Contact Information */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">
                    16
                  </span>
                  Contact Information
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    If you have any questions about these Terms, please contact us:
                  </p>
                  <div className="bg-linen rounded-lg p-6">
                    <p className="font-medium text-charcoal mb-3">Lumina Commerce Inc.</p>
                    <div className="space-y-2 text-sm">
                      <p>123 Commerce Street</p>
                      <p>New York, NY 10001</p>
                      <p>United States</p>
                      <p className="pt-2">
                        <strong>Email:</strong>{' '}
                        <a href="mailto:legal@lumina.com" className="text-gold hover:underline">
                          legal@lumina.com
                        </a>
                      </p>
                      <p>
                        <strong>Phone:</strong>{' '}
                        <a href="tel:1-800-LUMINA" className="text-gold hover:underline">
                          1-800-LUMINA
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Related Links */}
            <div className="mt-8 p-6 bg-linen rounded-brand">
              <h3 className="font-serif text-lg text-charcoal mb-4">Related Policies</h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-gold hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  Privacy Policy
                </Link>
                <Link
                  href="/shipping-policy"
                  className="inline-flex items-center gap-2 text-gold hover:underline"
                >
                  <Truck className="w-4 h-4" />
                  Shipping Policy
                </Link>
                <Link
                  href="/return-policy"
                  className="inline-flex items-center gap-2 text-gold hover:underline"
                >
                  <RotateCcw className="w-4 h-4" />
                  Return Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}