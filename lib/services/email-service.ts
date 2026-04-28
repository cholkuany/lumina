// lib/services/email-service.ts
import { Resend } from 'resend'
import { ReviewRequestEmail } from '@/lib/email-templates/review-request'
import { ReviewReminderEmail } from '@/lib/email-templates/review-reminder'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendReviewRequestParams {
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

interface SendReviewRejectionParams {
  to: string
  customerName: string
  productName: string
  reason: string
}

export async function sendReviewRequestEmail(params: SendReviewRequestParams) {
  const { to, customerName, orderNumber, orderDate, products } = params

  const productsWithUrls = products.map((product) => ({
    ...product,
    reviewUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.id}?review=true&order=${orderNumber}`,
  }))

  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(to)}&type=reviews`

  try {
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

    if (error) throw error

    return { success: true, emailId: data?.id }
  } catch (error) {
    console.error('Failed to send review request email:', error)
    return { success: false, error }
  }
}

export async function sendReviewReminderEmail(params: {
  to: string
  customerName: string
  product: { id: string; name: string; image: string }
  daysAgo: number
}) {
  const { to, customerName, product, daysAgo } = params

  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(to)}&type=reviews`

  try {
    const { data, error } = await resend.emails.send({
      from: 'LUMINA <reviews@lumina.com>',
      to: [to],
      subject: `Still enjoying your ${product.name}? Share your thoughts!`,
      react: ReviewReminderEmail({
        customerName,
        product: {
          ...product,
          reviewUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.id}?review=true`,
        },
        daysAgo,
        unsubscribeUrl,
      }),
    })

    if (error) throw error

    return { success: true, emailId: data?.id }
  } catch (error) {
    console.error('Failed to send review reminder email:', error)
    return { success: false, error }
  }
}

export async function sendReviewRejectionEmail(params: SendReviewRejectionParams) {
  const { to, customerName, productName, reason } = params

  try {
    const { data, error } = await resend.emails.send({
      from: 'LUMINA <support@lumina.com>',
      to: [to],
      subject: 'Update about your review submission',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'DM Sans', sans-serif; line-height: 1.6; color: #232323; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 32px; }
            .logo { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; }
            .content { background: #fff; border: 1px solid #E8E4DD; border-radius: 12px; padding: 32px; }
            .reason { background: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">LUMINA</div>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>Thank you for taking the time to review <strong>${productName}</strong>. Unfortunately, we weren't able to publish your review as it didn't meet our community guidelines.</p>
              <div class="reason">
                <strong>Reason:</strong> ${reason}
              </div>
              <p>We encourage you to submit a new review that follows our guidelines. Your feedback is valuable to us and helps other shoppers make informed decisions.</p>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              <p>Best regards,<br>The LUMINA Team</p>
            </div>
            <div class="footer">
              <p>© 2025 LUMINA. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) throw error

    return { success: true, emailId: data?.id }
  } catch (error) {
    console.error('Failed to send review rejection email:', error)
    return { success: false, error }
  }
}

export async function sendReviewApprovalEmail(params: {
  to: string
  customerName: string
  productName: string
  productUrl: string
}) {
  const { to, customerName, productName, productUrl } = params

  try {
    const { data, error } = await resend.emails.send({
      from: 'LUMINA <reviews@lumina.com>',
      to: [to],
      subject: 'Your review has been published! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'DM Sans', sans-serif; line-height: 1.6; color: #232323; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 32px; }
            .logo { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; }
            .content { background: #fff; border: 1px solid #E8E4DD; border-radius: 12px; padding: 32px; }
            .success { background: #F0FDF4; border-left: 4px solid #22C55E; padding: 16px; margin: 20px 0; }
            .button { display: inline-block; background: #B8956C; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
            .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">LUMINA</div>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <div class="success">
                <strong>Great news!</strong> Your review for <strong>${productName}</strong> has been published.
              </div>
              <p>Thank you for sharing your experience! Your feedback helps other shoppers make informed decisions and helps us improve.</p>
              <p>As a thank you, we've added <strong>50 reward points</strong> to your account.</p>
              <a href="${productUrl}" class="button">View Your Review</a>
              <p style="margin-top: 24px;">Keep sharing your thoughts on future purchases!</p>
              <p>Best regards,<br>The LUMINA Team</p>
            </div>
            <div class="footer">
              <p>© 2025 LUMINA. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) throw error

    return { success: true, emailId: data?.id }
  } catch (error) {
    console.error('Failed to send review approval email:', error)
    return { success: false, error }
  }
}