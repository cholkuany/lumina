import { Sidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/Header'
import { AuthProvider } from '@/components/providers/auth-provider'
import { QueryContextProvider } from '@/context/QueryProviderContext'
import { SidebarProvider } from '@/context/SidebarContext'
import '../globals.css'
export const metadata = {
  title: 'Admin Dashboard | LUMINA',
  description: 'LUMINA store management dashboard',
}
import { getServerSession } from '@/lib/auth-server'
// import { AccessDenied } from '@/components/Access-Denied'
import { redirect } from 'next/navigation'

import { Toaster } from 'sonner'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/login")

  }

  if (session.user.role !== 'admin') {
    redirect("/")
  }

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryContextProvider>
            <SidebarProvider>
              <div className="min-h-screen bg-linen">
                <Sidebar user={session.user} />
                <div className="lg:pl-72">
                  <AdminHeader />
                  <main className="py-6 px-4 sm:px-6 lg:px-8">
                    {children}
                  </main>
                  <Toaster position='top-center' />
                </div>
              </div>
            </SidebarProvider>
          </QueryContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}