import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { amount } = await req.json();

    // ✅ debug logs — check terminal
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
    console.log("AMOUNT:", amount);
    console.log("PAISE:", Math.round(amount * 100));

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log("ORDER CREATED:", order.id);
    return NextResponse.json({ success: true, order });

  } catch (err) {
    console.error("❌ RAZORPAY ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}