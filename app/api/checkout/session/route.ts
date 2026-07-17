import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import type Stripe from 'stripe'
import { getServerSession } from '@/lib/auth-server'
import dbConnect from '@/lib/db/connection'
import { Product } from '@/lib/db/models'
import { getStripe } from '@/lib/stripe'
import type { TCartItem, TShippingFormData, TShippingMethod } from '@/lib/types'
import { TPaymentFormData } from '@/lib/types'

type TCheckoutRequest = {
  items: TCartItem[]
  paymentData: TPaymentFormData
  shippingData: TShippingFormData
}

const CURRENCY = 'usd'

class CheckoutValidationError extends Error {
  constructor(message: string, readonly status: number = 400) {
    super(message)
  }
}

async function getCanonicalCartItems(items: TCartItem[]): Promise<TCartItem[]> {
  const requestedItems = new Map<string, {
    productId: string
    variantId: string
    quantity: number
  }>()

  for (const item of items) {
    const productId = item.product.id
    const variantId = item.product.variant.id

    if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(variantId)) {
      throw new CheckoutValidationError('Invalid product or variant')
    }

    const key = `${productId}:${variantId}`
    const existing = requestedItems.get(key)

    if (existing) {
      existing.quantity += item.quantity
    } else {
      requestedItems.set(key, { productId, variantId, quantity: item.quantity })
    }
  }

  await dbConnect()

  const productIds = [...new Set(
    [...requestedItems.values()].map((item) => item.productId)
  )]
  const products = await Product.find({ _id: { $in: productIds } })
    .select('name variants')
    .lean()
  const productsById = new Map(products.map((product) => [product._id.toString(), product]))

  return [...requestedItems.values()].map((requestedItem) => {
    const product = productsById.get(requestedItem.productId)
    const variant = product?.variants.find(
      (candidate) => candidate._id?.toString() === requestedItem.variantId
    )

    if (!product || !variant) {
      throw new CheckoutValidationError('A product or variant is no longer available', 409)
    }

    if (variant.stock < requestedItem.quantity) {
      throw new CheckoutValidationError(
        `Only ${variant.stock} item(s) remain for ${product.name}`,
        409
      )
    }

    return {
      id: `${requestedItem.productId}-${requestedItem.variantId}`,
      product: {
        id: requestedItem.productId,
        name: product.name,
        variant: {
          id: requestedItem.variantId,
          attributes: variant.attributes as TCartItem['product']['variant']['attributes'],
          price: variant.price,
          originalPrice: variant.originalPrice,
          stock: variant.stock,
          sku: variant.sku,
          images: variant.images,
        },
      },
      quantity: requestedItem.quantity,
    }
  })
}

function getShippingCost(subtotal: number, shippingMethod: TShippingMethod) {
  if (shippingMethod === 'express') return 12.99
  if (shippingMethod === 'overnight') return 24.99
  return subtotal >= 50 ? 0 : 5.99
}

function toCents(amount: number) {
  return Math.round(amount * 100)
}

function calculateOrderTotals(items: TCartItem[], shippingMethod: TShippingMethod) {
  const subtotal = items.reduce((sum, item) => (
    sum + item.product.variant.price * item.quantity
  ), 0)
  const shipping = getShippingCost(subtotal, shippingMethod)
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return {
    subtotal,
    shipping,
    tax,
    total,
    amount: toCents(total),
  }
}

function getBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '')
  }

  return new URL(request.url).origin
}

