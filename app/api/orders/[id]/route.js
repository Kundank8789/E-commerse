import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ✅ GET SINGLE ORDER (Optimized)
export async function GET(req, context) {
  try {
    // Set timeout for database operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database timeout")), 8000);
    });

    await Promise.race([connectDB(), timeoutPromise]);

    const { id } = await context.params;

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name images price")
      .lean()
      .maxTimeMS(5000);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Add cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    return NextResponse.json(order, { headers });

  } catch (err) {
    console.error("GET ORDER ERROR:", err);
    
    if (err.message === "Database timeout") {
      return NextResponse.json(
        { error: "Request timeout", order: null },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// 🔄 UPDATE ORDER STATUS & PAYMENT (Enhanced)
export async function PUT(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const { status, paymentStatus } = await req.json();

    const existing = await Order.findById(id);

    if (!existing) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // ❌ Prevent cancel after shipped/delivered
    if (status === "cancelled" && 
        (existing.status === "shipped" || existing.status === "delivered")) {
      return NextResponse.json(
        { error: "Cannot cancel order after shipping" },
        { status: 400 }
      );
    }

    // ✅ Prevent changing status of delivered orders
    if (existing.status === "delivered" && status && status !== "delivered") {
      return NextResponse.json(
        { error: "Cannot modify delivered orders" },
        { status: 400 }
      );
    }

    // Build update object
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updated = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate("user", "name email")
    .populate("items.product", "name images price");

    return NextResponse.json(updated);

  } catch (err) {
    console.error("UPDATE ORDER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// ❌ DELETE ORDER (Admin only)
export async function DELETE(req, context) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await context.params;
    
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order deleted successfully" 
    });

  } catch (err) {
    console.error("DELETE ORDER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}