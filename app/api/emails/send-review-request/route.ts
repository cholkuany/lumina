// app/api/emails/send-review-request/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ReviewRequestEmail } from '@/lib/email-templates/review-request'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ReviewRequestPayload {
  to: string
  customerName: string
  orderNumber: string
  orderDate: string
  products: Array<{
    id: string
    name: string
    image: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: ReviewRequestPayload = await request.json()
    const { to, customerName, orderNumber, orderDate, products } = body

    // Generate review URLs for each product
    const productsWithUrls = products.map((product) => ({
      ...product,
      reviewUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.id}?review=true&order=${orderNumber}`,
    }))

    // Generate unsubscribe URL
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(to)}&type=reviews`

    const { data, error } = await resend.emails.send({
      from: 'LUMINA <reviews@lumina.com>',
      to: [to],
      subject: `How was your order #${orderNumber}? Leave a review!`,
      react: ReviewRequestEmail({
        customerName,
        orderNumber,
        orderDate,
        products: productsWithUrls,
        unsubscribeUrl,
      }),
    })

    if (error) {
      console.error('Email send error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    // Log email sent for tracking
    console.log('Review request email sent:', { to, orderNumber, emailId: data?.id })

    return NextResponse.json({
      success: true,
      emailId: data?.id,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}