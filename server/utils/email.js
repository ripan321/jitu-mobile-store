import nodemailer from 'nodemailer'

// Create transporter
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // Gmail App Password
  },
})

// ── FORMAT PRICE ──
const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN')

// ════════════════════════════════════════════
// ORDER EMAIL — TO ADMIN
// ════════════════════════════════════════════
export const sendOrderEmailToAdmin = async (order) => {
  const transporter = createTransporter()

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #f0f2f8;">${item.name}</td>
      <td style="padding:10px;border-bottom:1px solid #f0f2f8;text-align:center;">${item.qty}</td>
      <td style="padding:10px;border-bottom:1px solid #f0f2f8;text-align:right;font-weight:700;color:#1a237e;">${fmt(item.price * item.qty)}</td>
    </tr>
  `).join('')

  const deliveryHtml = order.orderType === 'pickup'
    ? `<b>Store:</b> ${order.store}<br/><b>Date:</b> ${order.pickupDate} at ${order.pickupTime}`
    : `<b>Address:</b> ${order.address}<br/><b>Pincode:</b> ${order.pincode}`

  const paymentHtml = order.paymentMode === 'emi'
    ? `<span style="background:#e8eaf6;color:#1a237e;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;">EMI</span>
       &nbsp;${order.emiPlan?.months} months @ ${fmt(order.emiPlan?.monthly)}/mo`
    : `<span style="background:#e0f2f1;color:#00695c;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;">Full Payment</span>
       &nbsp;Cash / UPI / Card`

  const html = `
  <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f4f6fb;padding:24px;">
    <div style="background:#1a237e;border-radius:12px 12px 0 0;padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;">🛒 New Order Received!</h1>
      <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;">${order.orderId}</p>
    </div>

    <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

      <!-- Customer -->
      <div style="background:#f8f9ff;border-radius:10px;padding:16px;margin-bottom:16px;">
        <h3 style="margin:0 0 10px;color:#1a237e;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Customer</h3>
        <b style="font-size:16px;">${order.customer.name}</b><br/>
        📞 ${order.customer.phone}
        ${order.customer.email ? `<br/>✉️ ${order.customer.email}` : ''}
      </div>

      <!-- Items -->
      <h3 style="margin:0 0 10px;color:#1a237e;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Items Ordered</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="background:#f4f6fb;">
            <th style="padding:8px 10px;text-align:left;font-size:12px;color:#90a4ae;">Product</th>
            <th style="padding:8px 10px;text-align:center;font-size:12px;color:#90a4ae;">Qty</th>
            <th style="padding:8px 10px;text-align:right;font-size:12px;color:#90a4ae;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px 10px;font-weight:700;font-size:15px;">Total Amount</td>
            <td style="padding:12px 10px;font-weight:800;font-size:18px;color:#1a237e;text-align:right;">${fmt(order.totalPrice)}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Delivery & Payment -->
      <div style="display:flex;gap:12px;margin-bottom:16px;">
        <div style="flex:1;background:#f8f9ff;border-radius:10px;padding:14px;">
          <h3 style="margin:0 0 8px;color:#1a237e;font-size:12px;letter-spacing:1px;text-transform:uppercase;">${order.orderType === 'pickup' ? '🏪 Pick Up' : '🚚 Delivery'}</h3>
          ${deliveryHtml}
        </div>
        <div style="flex:1;background:#f8f9ff;border-radius:10px;padding:14px;">
          <h3 style="margin:0 0 8px;color:#1a237e;font-size:12px;letter-spacing:1px;text-transform:uppercase;">💳 Payment</h3>
          ${paymentHtml}
        </div>
      </div>

      <!-- Action -->
      <div style="text-align:center;margin-top:20px;">
        <a href="${process.env.CLIENT_URL}/admin" style="background:#1a237e;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
          View in Admin Dashboard →
        </a>
      </div>

      <p style="text-align:center;color:#90a4ae;font-size:12px;margin-top:20px;">
        Jitu Mobile & Electronics · Boko, Kamrup, Assam
      </p>
    </div>
  </div>`

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      process.env.ADMIN_NOTIFY_EMAIL,
    subject: `🛒 New Order ${order.orderId} — ${order.customer.name} — ${fmt(order.totalPrice)}`,
    html,
  })
}

// ════════════════════════════════════════════
// ORDER CONFIRMATION — TO CUSTOMER
// ════════════════════════════════════════════
export const sendOrderConfirmationToCustomer = async (order) => {
  if (!order.customer.email) return  // skip if no email

  const transporter = createTransporter()

  const itemsText = order.items.map(i => `• ${i.name} × ${i.qty} — ${fmt(i.price * i.qty)}`).join('\n')

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f4f6fb;padding:20px;">
    <div style="background:#1a237e;border-radius:12px 12px 0 0;padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;">✅ Order Confirmed!</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;">${order.orderId}</p>
    </div>
    <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;">
      <p>Hi <b>${order.customer.name}</b>, thank you for shopping with Jitu Mobile!</p>
      <p>Your order has been received. Our team will call you within 30 minutes to confirm.</p>
      <div style="background:#f8f9ff;border-radius:10px;padding:16px;margin:16px 0;">
        <b>Order Summary</b><br/><br/>
        ${order.items.map(i => `${i.name} × ${i.qty} — <b>${fmt(i.price * i.qty)}</b>`).join('<br/>')}
        <br/><br/>
        <b>Total: ${fmt(order.totalPrice)}</b>
      </div>
      ${order.orderType === 'pickup'
        ? `<p>🏪 <b>Pick Up at:</b> ${order.store}<br/>📅 <b>Date:</b> ${order.pickupDate} at ${order.pickupTime}</p>`
        : `<p>🚚 <b>Home Delivery to:</b> ${order.address}</p>`
      }
      <p style="color:#90a4ae;font-size:12px;margin-top:24px;">Jitu Mobile & Electronics · Boko, Kamrup, Assam</p>
    </div>
  </div>`

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      order.customer.email,
    subject: `✅ Order Confirmed — ${order.orderId} | Jitu Mobile`,
    html,
  })
}

