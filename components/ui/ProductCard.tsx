'use client'

import { ProductThumb } from '@/components/ui/ProductThumb'
import { WishlistButton } from '../layout/nav/WishlistButton'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { TProduct } from '@/lib/types'
import { ProductBadges } from './Productbadges'
import { QuickAddButton } from './Quickaddbutton'
import { RatingSummary } from './RatingSummary'
import { PriceDisplay } from './Pricedisplay'
import { QuantityStepper } from './QuantityStepper'
import { useUpdateCartQuantity } from '@/stores/cart/cart.selectors'
import { getDefaultVariant } from '@/lib/utils'

interface ProductCardProps {
  product: TProduct
  variant?: 'full' | 'compact'
}

import { useProductCardState } from '@/hooks/useProductcardstate'

interface ProductCardProps {
  product: TProduct
  variant?: 'full' | 'compact'
}

export function ProductCard({ product, variant = 'full' }: ProductCardProps) {
  const isCompact = variant === 'compact'

  const { currentVariant, quantity, isInCart, canAdd, addToCart, image } =
    useProductCardState(product)
  const updateQuantity = useUpdateCartQuantity()
  const defVariant = getDefaultVariant(product)

  return (
    <Link href={`/products/${product.id}`} className="group block min-w-0">
      <div
        className={cn(
          'overflow-hidden rounded-brand border card',
          'p-2 sm:p-2.5',
          isCompact && 'rounded-lg'
        )}
      >
        {/* Image */}
        <div className="relative mb-1.5 aspect-square overflow-hidden rounded-brand">
          <ProductThumb image={image} name={product.name} isCompact={isCompact} />
          <ProductBadges
            isSale={product.isSale}
            isNewArrival={product.isNewArrival}
            isCompact={isCompact}
          />
          <WishlistButton product={product} isCompact={isCompact} />
          {isInCart ? (
            <div className="absolute bottom-1.5 left-0 sm:bottom-2">
              <QuantityStepper
                min={0}
                max={defVariant.stock}
                size="sm"
                value={quantity}
                onChange={(qty) => updateQuantity(defVariant, qty)}
              />
            </div>
          ) : (
            <QuickAddButton
              onClick={addToCart}
              disabled={!canAdd}
              isCompact={isCompact}
            />
          )}
        </div>

        {/* Content */}
        <div className="relative min-w-0">
          <h3
            className={cn(
              'mb-1 overflow-hidden font-medium leading-tight text-foreground',
              'text-xs sm:text-[12.5px]',
              // reserve 2 lines of height so cards in a row stay aligned
              'h-[2.1rem] sm:h-8',
              isCompact ? 'line-clamp-2' : 'line-clamp-1 max-sm:line-clamp-2'
            )}
          >
            {product.name}
          </h3>

          {!isCompact && product.description && (
            // hidden on very small screens where there's no room for it
            <p className="mb-2 line-clamp-1 hidden text-xs text-foreground sm:block">
              {product.description}
            </p>
          )}

          <RatingSummary
            rating={product.rating}
            reviewCount={product.reviewCount}
            isCompact={isCompact}
            className={isCompact ? 'my-1' : 'mb-1.5 sm:mb-2'}
          />

          <PriceDisplay
            price={currentVariant.price}
            originalPrice={currentVariant.originalPrice}
            isCompact={isCompact}
          />
        </div>
      </div>
    </Link>
  )

  // return (
  //   <Link href={`/products/${product.id}`} className="group block">
  //     <div
  //       className={cn(
  //         'overflow-hidden rounded-brand border card p-2.5',
  //         isCompact && 'rounded-lg'
  //       )}
  //     >
  //       {/* Image */}
  //       <div className="relative aspect-square overflow-hidden rounded-brand mb-1.5">
  //         <ProductThumb image={image} name={product.name} isCompact={isCompact} />
  //         <ProductBadges
  //           isSale={product.isSale}
  //           isNewArrival={product.isNewArrival}
  //           isCompact={isCompact}
  //         />
  //         <WishlistButton product={product} isCompact={isCompact} />
  //         {
  //           isInCart
  //             ? <div className='absolute bottom-2 left-0 translate-y-0'>
  //               <QuantityStepper
  //                 min={0}
  //                 max={defVariant.stock}
  //                 size='sm'
  //                 value={quantity}
  //                 onChange={(qty) => updateQuantity(defVariant, qty)}
  //               />
  //             </div>
  //             :
  //             <QuickAddButton
  //               onClick={addToCart}
  //               disabled={!canAdd}
  //               isCompact={isCompact}
  //             />
  //         }
  //       </div>

  //       {/* Content */}
  //       <div className={cn('relative')}>
  //         <h3
  //           className={cn(
  //             'mb-1 h-8 overflow-hidden text-[12.5px] font-medium leading-tight text-foreground',
  //             isCompact ? 'line-clamp-2' : 'line-clamp-1'
  //           )}
  //         >
  //           {product.name}
  //         </h3>

  //         {!isCompact && product.description && (
  //           <p className="mb-2 line-clamp-1 text-xs text-foreground">
  //             {product.description}
  //           </p>
  //         )}

  //         <RatingSummary
  //           rating={product.rating}
  //           reviewCount={product.reviewCount}
  //           isCompact={isCompact}
  //           className={isCompact ? 'my-1' : 'mb-2'}
  //         />

  //         <PriceDisplay
  //           price={currentVariant.price}
  //           originalPrice={currentVariant.originalPrice}
  //           isCompact={isCompact}
  //         />
  //       </div>
  //     </div>
  //   </Link>
  // )
}
