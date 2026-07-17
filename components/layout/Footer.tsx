'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Best Sellers', href: '/best-sellers' },
    { name: 'Sale', href: '/sale' },
    { name: 'All Products', href: '/products' },
  ],
  help: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Contact Us', href: '/contact' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Sustainability', href: '/sustainability' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'footer',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to subscribe right now.')
      }

      setEmail('')
      setStatus('success')
      setMessage(data.message ?? "You're subscribed. Welcome to the LUMINA community.")
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to subscribe right now.')
    }
  }

  return (
    <footer className="bg-linen border-t border-warm-gray-light">
      {/* Newsletter Section */}
      <div className="bg-charcoal text-white py-12">
        <div className="container-lumina">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl font-semibold mb-2">
                Join the LUMINA community
              </h3>
              <p className="text-white/70">
                Subscribe for exclusive offers, new arrivals, and 10% off your first order.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="w-full max-w-md"
              noValidate
            >
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (status !== 'idle') {
                      setStatus('idle')
                      setMessage('')
                    }
                  }}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  aria-describedby={message ? 'newsletter-message' : undefined}
                  required
                  className="flex-1 h-12 px-4 bg-white/10 border border-white/20 rounded-brand text-white placeholder:text-white/50 focus:outline-none focus:border-gold focus:bg-white/15 transition-colors"
                />
                <Button
                  type="submit"
                  variant="gold"
                  className="whitespace-nowrap"
                  isLoading={status === 'loading'}
                >
                  {status === 'loading' ? 'Joining' : 'Subscribe'}
                </Button>
              </div>
              {message && (
                <p
                  id="newsletter-message"
                  className={`mt-2 text-sm ${status === 'error' ? 'text-red-200' : 'text-white/75'
                    }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-lumina py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold text-charcoal">
                LUMINA
              </span>
            </Link>
            <p className="text-warm-gray-dark text-sm mb-6 max-w-xs">
              Your destination for quality products.
              Curated with care, delivered with love.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-charcoal text-white
                             flex items-center justify-center
                             hover:bg-gold transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-serif font-semibold text-charcoal mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-gray-dark hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-serif font-semibold text-charcoal mb-4">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-gray-dark hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-serif font-semibold text-charcoal mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-gray-dark hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-gray">
        <div className="container-lumina py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-warm-gray-dark">
              © 2025 LUMINA. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-warm-gray-dark">
              <Link href="/privacy" className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
