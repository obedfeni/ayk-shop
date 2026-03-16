async function sendEmailNotification(order: {
  customerName: string; phone: string; location: string;
  productName: string; variant: string; quantity: number;
  amount: number; reference: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!adminEmail || !resendKey) {
    console.log('Email not configured: missing ADMIN_EMAIL or RESEND_API_KEY');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Accessorize With Yvon <onboarding@resend.dev>',
        to: [adminEmail],
        subject: `🛍️ New Order ${order.reference} — ${order.productName}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <div style="background:#D97706;padding:20px;border-radius:12px 12px 0 0;text-align:center">
              <h1 style="color:white;margin:0;font-size:22px">New Order Received!</h1>
              <p style="color:#FEF3C7;margin:6px 0 0">Accessorize With Yvon & Knottycraft</p>
            </div>
            <div style="background:#FFFBEB;padding:24px;border:1px solid #E7E5E4;border-top:none">
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr style="background:#F5F5F4">
                  <td style="padding:10px 8px;color:#78716C;width:40%">Reference</td>
                  <td style="padding:10px 8px;font-weight:bold">${order.reference}</td>
                </tr>
                <tr>
                  <td style="padding:10px 8px;color:#78716C">Product</td>
                  <td style="padding:10px 8px">${order.productName} (${order.variant}) ×${order.quantity}</td>
                </tr>
                <tr style="background:#F5F5F4">
                  <td style="padding:10px 8px;color:#78716C">Customer</td>
                  <td style="padding:10px 8px">${order.customerName}</td>
                </tr>
                <tr>
                  <td style="padding:10px 8px;color:#78716C">Phone</td>
                  <td style="padding:10px 8px">${order.phone}</td>
                </tr>
                <tr style="background:#F5F5F4">
                  <td style="padding:10px 8px;color:#78716C">Location</td>
                  <td style="padding:10px 8px">${order.location}</td>
                </tr>
                <tr style="background:#FEF3C7">
                  <td style="padding:10px 8px;color:#92400E;font-weight:bold;font-size:16px">Amount</td>
                  <td style="padding:10px 8px;color:#DC2626;font-weight:bold;font-size:20px">GHS ${order.amount}</td>
                </tr>
              </table>
            </div>
            <div style="background:#fff;padding:16px;border:1px solid #E7E5E4;border-top:none;border-radius:0 0 12px 12px;text-align:center">
              <p style="color:#78716C;font-size:13px;margin:0">Login to approve or cancel this order</p>
              <p style="color:#D97706;font-size:13px;margin:6px 0 0;font-weight:bold">ayk-shop.vercel.app/admin</p>
            </div>
          </div>`,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Resend error:', err);
    } else {
      console.log('Order email sent to', adminEmail);
    }
  } catch (err) {
    console.error('Email failed:', err);
  }
}
