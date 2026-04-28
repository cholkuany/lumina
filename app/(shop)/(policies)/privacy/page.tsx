// app/privacy/page.tsx
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  Shield,
  FileText,
  Eye,
  Lock,
  Share2,
  Cookie,
  Globe,
  UserCheck,
  Mail,
  AlertTriangle,
} from 'lucide-react'

const lastUpdated = 'December 15, 2024'
const effectiveDate = 'December 15, 2024'

const tableOfContents = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-collected', title: '2. Information We Collect' },
  { id: 'how-we-use', title: '3. How We Use Your Information' },
  { id: 'information-sharing', title: '4. Information Sharing' },
  { id: 'cookies', title: '5. Cookies & Tracking' },
  { id: 'data-security', title: '6. Data Security' },
  { id: 'data-retention', title: '7. Data Retention' },
  { id: 'your-rights', title: '8. Your Rights & Choices' },
  { id: 'childrens-privacy', title: "9. Children's Privacy" },
  { id: 'international', title: '10. International Transfers' },
  { id: 'third-party', title: '11. Third-Party Links' },
  { id: 'california', title: '12. California Privacy Rights' },
  { id: 'european', title: '13. European Privacy Rights' },
  { id: 'changes', title: '14. Changes to This Policy' },
  { id: 'contact', title: '15. Contact Us' },
]