function getLineItems(
  items: TCartItem[],
  totals: ReturnType<typeof calculateOrderTotals>
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const productLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
    const image = item.product.variant.images[0]?.secure_url

    return {
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: item.product.name,
          description: Object.values(item.product.variant.attributes || {}).join(' / ') || undefined,
          images: image ? [image] : undefined,
          metadata: {
            productId: item.product.id,
            variantId: item.product.variant.id,
            sku: item.product.variant.sku,
            selectedVariants: JSON.stringify(item.product.variant.attributes || {}),
          },
        },
        unit_amount: toCents(item.product.variant.price),
      },
      quantity: item.quantity,
    }
  })

  const adjustmentLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  if (totals.shipping > 0) {
    adjustmentLineItems.push({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: 'Shipping',
        },
        unit_amount: toCents(totals.shipping),
      },
      quantity: 1,
    })
  }

  if (totals.tax > 0) {
    adjustmentLineItems.push({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: 'Taxes',
        },
        unit_amount: toCents(totals.tax),
      },
      quantity: 1,
    })
  }

  return [...productLineItems, ...adjustmentLineItems]
}

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as TCheckoutRequest
  const { items: requestedItems, paymentData, shippingData } = body

  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  if (!shippingData || !paymentData) {
    return NextResponse.json({ error: 'Missing checkout details' }, { status: 400 })
  }

  if (!['standard', 'express', 'overnight'].includes(shippingData.shippingMethod)) {
    return NextResponse.json({ error: 'Invalid shipping method' }, { status: 400 })
  }

  const hasInvalidItem = requestedItems.some((item) => (
    !item.product?.id ||
    !item.product?.name ||
    !item.product?.variant?.id ||
    !Number.isFinite(item.product.variant.price) ||
    item.product.variant.price < 0 ||
    !Number.isInteger(item.quantity) ||
    item.quantity < 1
  ))

  if (hasInvalidItem) {
    return NextResponse.json({ error: 'Invalid cart item' }, { status: 400 })
  }

  let items: TCartItem[]

  try {
    items = await getCanonicalCartItems(requestedItems)
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('Could not validate checkout inventory:', error)
    return NextResponse.json({ error: 'Could not validate checkout inventory' }, { status: 500 })
  }

  const totals = calculateOrderTotals(items, shippingData.shippingMethod)

  if (totals.amount < 50) {
    return NextResponse.json({ error: 'Order total is too low' }, { status: 400 })
  }

  let stripe

  try {
    stripe = getStripe()
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Stripe is not configured' },
      { status: 500 }
    )
  }

  const baseUrl = getBaseUrl(request)
  const stripeSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: shippingData.email || session.user.email,
    line_items: getLineItems(items, totals),
    billing_address_collection: 'auto',
    phone_number_collection: {
      enabled: true,
    },
    payment_intent_data: {
      receipt_email: shippingData.email || session.user.email,
      metadata: {
        userId: session.user.id,
        subtotal: totals.subtotal.toFixed(2),
        shipping: totals.shipping.toFixed(2),
        tax: totals.tax.toFixed(2),
        total: totals.total.toFixed(2),
      },
    },
    metadata: {
      userId: session.user.id,
      itemCount: String(items.reduce((sum, item) => sum + item.quantity, 0)),
      shippingMethod: shippingData.shippingMethod,
      customerName: `${shippingData.firstName} ${shippingData.lastName}`,
      customerEmail: shippingData.email,
      subtotal: totals.subtotal.toFixed(2),
      shipping: totals.shipping.toFixed(2),
      tax: totals.tax.toFixed(2),
      total: totals.total.toFixed(2),
      billingSameAsShipping: String(paymentData.sameAsShipping),
      shippingFirstName: shippingData.firstName,
      shippingLastName: shippingData.lastName,
      shippingStreet: shippingData.address,
      shippingApartment: shippingData.apartment || '',
      shippingCity: shippingData.city,
      shippingState: shippingData.state,
      shippingZipCode: shippingData.zipCode,
      shippingCountry: shippingData.country,
      shippingPhone: shippingData.phone,
      billingStreet: paymentData.sameAsShipping ? shippingData.address : paymentData.billingAddress,
      billingCity: paymentData.sameAsShipping ? shippingData.city : paymentData.billingCity,
      billingState: paymentData.sameAsShipping ? shippingData.state : paymentData.billingState,
      billingZipCode: paymentData.sameAsShipping ? shippingData.zipCode : paymentData.billingZip,
    },
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel`,
  })

  if (!stripeSession.url) {
    return NextResponse.json({ error: 'Could not create Stripe Checkout session' }, { status: 500 })
  }

  return NextResponse.json({
    id: stripeSession.id,
    url: stripeSession.url,
  })
}
