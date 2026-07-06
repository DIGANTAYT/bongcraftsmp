import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, receipt, ign, items } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials are not configured on the server." },
        { status: 501 }
      );
    }

    // Call Razorpay API to create an order
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // in paise (e.g. ₹100 = 10000 paise)
        currency: "INR",
        receipt: receipt,
        notes: {
          ign: ign,
          items: JSON.stringify(items)
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.description || "Failed to create Razorpay order" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: keyId // Send keyId back to initialize client-side Razorpay modal
    });
  } catch (err: any) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