export default function PrivacyPolicyPage() {
  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
      </div>

      {/* Hero Section */}
      <section className="bg-linen py-12 lg:py-16">
        <div className="container-lumina">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-4">
              Privacy Policy
            </h1>
            <p className="text-warm-gray-dark">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-warm-gray-dark">
              <span>Last Updated: {lastUpdated}</span>
              <span>•</span>
              <span>Effective: {effectiveDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="container-lumina py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-warm-gray-light rounded-brand p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-charcoal mb-2">Secure Data</h3>
            <p className="text-sm text-warm-gray-dark">
              Your data is encrypted and protected with industry-standard security measures.
            </p>
          </div>
          <div className="bg-white border border-warm-gray-light rounded-brand p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-charcoal mb-2">Your Control</h3>
            <p className="text-sm text-warm-gray-dark">
              You have full control over your data with easy access, update, and deletion options.
            </p>
          </div>
          <div className="bg-white border border-warm-gray-light rounded-brand p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-charcoal mb-2">Transparency</h3>
            <p className="text-sm text-warm-gray-dark">
              We&apos;re clear about what data we collect and how we use it.
            </p>
          </div>
        </div>
      </section>

      <div className="container-lumina py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-warm-gray-light rounded-brand p-6">
              <h2 className="font-serif text-lg text-charcoal mb-4">Table of Contents</h2>
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
            <div className="bg-white border border-warm-gray-light rounded-brand p-8 lg:p-12 space-y-12">

              {/* Section 1 */}
              <section id="introduction" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">1</span>
                  Introduction
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    Welcome to LUMINA (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We are committed to protecting your privacy and personal
                    information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                    when you visit our website, mobile application, and use our services (collectively, the &quot;Services&quot;).
                  </p>
                  <p>
                    By using our Services, you consent to the data practices described in this policy. If you do not agree
                    with the terms of this Privacy Policy, please do not access or use our Services.
                  </p>
                  <div className="bg-linen rounded-lg p-4">
                    <p className="text-sm">
                      <strong>Data Controller:</strong> Lumina Commerce Inc., 123 Commerce Street, New York, NY 10001,
                      United States. Contact: <a href="mailto:privacy@lumina.com" className="text-gold hover:underline">privacy@lumina.com</a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="information-collected" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">2</span>
                  Information We Collect
                </h2>
                <div className="pl-11 space-y-6 text-warm-gray-dark">
                  <div>
                    <h3 className="font-medium text-charcoal mb-3">2.1 Information You Provide</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Account information:</strong> Name, email, password, phone number</li>
                      <li><strong>Purchase information:</strong> Billing/shipping addresses, payment details</li>
                      <li><strong>Communications:</strong> Customer service inquiries, reviews, survey responses</li>
                      <li><strong>Preferences:</strong> Newsletter subscriptions, marketing preferences</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal mb-3">2.2 Automatically Collected Information</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Device data:</strong> Device type, OS, browser, unique identifiers</li>
                      <li><strong>Usage data:</strong> Pages visited, clicks, time spent, search queries</li>
                      <li><strong>Location data:</strong> IP address, general geographic location</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal mb-3">2.3 Third-Party Information</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Social media data (when you connect accounts)</li>
                      <li>Payment processor confirmations</li>
                      <li>Marketing partner analytics</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="how-we-use" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">3</span>
                  How We Use Your Information
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-linen rounded-lg p-4">
                      <h4 className="font-medium text-charcoal mb-2">Order Fulfillment</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Process and ship orders</li>
                        <li>• Send order confirmations</li>
                        <li>• Handle returns/refunds</li>
                        <li>• Provide customer support</li>
                      </ul>
                    </div>
                    <div className="bg-linen rounded-lg p-4">
                      <h4 className="font-medium text-charcoal mb-2">Account Management</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Create/manage accounts</li>
                        <li>• Authenticate users</li>
                        <li>• Save preferences</li>
                        <li>• Maintain wish lists</li>
                      </ul>
                    </div>
                    <div className="bg-linen rounded-lg p-4">
                      <h4 className="font-medium text-charcoal mb-2">Marketing</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Send promotional emails</li>
                        <li>• Personalize recommendations</li>
                        <li>• Display targeted ads</li>
                        <li>• Conduct surveys</li>
                      </ul>
                    </div>
                    <div className="bg-linen rounded-lg p-4">
                      <h4 className="font-medium text-charcoal mb-2">Security</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Detect fraud</li>
                        <li>• Prevent abuse</li>
                        <li>• Comply with laws</li>
                        <li>• Enforce terms</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="information-sharing" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">4</span>
                  Information Sharing
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800 font-medium">We do not sell your personal information.</p>
                  </div>
                  <p>We may share your information with:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Service providers:</strong> Payment processors, shipping carriers, email services, analytics</li>
                    <li><strong>Business transfers:</strong> In case of merger, acquisition, or asset sale</li>
                    <li><strong>Legal requirements:</strong> When required by law or to protect rights/safety</li>
                    <li><strong>With consent:</strong> When you explicitly authorize sharing</li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section id="cookies" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">5</span>
                  Cookies & Tracking
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>We use cookies and similar technologies for:</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border border-warm-gray-light rounded-lg">
                      <Cookie className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-charcoal">Essential Cookies</p>
                        <p className="text-sm">Required for core functionality (cart, login, checkout)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border border-warm-gray-light rounded-lg">
                      <Eye className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-charcoal">Analytics Cookies</p>
                        <p className="text-sm">Help us understand how visitors use our site</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border border-warm-gray-light rounded-lg">
                      <Share2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-charcoal">Marketing Cookies</p>
                        <p className="text-sm">Used for targeted advertising across websites</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4">
                    You can manage cookies through your browser settings. Blocking some cookies may affect functionality.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section id="data-security" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">6</span>
                  Data Security
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>We protect your information with:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>TLS/SSL encryption</strong> for all data transmission</li>
                    <li><strong>PCI DSS compliant</strong> payment processing</li>
                    <li><strong>Access controls</strong> limiting employee data access</li>
                    <li><strong>Regular security audits</strong> and penetration testing</li>
                    <li><strong>SOC 2 certified</strong> data center hosting</li>
                  </ul>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <p className="text-sm text-amber-800">
                        No method of transmission is 100% secure. Keep your credentials confidential and report suspicious activity.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section id="data-retention" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">7</span>
                  Data Retention
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-linen">
                          <th className="border border-warm-gray-light px-4 py-3 text-left text-sm font-medium text-charcoal">Data Type</th>
                          <th className="border border-warm-gray-light px-4 py-3 text-left text-sm font-medium text-charcoal">Retention Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">Account information</td>
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">Until deletion + 30 days</td>
                        </tr>
                        <tr className="bg-linen/50">
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">Order history</td>
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">7 years (legal requirement)</td>
                        </tr>
                        <tr>
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">Payment records</td>
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">7 years (legal requirement)</td>
                        </tr>
                        <tr className="bg-linen/50">
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">Support communications</td>
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">3 years</td>
                        </tr>
                        <tr>
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">Marketing preferences</td>
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">Until consent withdrawn</td>
                        </tr>
                        <tr className="bg-linen/50">
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">Analytics data</td>
                          <td className="border border-warm-gray-light px-4 py-3 text-sm">26 months</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Section 8 */}
              <section id="your-rights" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">8</span>
                  Your Rights & Choices
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>Depending on your location, you may have the following rights:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-warm-gray-light rounded-lg p-4">
                      <h4 className="font-medium text-charcoal mb-2">Access</h4>
                      <p className="text-sm">Request a copy of your personal data</p>
                    </div>
                    <div className="border border-warm-gray-light rounded-lg p-4">
                      <h4 className="font-medium text-charcoal mb-2">Correction</h4>
                      <p className="text-sm">Request correction of inaccurate data</p>
                    </div>
                    <div className="border border-warm-gray-light rounded-lg p-4">
                      <h4 className="font-medium text-charcoal mb-2">Deletion</h4>
                      <p className="text-sm">Request deletion of your data</p>
                    </div>
                    <div className="border border-warm-gray-light rounded-lg p-4">
                      <h4 className="font-medium text-charcoal mb-2">Portability</h4>
                      <p className="text-sm">Receive your data in a portable format</p>
                    </div>
                    <div className="border border-warm-gray-light rounded-lg p-4">
                      <h4 className="font-medium text-charcoal mb-2">Restriction</h4>
                      <p className="text-sm">Limit how we process your data</p>
                    </div>
                    <div className="border border-warm-gray-light rounded-lg p-4">
                      <h4 className="font-medium text-charcoal mb-2">Objection</h4>
                      <p className="text-sm">Object to certain processing activities</p>
                    </div>
                  </div>
                  <p className="mt-4">
                    To exercise these rights, contact us at{' '}
                    <a href="mailto:privacy@lumina.com" className="text-gold hover:underline">privacy@lumina.com</a>
                    {' '}or through your account settings.
                  </p>
                  <h3 className="font-medium text-charcoal mt-6">Marketing Communications</h3>
                  <p>You can opt out of marketing emails by:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Clicking &quot;unsubscribe&quot; in any marketing email</li>
                    <li>Updating preferences in your account settings</li>
                    <li>Contacting customer support</li>
                  </ul>
                </div>
              </section>

              {/* Section 9 */}
              <section id="childrens-privacy" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">9</span>
                  Children&apos;s Privacy
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    Our Services are not directed to children under 13 (or 16 in certain jurisdictions). We do not
                    knowingly collect personal information from children. If you believe a child has provided us with
                    personal information, please contact us immediately and we will delete it.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section id="international" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">10</span>
                  International Transfers
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    Your information may be transferred to and processed in countries other than your own. We ensure
                    appropriate safeguards are in place, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Standard Contractual Clauses approved by the European Commission</li>
                    <li>Data processing agreements with all service providers</li>
                    <li>Compliance with applicable data protection laws</li>
                  </ul>
                </div>
              </section>

              {/* Section 11 */}
              <section id="third-party" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">11</span>
                  Third-Party Links
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    Our Services may contain links to third-party websites or services. We are not responsible for the
                    privacy practices of these third parties. We encourage you to review their privacy policies before
                    providing any personal information.
                  </p>
                </div>
              </section>

              {/* Section 12 */}
              <section id="california" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">12</span>
                  California Privacy Rights (CCPA)
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>California residents have additional rights under the CCPA:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Right to Know:</strong> What personal information we collect, use, and disclose</li>
                    <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
                    <li><strong>Right to Opt-Out:</strong> Opt out of the sale of personal information (we do not sell your data)</li>
                    <li><strong>Right to Non-Discrimination:</strong> Equal service and pricing regardless of exercising rights</li>
                  </ul>
                  <p className="mt-4">
                    To exercise your CCPA rights, email{' '}
                    <a href="mailto:privacy@lumina.com" className="text-gold hover:underline">privacy@lumina.com</a>
                    {' '}or call 1-800-LUMINA.
                  </p>
                </div>
              </section>

              {/* Section 13 */}
              <section id="european" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">13</span>
                  European Privacy Rights (GDPR)
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>If you are in the European Economic Area, UK, or Switzerland, you have additional rights:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Right to lodge a complaint with your local data protection authority</li>
                    <li>Right to withdraw consent at any time</li>
                    <li>Right to object to processing based on legitimate interests</li>
                    <li>Right not to be subject to automated decision-making</li>
                  </ul>
                  <p className="mt-4">
                    Our EU representative can be contacted at{' '}
                    <a href="mailto:eu-privacy@lumina.com" className="text-gold hover:underline">eu-privacy@lumina.com</a>.
                  </p>
                </div>
              </section>

              {/* Section 14 */}
              <section id="changes" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">14</span>
                  Changes to This Policy
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by
                    posting the new policy on this page and updating the &quot;Last Updated&quot; date. For significant changes,
                    we may also send you an email notification.
                  </p>
                  <p>
                    We encourage you to review this Privacy Policy periodically. Your continued use of our Services
                    after any changes constitutes your acceptance of the updated policy.
                  </p>
                </div>
              </section>

              {/* Section 15 */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-medium">15</span>
                  Contact Us
                </h2>
                <div className="pl-11 space-y-4 text-warm-gray-dark">
                  <p>If you have questions about this Privacy Policy or our data practices, contact us:</p>
                  <div className="bg-linen rounded-lg p-6">
                    <p className="font-medium text-charcoal mb-3">Lumina Commerce Inc.</p>
                    <div className="space-y-2 text-sm">
                      <p>Privacy Team</p>
                      <p>123 Commerce Street</p>
                      <p>New York, NY 10001</p>
                      <p>United States</p>
                      <div className="pt-3 space-y-1">
                        <p><strong>Email:</strong> <a href="mailto:privacy@lumina.com" className="text-gold hover:underline">privacy@lumina.com</a></p>
                        <p><strong>Phone:</strong> <a href="tel:1-800-LUMINA" className="text-gold hover:underline">1-800-LUMINA</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Related Links */}
            <div className="mt-8 p-6 bg-linen rounded-brand">
              <h3 className="font-serif text-lg text-charcoal mb-4">Related Policies</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/terms" className="inline-flex items-center gap-2 text-gold hover:underline">
                  <FileText className="w-4 h-4" />
                  Terms of Service
                </Link>
                <Link href="/shipping-policy" className="inline-flex items-center gap-2 text-gold hover:underline">
                  <Globe className="w-4 h-4" />
                  Shipping Policy
                </Link>
                <Link href="/return-policy" className="inline-flex items-center gap-2 text-gold hover:underline">
                  <Mail className="w-4 h-4" />
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