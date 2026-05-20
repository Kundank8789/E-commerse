import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// 🔥 CREATE ORDER
export async function POST(req) {
  try {
    await connectDB();

    const { items, total, address } = await req.json();

    // 🔐 CHECK AUTH
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ❌ VALIDATION
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (
      !address?.phone ||
      !address?.city ||
      !address?.state ||
      !address?.pincode ||
      !address?.addressLine
    ) {
      return NextResponse.json(
        { error: "Address is incomplete" },
        { status: 400 }
      );
    }

    // ✅ CREATE ORDER
    const order = await Order.create({
      items,
      total,
      address,
      user: decoded.id,
      status: "pending",
      paymentMethod: "cod",
      paymentStatus: "pending",
    });

    // Populate the order before returning
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name images price");

    return NextResponse.json(populatedOrder, { status: 201 });

  } catch (err) {
    console.error("POST ORDER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// 🔥 GET ORDERS (Optimized for Vercel)
export async function GET() {
  try {
    // Set timeout for database operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database timeout")), 8000);
    });

    await Promise.race([connectDB(), timeoutPromise]);

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })
      .limit(100) // Limit to last 100 orders for performance
      .lean()
      .maxTimeMS(5000);

    // Add cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    return NextResponse.json(orders, { headers });

  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    
    // Handle timeout gracefully
    if (err.message === "Database timeout" || err.name === "MongoTimeoutError") {
      return NextResponse.json(
        { error: "Request timeout", orders: [] },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: err.message, orders: [] },
      { status: 500 }
    );
  }
}