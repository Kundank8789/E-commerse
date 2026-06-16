import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const body = await req.json();
    const signature = req.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== generatedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Process event
    const { event, payload } = body;
    await connectDB();

    switch (event) {
      case "payment.captured": {
        const payment = payload.payment.entity;
        const order = await Order.findOneAndUpdate(
          { razorpay_order_id: payment.order_id },
          { 
            paymentStatus: "paid",
            razorpay_payment_id: payment.id,
            status: "confirmed" 
          },
          { new: true }
        );
        console.log(`✅ Payment captured for order: ${order?._id}`);
        break;
      }
      case "payment.failed": {
        const payment = payload.payment.entity;
        await Order.findOneAndUpdate(
          { razorpay_order_id: payment.order_id },
          { paymentStatus: "failed" }
        );
        console.log(`❌ Payment failed: ${payment.order_id}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}