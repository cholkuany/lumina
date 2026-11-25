import type { Metadata } from 'next'
import { Toaster } from 'sonner'

import { Footer } from '@/components/layout/Footer'
import Header from '@/components/layout/nav/header';
import CategoryNav from '@/components/layout/nav/categoryNav/CategoryNav';

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
    <html lang="en" data-scroll-behavior="smooth">
      <body className='overflow-x-hidden'>
        <AuthProvider>
          <QueryContextProvider>
            <Header />
            <CategoryNav />
            {children}
            <Toaster position='top-center' richColors closeButton />
            <Footer />
          </QueryContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
