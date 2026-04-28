// components/product/ShareDropdown.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Share2,
  Link2,
  Check,
  X,
} from 'lucide-react'

import { XIcon, FacebookIcon, WhatsAppIcon, PinterestIcon } from '../icons'

import { cn } from '@/lib/utils'

interface ShareDropdownProps {
  productName: string
  productDescription?: string
  imageUrl?: string
}

interface ShareOption {
  label: string
  icon: React.ReactNode
  action: () => void
  className?: string
}

export function ShareDropdown({
  productName,
  productDescription,
  imageUrl,
}: ShareDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Get product page URL for sharing
  const getShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return ''
    return window.location.href
  }, [])

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Reset error after 3s
  useEffect(() => {
    if (!shareError) return
    const timer = setTimeout(() => setShareError(null), 2000)
    return () => clearTimeout(timer)
  }, [shareError])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 2000)
    } catch {
      setShareError('Failed to copy link.')
    }
  }, [getShareUrl])

  const openPopup = useCallback((url: string) => {
    window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer')
    setIsOpen(false)
  }, [])

  const handleTwitterShare = useCallback(() => {
    const text = encodeURIComponent(`Check out ${productName}!`)
    const url = encodeURIComponent(getShareUrl())
    openPopup(`https://twitter.com/intent/tweet?text=${text}&url=${url}`)
  }, [productName, getShareUrl, openPopup])

  const handleFacebookShare = useCallback(() => {
    const url = encodeURIComponent(getShareUrl())
    openPopup(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
  }, [getShareUrl, openPopup])

  const handleWhatsAppShare = useCallback(() => {
    const text = encodeURIComponent(
      `Check out ${productName}! ${getShareUrl()}`
    )
    openPopup(`https://wa.me/?text=${text}`)
  }, [productName, getShareUrl, openPopup])

  const handlePinterestShare = useCallback(() => {
    const url = encodeURIComponent(getShareUrl())
    const media = encodeURIComponent(imageUrl ?? '')
    const description = encodeURIComponent(
      productDescription ?? `Check out ${productName}!`
    )
    openPopup(
      `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`
    )
  }, [productName, productDescription, imageUrl, getShareUrl, openPopup])

  // Use native Web Share API on supported devices (mobile)
  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title: productName,
        text: productDescription ?? `Check out ${productName}!`,
        url: getShareUrl(),
      })
    } catch (err) {
      // User cancelled — not an error worth surfacing
      if ((err as DOMException).name !== 'AbortError') {
        setShareError('Sharing failed. Please try again.')
      }
    }
  }, [productName, productDescription, getShareUrl])

  const handleShareClick = useCallback(() => {
    if ('share' in navigator && /Mobi|Android/i.test(navigator.userAgent)) {
      handleNativeShare()
    } else {
      setIsOpen((prev) => !prev)
    }
  }, [handleNativeShare])

  const shareOptions: ShareOption[] = [
    {
      label: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Link2 className="w-4 h-4" />
      ),
      action: handleCopyLink,
      className: copied ? 'text-green-600' : '',
    },
    {
      label: 'Twitter / X',
      icon: <XIcon className="w-4 h-4 text-black" />,
      action: handleTwitterShare,
      className: 'hover:text-sky-500',
    },
    {
      label: 'Facebook',
      icon: <FacebookIcon className="w-4 h-4 text-[#0866FF]" />,
      action: handleFacebookShare,
      className: 'hover:text-blue-600',
    },
    {
      label: 'WhatsApp',
      icon: <WhatsAppIcon className='w-4 h-4 text-[#25D366]' />,
      action: handleWhatsAppShare,
      className: 'hover:text-green-500',
    },
    {
      label: 'Pinterest',
      icon: <PinterestIcon className="w-4 h-4 text-[#BD081C]" />,
      action: handlePinterestShare,
      className: 'hover:text-red-600',
    },
  ]

  return (
    <div className="relative pt-2">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={handleShareClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Share this product"
        className="flex items-center gap-2 text-sm text-warm-gray-dark hover:text-charcoal transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share this product
      </button>

      {/* Error Toast */}
      {shareError && (
        <div className="absolute bottom-full mb-2 left-0 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 shadow-sm whitespace-nowrap">
          <X className="w-3 h-3 shrink-0" />
          {shareError}
        </div>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={dropdownRef}
          role="menu"
          aria-label="Share options"
          className={cn(
            'absolute bottom-full mb-3 left-0 z-50',
            'w-52 bg-white border border-warm-gray-light rounded-xl shadow-lg',
            'py-2 overflow-hidden',
            'animate-in fade-in slide-in-from-bottom-2 duration-150'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-warm-gray-light mb-1">
            <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">
              Share via
            </span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close share menu"
              className="text-warm-gray-dark hover:text-charcoal transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Share Options */}
          {shareOptions.map((option) => (
            <button
              key={option.label}
              role="menuitem"
              onClick={option.action}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5',
                'text-sm text-warm-gray-dark transition-colors',
                'hover:bg-linen/60 hover:text-charcoal',
                option.className
              )}
            >
              <span className="shrink-0">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}