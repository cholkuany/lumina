'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ProductVariant, Attribute } from '@/lib/types'
import { Check } from 'lucide-react'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selected: Partial<Attribute>
  onChange: (attributes: Record<string, string>) => void
}

export function VariantSelector({ variants, selected, onChange }: VariantSelectorProps) {

  const variantIndex = useMemo(() => {
    const index: Record<string, Record<string, ProductVariant>> = {}

    for (const variant of variants) {
      const color = variant.attributes?.color
      const size = variant.attributes?.size

      if (!color || !size) continue

      if (!index[color]) {
        index[color] = {}
      }

      index[color][size] = variant
    }

    return index
  }, [variants])

  const colorOptions = useMemo(() => {
    return Object.entries(variantIndex).map(([color, sizes]) => {
      const variants = Object.values(sizes)

      return {
        color,
        image: variants[0]?.images?.[0]?.secure_url,
        hasStock: variants.some(v => v.stock > 0),
        availableSizes: Object.keys(sizes)
      }
    })
  }, [variantIndex])

  // 1. Determine if we should show the color selector
  const showColorSelector = Object.keys(variantIndex).length > 1;

  // 2. Determine if we should show the size selector (only if a color is picked)
  const sizesForSelectedColor = selected.color ? variantIndex[selected.color] : {};
  const showSizeSelector = Object.keys(sizesForSelectedColor).length > 1;

  const currentVariant =
    selected.color &&
    selected.size &&
    variantIndex[selected.color]?.[selected.size]

  console.log('selected ===> ', selected)

  const currentStock = currentVariant ? currentVariant.stock : 0

  const handleColorChange = (color: string) => {
    const sizes = variantIndex[color]
    if (!sizes) return

    const variants = Object.values(sizes)

    const firstAvailable =
      variants.find(v => v.stock > 0) ?? variants[0]

    const size = firstAvailable?.attributes?.size

    onChange({
      color,
      ...(size ? { size } : {})
    })
  }

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      {showColorSelector && colorOptions.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-charcoal">
              Color: <span className="font-normal text-warm-gray-dark">{selected.color ? selected.color : 'Select'}</span>
            </span>
            {selected.color && (
              <span className="text-xs text-warm-gray-dark">
                {colorOptions.find(c => c.color === selected.color)?.availableSizes.length} sizes available
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {colorOptions.map(({ color, image, hasStock }) => {
              const isSelected = selected.color === color
              const displayName = color

              return (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  disabled={!hasStock}
                  title={`${displayName}${!hasStock ? ' (Out of stock)' : ''}`}
                  className={cn(
                    'relative rounded-md overflow-hidden transition-all duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2',
                    isSelected
                      ? 'ring-2 ring-charcoal'
                      : 'ring-1 ring-warm-gray-light hover:ring-warm-gray',
                    !hasStock && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 relative">
                    {image ? (
                      <Image
                        src={image}
                        alt={displayName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: color }}
                      />
                    )}

                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-charcoal/10 flex items-center justify-center">
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-charcoal" />
                        </div>
                      </div>
                    )}

                    {/* Out of stock diagonal line */}
                    {!hasStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[140%] h-px bg-charcoal/60 rotate-45" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Size Selector - Only shows sizes for selected color */}
      {showSizeSelector && selected.color && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-charcoal">
              Size: <span className="font-normal text-warm-gray-dark">{selected.size || 'Select'}</span>
            </span>
            {/* <button className="text-xs text-charcoal underline underline-offset-2 hover:no-underline">
              Size Guide
            </button> */}
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(variantIndex[selected.color]).map(([size, variant]) => {
              const isSelected = selected.size === size
              const isOutOfStock = variant.stock === 0

              return (
                <button
                  key={size}
                  onClick={() => onChange({ size: size })}
                  disabled={isOutOfStock}
                  className={cn(
                    'relative min-w-12 py-2.5 px-3 border rounded text-sm font-medium transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal',
                    isSelected
                      ? 'border-charcoal bg-charcoal text-white'
                      : isOutOfStock
                        ? 'border-warm-gray-light text-warm-gray line-through cursor-not-allowed bg-gray-50'
                        : 'border-warm-gray-light text-charcoal hover:border-charcoal'
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          {selected.size && currentStock <= 10 && (
            <div className="mt-2 flex items-center gap-4 text-xs text-warm-gray-dark">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                Low stock
              </span>
            </div>
          )
          }
        </div>
      )}

      {/* Stock Status */}
      {selected.color && selected.size && (
        <div className={cn(
          'text-sm py-2',
          currentStock === 0
            ? 'text-red-600'
            : currentStock <= 3
              ? 'text-amber-600'
              : 'text-green-600'
        )}>
          {currentStock === 0 ? (
            'Out of stock'
          ) : currentStock <= 3 ? (
            `Only ${currentStock} left in stock`
          ) : (
            'In stock'
          )}
        </div>
      )}
    </div>
  )
}
