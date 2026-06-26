import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = await req.json();

    // ✅ Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // ✅ Get user from token
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Validate order data
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order data is missing" },
        { status: 400 }
      );
    }

    // ✅ Create order ONLY after successful payment verification
    const order = await Order.create({
      user: decoded.id,
      items: orderData.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        productName: item.productName || '',
        productPrice: item.productPrice || 0,
        productImage: item.productImage || '',
        selectedSize: item.selectedSize || '',
        selectedColor: item.selectedColor || '',
        shippingCost: item.shippingCost || 0,
      })),
      subtotal: orderData.subtotal || 0,
      shippingCost: orderData.shippingCost || 0,
      total: orderData.total || 0,
      address: orderData.address,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      status: "confirmed",
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      notes: orderData.notes || "",
    });

    // ✅ Reduce stock for each item
    for (const item of orderData.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order._id,
      order: order,
    });
  } catch (err) {
    console.error("❌ Payment Verification Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}