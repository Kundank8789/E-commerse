import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; // ✅ ADD THIS
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ✅ GET SINGLE ORDER
export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name images price");

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);

  } catch (err) {
    console.error("GET ORDER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// 🔄 UPDATE STATUS
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

    // Prevent cancel after shipped/delivered
    if (status === "cancelled" && 
        (existing.status === "shipped" || existing.status === "delivered")) {
      return NextResponse.json(
        { error: "Cannot cancel after shipping" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updated = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
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