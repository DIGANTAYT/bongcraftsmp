import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { executeRcon } from "@/lib/rcon";
import { getDeliveryCommands } from "@/lib/commands";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = 
  supabaseUrl.startsWith("https://") && 
  supabaseAnonKey.length > 10;

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn("⚠️ Razorpay Webhook Secret is not configured in environment variables.");
      return NextResponse.json({ error: "Webhook secret missing" }, { status: 501 });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    // 1. Verify cryptographic signature to ensure the webhook request comes from Razorpay
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(bodyText)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Razorpay signature verification failed!");
      return NextResponse.json({ error: "Unauthorized signature" }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const event = payload.event;

    // We look for 'order.paid' or 'payment.captured' events
    if (event === "order.paid" || event === "payment.captured") {
      const paymentEntity = payload.payload.payment?.entity;
      const orderEntity = payload.payload.order?.entity;

      // Extract notes metadata (IGN and items)
      const notes = orderEntity?.notes || paymentEntity?.notes || {};
      const ign = notes.ign;
      const receipt = orderEntity?.receipt || paymentEntity?.description; // maps back to store orderId
      const itemsRaw = notes.items;

      if (!ign || !receipt || !itemsRaw) {
        console.warn("⚠️ Webhook payload missing crucial metadata (ign, receipt, or items)");
        return NextResponse.json({ received: true });
      }

      const items = typeof itemsRaw === "string" ? JSON.parse(itemsRaw) : itemsRaw;
      const itemNames = items.map((i: any) => `${i.name} (x${i.quantity})`);

      console.log(`⚡ Razorpay webhook received successful payment for order: ${receipt} (Player: ${ign})`);

      // 2. Load order from Supabase & update status to Completed
      if (supabase) {
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("order_id", receipt)
          .maybeSingle();

        if (orderData) {
          await supabase
            .from("orders")
            .update({ status: "Completed" })
            .eq("order_id", receipt);
        } else {
          // If the order record doesn't exist for some reason, insert it directly
          await supabase.from("orders").insert([{
            order_id: receipt,
            ign: ign,
            items: items,
            total: (orderEntity?.amount || paymentEntity?.amount || 0) / 100, // convert paise back to rupees
            status: "Completed"
          }]);
        }
      }

      // 3. Dispatch RCON commands for automatic instant delivery in-game!
      try {
        const commands = getDeliveryCommands(ign, itemNames);
        console.log(`📡 Dispatched RCON commands for ${ign}:`, commands);

        for (const cmd of commands) {
          if (!cmd.startsWith("#")) {
            await executeRcon(cmd);
          }
        }
      } catch (rconErr) {
        console.error("❌ Webhook RCON execution failed:", rconErr);
        // Do not return error code to Razorpay (they will keep retrying and spamming webhooks if we return 500)
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Razorpay webhook processing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
