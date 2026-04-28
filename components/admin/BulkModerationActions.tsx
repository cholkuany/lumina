// components/admin/BulkModerationActions.tsx
'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface BulkModerationActionsProps {
  selectedCount: number
  onApprove: () => Promise<void>
  onReject: () => Promise<void>
  onFlag: () => Promise<void>
  onClearSelection: () => void
}

export function BulkModerationActions({
  selectedCount,
  onApprove,
  onReject,
  onFlag,
  onClearSelection,
}: BulkModerationActionsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleAction = async (action: string, handler: () => Promise<void>) => {
    setIsLoading(action)
    try {
      await handler()
    } finally {
      setIsLoading(null)
    }
  }

  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-charcoal text-white rounded-brand shadow-hover px-6 py-4 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-sm">
            <strong>{selectedCount}</strong> review{selectedCount > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-white/60 hover:text-white text-sm underline"
          >
            Clear
          </button>
        </div>

        <div className="h-6 w-px bg-white/20" />

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => handleAction('approve', onApprove)}
            disabled={isLoading !== null}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading === 'approve' ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <CheckCircle className="w-4 h-4 mr-1" />
            )}
            Approve All
          </Button>

          <Button
            size="sm"
            onClick={() => handleAction('reject', onReject)}
            disabled={isLoading !== null}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading === 'reject' ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <XCircle className="w-4 h-4 mr-1" />
            )}
            Reject All
          </Button>

          <Button
            size="sm"
            onClick={() => handleAction('flag', onFlag)}
            disabled={isLoading !== null}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isLoading === 'flag' ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <AlertTriangle className="w-4 h-4 mr-1" />
            )}
            Flag All
          </Button>
        </div>
      </div>
    </div>
  )
}