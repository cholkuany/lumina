import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
}) {
  return (
    <div className="bg-white border border-border-light rounded-brand p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="font-serif text-lg text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  )
}