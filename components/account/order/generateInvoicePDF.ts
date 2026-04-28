import type { OrderProps } from '@/lib/types'
// Invoice Generator
export function generateInvoicePDF(order: OrderProps) {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${order.orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #232323; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #B8956C; }
        .logo { font-size: 28px; font-weight: 700; color: #B8956C; letter-spacing: 4px; }
        .invoice-title { text-align: right; }
        .invoice-title h1 { font-size: 24px; color: #232323; margin-bottom: 5px; }
        .invoice-title p { color: #666; font-size: 14px; }
        .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .info-block { flex: 1; }
        .info-block h3 { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 10px; letter-spacing: 1px; }
        .info-block p { font-size: 14px; margin-bottom: 4px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background: #F7F4EF; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; letter-spacing: 1px; }
        .items-table td { padding: 16px 12px; border-bottom: 1px solid #E8E4DD; font-size: 14px; }
        .items-table .product-name { font-weight: 500; }
        .items-table .product-details { color: #666; font-size: 12px; margin-top: 4px; }
        .items-table .text-right { text-align: right; }
        .summary { margin-left: auto; width: 280px; }
        .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
        .summary-row.total { border-top: 2px solid #232323; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: 600; }
        .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #E8E4DD; text-align: center; color: #666; font-size: 12px; }
        .footer p { margin-bottom: 5px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">LUMINA</div>
        <div class="invoice-title">
          <h1>INVOICE</h1>
          <p>${order.orderNumber}</p>
        </div>
      </div>

      <div class="info-section">
        <div class="info-block">
          <h3>Bill To</h3>
          <p><strong>${order.billingAddress.firstName} ${order.billingAddress.lastName}</strong></p>
          <p>${order.billingAddress.street}</p>
          ${order.billingAddress.apartment ? `<p>${order.billingAddress.apartment}</p>` : ''}
          <p>${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}</p>
          <p>${order.billingAddress.country}</p>
        </div>
        <div class="info-block">
          <h3>Ship To</h3>
          <p><strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong></p>
          <p>${order.shippingAddress.street}</p>
          ${order.shippingAddress.apartment ? `<p>${order.shippingAddress.apartment}</p>` : ''}
          <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
          <p>${order.shippingAddress.country}</p>
        </div>
        <div class="info-block">
          <h3>Invoice Details</h3>
          <p><strong>Invoice Date:</strong> ${order.date}</p>
          <p><strong>Order Date:</strong> ${order.date}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod.brand} ****${order.paymentMethod.last4}</p>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>SKU</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>
                <div class="product-name">${item.product.name}</div>
                <div class="product-details">
                  ${item.product.color ? `Color: ${item.product.color}` : ''}
                  ${item.product.size ? ` | Size: ${item.product.size}` : ''}
                </div>
              </td>
              <td>${item.product.sku}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${formatPrice(item.product.price)}</td>
              <td class="text-right">${formatPrice(item.product.price * item.quantity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${formatPrice(order.subtotal)}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>${order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="summary-row" style="color: #16a34a;">
            <span>Discount</span>
            <span>-${formatPrice(order.discount)}</span>
          </div>
        ` : ''}
        <div class="summary-row">
          <span>Tax</span>
          <span>${formatPrice(order.tax)}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>${formatPrice(order.total + order.tax)}</span>
        </div>
      </div>

      <div class="footer">
        <p><strong>LUMINA</strong></p>
        <p>123 Commerce Street, New York, NY 10001</p>
        <p>support@lumina.com | 1-800-LUMINA</p>
        <p style="margin-top: 15px;">Thank you for shopping with us!</p>
      </div>
    </body>
    </html>
  `

  // Create blob and download
  const blob = new Blob([invoiceHTML], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  // Open in new window for printing/saving as PDF
  const printWindow = window.open(url, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  // Also provide direct download as HTML
  const link = document.createElement('a')
  link.href = url
  link.download = `Invoice-${order.orderNumber}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}