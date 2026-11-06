import type { TAdminOrder } from '@/lib/types'

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function printOrderInvoice(order: TAdminOrder) {
  const printWindow = window.open('', '_blank', 'width=900,height=900')
  if (!printWindow) return false

  const address = order.shippingAddress
  const invoiceDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(order.date))

  const invoiceHtml = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Invoice ${escapeHtml(order.orderNumber)}</title>
        <style>
          * { box-sizing: border-box; }
          body { max-width: 860px; margin: 0 auto; padding: 40px; color: #232323; font: 14px/1.5 Arial, sans-serif; }
          header { display: flex; justify-content: space-between; gap: 24px; padding-bottom: 22px; border-bottom: 2px solid #b8956c; }
          .brand { color: #b8956c; font-size: 28px; font-weight: 700; letter-spacing: 4px; }
          .invoice-heading { text-align: right; }
          .invoice-heading h1 { margin: 0; font-size: 24px; }
          .muted { color: #666; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 32px 0; }
          .details h2 { margin: 0 0 8px; color: #666; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
          .details p { margin: 2px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th { padding: 12px; background: #f7f4ef; color: #666; font-size: 11px; letter-spacing: .8px; text-align: left; text-transform: uppercase; }
          td { padding: 14px 12px; border-bottom: 1px solid #e8e4dd; vertical-align: top; }
          .right { text-align: right; }
          .summary { width: 320px; margin: 28px 0 0 auto; }
          .summary-row { display: flex; justify-content: space-between; padding: 6px 0; }
          .summary-row.total { margin-top: 8px; padding-top: 12px; border-top: 2px solid #232323; font-size: 18px; font-weight: 700; }
          footer { margin-top: 56px; padding-top: 18px; border-top: 1px solid #e8e4dd; color: #666; text-align: center; font-size: 12px; }
          @media print { body { max-width: none; padding: 20px; } }
        </style>
      </head>
      <body>
        <header>
          <div class="brand">LUMINA</div>
          <div class="invoice-heading">
            <h1>INVOICE</h1>
            <div class="muted">${escapeHtml(order.orderNumber)}</div>
          </div>
        </header>

        <section class="details">
          <div>
            <h2>Ship To</h2>
            <p><strong>${escapeHtml(address.firstName)} ${escapeHtml(address.lastName)}</strong></p>
            <p>${escapeHtml(address.street)}</p>
            ${address.apartment ? `<p>${escapeHtml(address.apartment)}</p>` : ''}
            <p>${escapeHtml(address.city)}, ${escapeHtml(address.state)} ${escapeHtml(address.zipCode)}</p>
            <p>${escapeHtml(address.country)}</p>
            <p>${escapeHtml(address.phone)}</p>
            ${order.customer.email ? `<p>${escapeHtml(order.customer.email)}</p>` : ''}
          </div>
          <div>
            <h2>Invoice Details</h2>
            <p><strong>Invoice date:</strong> ${escapeHtml(invoiceDate)}</p>
            <p><strong>Order number:</strong> ${escapeHtml(order.orderNumber)}</p>
            <p><strong>Order status:</strong> ${escapeHtml(order.status)}</p>
            <p><strong>Payment status:</strong> ${escapeHtml(order.paymentStatus)}</p>
          </div>
        </section>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Variant</th>
              <th class="right">Quantity</th>
              <th class="right">Unit price</th>
              <th class="right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems.map((item) => `
              <tr>
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.variant || '—')}</td>
                <td class="right">${escapeHtml(item.quantity)}</td>
                <td class="right">${escapeHtml(formatPrice(item.price))}</td>
                <td class="right">${escapeHtml(formatPrice(item.price * item.quantity))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <section class="summary">
          <div class="summary-row"><span>Subtotal</span><span>${escapeHtml(formatPrice(order.subtotal))}</span></div>
          <div class="summary-row"><span>Shipping</span><span>${order.shipping === 0 ? 'Free' : escapeHtml(formatPrice(order.shipping))}</span></div>
          ${order.discount > 0 ? `<div class="summary-row"><span>Discount</span><span>-${escapeHtml(formatPrice(order.discount))}</span></div>` : ''}
          <div class="summary-row"><span>Tax</span><span>${escapeHtml(formatPrice(order.tax))}</span></div>
          <div class="summary-row total"><span>Total</span><span>${escapeHtml(formatPrice(order.total))}</span></div>
        </section>

        <footer>
          <strong>LUMINA</strong><br />
          support@lumina.com · 1-800-LUMINA
        </footer>
      </body>
    </html>
  `

  // printWindow.document.open()
  printWindow.document.documentElement.innerHTML = invoiceHtml
  // printWindow.document.close()
  printWindow.focus()
  printWindow.setTimeout(() => printWindow.print(), 250)
  return true
}
