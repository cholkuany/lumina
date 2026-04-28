import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/nav/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

// Context Providers
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryContextProvider } from '@/context/QueryProviderContext'

// Global Styles
import '../globals.css'

export const metadata: Metadata = {
  title: 'LUMINA | Discover What Inspires You',
  description: 'Your destination for quality products. Curated with care, delivered with love.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryContextProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                {children}
                <Footer />
                <CartDrawer />
              </WishlistProvider>
            </CartProvider>
          </QueryContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
