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
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);       // is it defined?
    console.log("AMOUNT:", amount);                             // is amount correct?
    console.log("PAISE:", Math.round(amount * 100));            // must be integer

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // ✅ Math.round fixes decimal issue
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log("ORDER CREATED:", order.id); // ✅ success log
    return NextResponse.json({ success: true, order });

  } catch (err) {
    console.error("❌ RAZORPAY ERROR:", err); // ✅ full error in terminal
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}