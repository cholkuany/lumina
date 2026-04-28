'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ActionType, Resource } from '@/lib/types'

import { TriangleAlert, CircleAlert, Info } from 'lucide-react'

type ActionParams = {
  title: (resource: string) => string,
  message: (resource: string, count: number) => string,
  variant: 'danger' | 'warning' | 'info',
  confirmLabel: string
}

type ConfigType = Partial<Record<ActionType, ActionParams>>

const ACTION_CONFIG: ConfigType = {
  approve: {
    title: (resource: string) => `Approve ${resource}`,
    message: (resource: string, count: number) =>
      `Are you sure you want to approve ${count > 1 ? `${count} ${resource}s` : `this ${resource}`
      }?`,
    variant: 'info' as const,
    confirmLabel: 'Approve',
  },
  reject: {
    title: (resource: string) => `Reject ${resource}`,
    message: (resource: string, count: number) =>
      `Are you sure you want to reject ${count > 1 ? `${count} ${resource}s` : `this ${resource}`
      }?`,
    variant: 'warning' as const,
    confirmLabel: 'Reject',
  },
  delete: {
    title: (resource: string) => `Delete ${resource}`,
    message: (resource: string, count: number) =>
      `Are you sure you want to delete ${count > 1 ? `${count} ${resource}s.` : `this ${resource}?`} This action cannot be undone.`,
    variant: 'danger' as const,
    confirmLabel: 'Delete',
  },
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void

  resource: Resource
  action: ActionType
  count?: number

  title?: string
  message?: string

  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

const variantConfig = {
  danger: {
    icon: TriangleAlert,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: CircleAlert,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonVariant: 'secondary' as const,
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonVariant: 'primary' as const,
  },
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  count,
  isLoading = false,
  resource,
  title,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant,
  message,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isLoading, onClose])

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const configFromAction = action ? ACTION_CONFIG[action] : null

  const r = resource ?? ''
  const finalTitle = title ?? configFromAction?.title(r) ?? ''
  const finalMessage =
    message ??
    (configFromAction
      ? configFromAction.message(r, count ?? 1)
      : '')

  const finalVariant = variant ?? configFromAction?.variant ?? 'danger'

  // const resolvedVariant = finalVariant
  const config = variantConfig[finalVariant]
  const Icon = config.icon

  const finalConfirmLabel =
    confirmLabel ?? configFromAction?.confirmLabel ?? 'Confirm'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative bg-white rounded-radius-brand shadow-xl',
          'w-full max-w-md p-6',
          'animate-in fade-in zoom-in-95 duration-200'
        )}
        tabIndex={-1}
        role='dialog'
        aria-modal='true'
        aria-labelledby='confirm-title'
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
              config.iconBg
            )}
          >
            <Icon className={cn('w-6 h-6', config.iconColor)} />
          </div>
          <div className="flex-1">
            <h3 id='confirm-title' className="text-lg font-semibold text-charcoal">{finalTitle}</h3>
            <p className="mt-2 text-sm text-warm-gray-dark">{finalMessage}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
            className="flex-1"
          >
            {finalConfirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
