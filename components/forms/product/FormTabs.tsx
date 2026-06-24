import { ClipboardList, Info, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductFormTab } from './types'

interface FormTabsProps {
  activeTab: ProductFormTab
  onChange: (tab: ProductFormTab) => void
}

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: Info },
  { id: 'variants', label: 'Variants', icon: Layers },
  { id: 'specs', label: 'Specifications', icon: ClipboardList },
] as const

export function FormTabs({
  activeTab,
  onChange,
}: FormTabsProps) {
  return (
    <div className="border-b border-warm-gray">
      <nav className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative',
              activeTab === tab.id
                ? 'text-gold'
                : 'text-warm-gray-dark hover:text-charcoal'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}

            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}