// ════════════════════════════════════════════
// REPAIR BOOKING EMAIL — TO ADMIN
// ════════════════════════════════════════════
export const sendRepairEmailToAdmin = async (repair) => {
  const transporter = createTransporter()

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f4f6fb;padding:20px;">
    <div style="background:#7b1fa2;border-radius:12px 12px 0 0;padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;">🔧 New Repair Booking!</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;">${repair.repairId}</p>
    </div>
    <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;">

      <div style="background:#f8f9ff;border-radius:10px;padding:16px;margin-bottom:14px;">
        <h3 style="margin:0 0 8px;color:#7b1fa2;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Customer</h3>
        <b style="font-size:16px;">${repair.customer.name}</b><br/>
        📞 ${repair.customer.phone}
        ${repair.customer.email ? `<br/>✉️ ${repair.customer.email}` : ''}
      </div>

      <div style="background:#f8f9ff;border-radius:10px;padding:16px;margin-bottom:14px;">
        <h3 style="margin:0 0 8px;color:#7b1fa2;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Device & Issue</h3>
        📱 <b>${repair.brand} ${repair.device}</b>${repair.modelNo ? ` — ${repair.modelNo}` : ''}<br/>
        🔧 ${repair.problem}
      </div>

      <div style="background:#f8f9ff;border-radius:10px;padding:16px;margin-bottom:14px;">
        <h3 style="margin:0 0 8px;color:#7b1fa2;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Drop-off Schedule</h3>
        📅 <b>${repair.dropDate}</b> at <b>${repair.dropTime}</b><br/>
        ⏱️ Estimated repair time: ${repair.estTime}<br/>
        💰 Estimated cost: <b>${repair.estCost}</b>
      </div>

      <div style="text-align:center;margin-top:20px;">
        <a href="${process.env.CLIENT_URL}/admin" style="background:#7b1fa2;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">
          View in Admin Dashboard →
        </a>
      </div>

      <p style="text-align:center;color:#90a4ae;font-size:12px;margin-top:20px;">
        Jitu Mobile & Electronics · Boko, Kamrup, Assam
      </p>
    </div>
  </div>`

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      process.env.ADMIN_NOTIFY_EMAIL,
    subject: `🔧 New Repair Booking ${repair.repairId} — ${repair.customer.name} — ${repair.brand} ${repair.device}`,
    html,
  })
}

// ════════════════════════════════════════════
// REPAIR CONFIRMATION — TO CUSTOMER
// ════════════════════════════════════════════
export const sendRepairConfirmationToCustomer = async (repair) => {
  if (!repair.customer.email) return

  const transporter = createTransporter()

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f4f6fb;padding:20px;">
    <div style="background:#7b1fa2;border-radius:12px 12px 0 0;padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;">🔧 Repair Booking Confirmed!</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;">${repair.repairId}</p>
    </div>
    <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;">
      <p>Hi <b>${repair.customer.name}</b>, your repair booking is confirmed!</p>
      <div style="background:#f8f9ff;border-radius:10px;padding:16px;margin:16px 0;">
        📱 <b>${repair.brand} ${repair.device}</b>${repair.modelNo ? ` (${repair.modelNo})` : ''}<br/>
        🔧 Issue: ${repair.problem}<br/>
        📅 Drop-off: <b>${repair.dropDate} at ${repair.dropTime}</b><br/>
        💰 Estimated cost: ${repair.estCost}
      </div>
      <p>Our technician will call you within 30 minutes to confirm your appointment.</p>
      <p style="color:#90a4ae;font-size:12px;">Jitu Mobile & Electronics · Boko, Kamrup, Assam</p>
    </div>
  </div>`

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      repair.customer.email,
    subject: `🔧 Repair Booking Confirmed — ${repair.repairId} | Jitu Mobile`,
    html,
  })
}
