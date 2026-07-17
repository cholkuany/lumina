import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getServerSession } from '@/lib/auth-server'
import dbConnect from '@/lib/db/connection'
import { Order } from '@/lib/db/models'
import { getStripe } from '@/lib/stripe'
import {
  decrementInventoryForOrder,
  InventoryAdjustmentError,
} from '@/lib/services/inventory-service'

type CreateOrderRequest = {
  sessionId?: string
}

function getStripeProduct(lineItem: Stripe.LineItem) {
  const product = lineItem.price?.product
  return product && typeof product !== 'string' && !product.deleted ? product : null
}

function getPaymentMethod(stripeSession: Stripe.Checkout.Session) {
  const paymentIntent = stripeSession.payment_intent
  const paymentMethod = typeof paymentIntent === 'object' && paymentIntent
    ? paymentIntent.payment_method
    : null

  if (!paymentMethod || typeof paymentMethod === 'string' || paymentMethod.type !== 'card') {
    return {
      type: 'card' as const,
      brand: 'card',
      last4: '',
    }
  }

  return {
    type: 'card' as const,
    brand: paymentMethod.card?.brand || 'card',
    last4: paymentMethod.card?.last4 || '',
    expiryMonth: paymentMethod.card?.exp_month,
    expiryYear: paymentMethod.card?.exp_year,
  }
}

async function finalizeInventory(orderId: mongoose.Types.ObjectId) {
  try {
    await decrementInventoryForOrder(orderId)
    return null
  } catch (error) {
    if (!(error instanceof InventoryAdjustmentError)) {
      console.error('Could not adjust order inventory:', error)
      return NextResponse.json({
        error: 'The order was saved, but inventory could not be updated',
        orderId: orderId.toString(),
      }, { status: 500 })
    }

    await Order.updateOne(
      { _id: orderId, inventoryAdjustedAt: { $exists: false } },
      { $set: { inventoryStatus: 'failed' } }
    )

    return NextResponse.json({
      error: 'Payment was recorded, but there is not enough stock to fulfill this order',
      orderId: orderId.toString(),
    }, { status: 409 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: CreateOrderRequest

  try {
    body = await request.json() as CreateOrderRequest
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.sessionId?.startsWith('cs_')) {
    return NextResponse.json({ error: 'Invalid Stripe Checkout session' }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const stripeSession = await stripe.checkout.sessions.retrieve(body.sessionId, {
      expand: ['payment_intent.payment_method'],
    })

    if (stripeSession.metadata?.userId !== session.user.id) {
      return NextResponse.json({ error: 'This Checkout session does not belong to you' }, { status: 403 })
    }

    if (stripeSession.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Stripe has not confirmed this payment' }, { status: 409 })
    }

    await dbConnect()

    const existingOrder = await Order.findOne({
      stripeCheckoutSessionId: stripeSession.id,
    }).select('_id orderNumber')

    if (existingOrder) {
      const inventoryError = await finalizeInventory(existingOrder._id)
      if (inventoryError) return inventoryError

      return NextResponse.json({
        orderId: existingOrder._id.toString(),
        orderNumber: existingOrder.orderNumber,
        created: false,
      })
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(stripeSession.id, {
      limit: 100,
      expand: ['data.price.product'],
    })

    const items = lineItems.data.flatMap((lineItem) => {
      const product = getStripeProduct(lineItem)
      const productId = product?.metadata.productId
      const variantId = product?.metadata.variantId

      if (
        !product ||
        !productId ||
        !variantId ||
        !mongoose.isValidObjectId(productId) ||
        !mongoose.isValidObjectId(variantId)
      ) return []

      let selectedVariants: Record<string, string> = {}
      try {
        selectedVariants = JSON.parse(product.metadata.selectedVariants || '{}')
      } catch {
        selectedVariants = {}
      }

      return [{
        product: productId,
        variant: variantId,
        productSnapshot: {
          name: product.name,
          price: (lineItem.price?.unit_amount || 0) / 100,
          image: product.images[0] || '',
          sku: product.metadata.sku,
        },
        quantity: lineItem.quantity || 1,
        selectedVariants,
      }]
    })

    if (items.length === 0) {
      return NextResponse.json({ error: 'No purchasable items were found in this payment' }, { status: 422 })
    }

    const metadata = stripeSession.metadata || {}
    const subtotal = Number(metadata.subtotal)
    const shipping = Number(metadata.shipping)
    const tax = Number(metadata.tax)
    const total = (stripeSession.amount_total || 0) / 100

    if (![subtotal, shipping, tax, total].every(Number.isFinite)) {
      return NextResponse.json({ error: 'The Checkout session has invalid totals' }, { status: 422 })
    }

    const itemsSubtotal = items.reduce((sum, item) => (
      sum + item.productSnapshot.price * item.quantity
    ), 0)
    const totalsMatch = Math.abs(itemsSubtotal - subtotal) < 0.01
      && Math.abs(subtotal + shipping + tax - total) < 0.01

    if (!totalsMatch) {
      return NextResponse.json({ error: 'The paid amount does not match the order totals' }, { status: 422 })
    }

    const shippingAddress = {
      firstName: metadata.shippingFirstName,
      lastName: metadata.shippingLastName,
      street: metadata.shippingStreet,
      apartment: metadata.shippingApartment || undefined,
      city: metadata.shippingCity,
      state: metadata.shippingState,
      zipCode: metadata.shippingZipCode,
      country: metadata.shippingCountry,
      phone: metadata.shippingPhone,
    }

    const paymentIntent = stripeSession.payment_intent
    const order = await Order.create({
      user: session.user.id,
      customerEmail: metadata.customerEmail || session.user.email,
      items,
      subtotal,
      shipping,
      tax,
      discount: 0,
      total,
      status: 'processing',
      shippingAddress,
      billingAddress: {
        ...shippingAddress,
        street: metadata.billingStreet,
        city: metadata.billingCity,
        state: metadata.billingState,
        zipCode: metadata.billingZipCode,
      },
      paymentMethod: getPaymentMethod(stripeSession),
      paymentStatus: 'paid',
      stripeCheckoutSessionId: stripeSession.id,
      stripePaymentIntentId: typeof paymentIntent === 'string' ? paymentIntent : paymentIntent?.id,
    })

    const inventoryError = await finalizeInventory(order._id)
    if (inventoryError) return inventoryError

    return NextResponse.json({
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      created: true,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      const order = await Order.findOne({ stripeCheckoutSessionId: body.sessionId })
        .select('_id orderNumber')

      if (order) {
        const inventoryError = await finalizeInventory(order._id)
        if (inventoryError) return inventoryError

        return NextResponse.json({
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          created: false,
        })
      }
    }

    console.error('Could not create paid order:', error)
    return NextResponse.json({ error: 'Could not create the order' }, { status: 500 })
  }
}
