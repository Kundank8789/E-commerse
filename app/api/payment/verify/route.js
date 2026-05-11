import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = await req.json();

    // ✅ Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body).digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 });
    }

    // ✅ Get user
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Save order
    const order = await Order.create({
      user: decoded.id,
      items: orderData.items,
      total: orderData.total,
      address: orderData.address,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpay_order_id,
      razorpay_payment_id,
      status: "processing",
    });

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}