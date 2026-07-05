import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { orderId, activeIgn, cartTotal, cart } = await req.json();

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || "587";
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const emailTo = process.env.EMAIL_TO || smtpUser;
    const emailFrom = process.env.EMAIL_FROM || `"BongCraft SMP" <${smtpUser}>`;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn(
        "⚠️ SMTP credentials are not configured in environment variables. Email notification skipped."
      );
      return NextResponse.json({
        success: true,
        message: "Email skipped: SMTP not configured."
      });
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === "465", // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    // Construct purchased items rows
    const itemsHtml = cart
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #27272a; color: #f8fafc; font-size: 14px;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 14px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #27272a; color: #fbbf24; font-size: 14px; text-align: right; font-weight: bold;">₹${item.price * item.quantity}</td>
      </tr>
    `
      )
      .join("");

    // HTML Email template matching storefront branding
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background-color: #09090b;
            color: #f8fafc;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #111217;
            border: 1px solid #27272a;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .header {
            background: linear-gradient(135deg, #7c3aed 0%, #fbbf24 100%);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .body {
            padding: 30px;
          }
          .metadata-card {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
          }
          .metadata-item {
            margin-bottom: 10px;
            font-size: 13px;
          }
          .metadata-item span {
            color: #a1a1aa;
            font-weight: bold;
            text-transform: uppercase;
            display: inline-block;
            width: 130px;
          }
          .metadata-item strong {
            color: #ffffff;
          }
          .table-container {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }
          .table-header {
            background: #18181b;
            color: #a1a1aa;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .table-header th {
            padding: 12px;
            text-align: left;
          }
          .total-box {
            text-align: right;
            padding: 20px;
            background: #18181b;
            border-radius: 12px;
            border: 1px solid #27272a;
            font-size: 18px;
            font-weight: bold;
          }
          .total-box span {
            color: #a1a1aa;
            font-size: 14px;
            margin-right: 10px;
          }
          .footer {
            padding: 20px;
            text-align: center;
            background: #18181b;
            border-top: 1px solid #27272a;
            font-size: 11px;
            color: #71717a;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Purchase Order</h1>
          </div>
          <div class="body">
            <div class="metadata-card">
              <div class="metadata-item">
                <span>Order ID:</span>
                <strong>${orderId}</strong>
              </div>
              <div class="metadata-item">
                <span>Minecraft IGN:</span>
                <strong style="color: #a78bfa;">${activeIgn}</strong>
              </div>
              <div class="metadata-item">
                <span>Date & Time:</span>
                <strong>${new Date().toLocaleString()}</strong>
              </div>
              <div class="metadata-item">
                <span>Status:</span>
                <strong style="color: #34d399;">Pending Verification</strong>
              </div>
            </div>

            <table class="table-container">
              <thead>
                <tr class="table-header">
                  <th style="text-align: left;">Item Description</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total-box">
              <span>Grand Total:</span>
              <span style="color: #fbbf24; font-size: 20px;">₹${cartTotal}</span>
            </div>
          </div>
          <div class="footer">
            BongCraft SMP Official Store • Please verify this payment against your UPI merchant records.
          </div>
        </div>
      </body>
      </html>
    `;

    // Send Mail
    await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: `🔔 New Order Submitted: ${orderId} (${activeIgn})`,
      html: htmlContent
    });

    return NextResponse.json({
      success: true,
      message: "Order notification email sent successfully!"
    });
  } catch (error: any) {
    console.error("Failed to send order email:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
