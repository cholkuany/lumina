// components/product/SellerResponse.tsx
import { Store, MessageSquare } from 'lucide-react'
// import { cn } from '@/lib/utils'

interface SellerResponseProps {
  sellerName: string
  sellerAvatar?: string
  content: string
  date: string
  isOfficial?: boolean
}

export function SellerResponse({
  sellerName,
  // sellerAvatar,
  content,
  date,
  isOfficial = true,
}: SellerResponseProps) {
  return (
    <div className="ml-14 mt-4 bg-linen/50 border-l-4 border-gold rounded-r-brand p-4">
      <div className="flex items-start gap-3">
        {/* Seller Icon */}
        <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center shrink-0">
          <Store className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-medium text-charcoal text-sm">{sellerName}</span>
            {isOfficial && (
              <span className="inline-flex items-center gap-1 text-xs bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full">
                <MessageSquare className="w-3 h-3" />
                Official Response
              </span>
            )}
            <span className="text-xs text-warm-gray-dark">{date}</span>
          </div>

          {/* Response Content */}
          <p className="text-sm text-warm-gray-dark leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  )
}