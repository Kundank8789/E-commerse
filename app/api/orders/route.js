import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";  // ✅ ADD THIS ONE LINE
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// 🔥 CREATE ORDER
export async function POST(req) {
  try {
    await connectDB();
    const { items, total, address } = await req.json();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!address?.phone || !address?.city || !address?.state || !address?.pincode || !address?.addressLine) {
      return NextResponse.json({ error: "Address is incomplete" }, { status: 400 });
    }

    const order = await Order.create({
      items,
      total,
      address,
      user: decoded.id,
      status: "pending",
      paymentMethod: "cod",
      paymentStatus: "pending",
    });

    return NextResponse.json(order, { status: 201 });

  } catch (err) {
    console.error("POST ORDER ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🔥 GET ORDERS
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find()
      .populate("user", "name email")  // This needs User model
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);

  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    return NextResponse.json({ error: err.message, orders: [] }, { status: 500 });
  }
}