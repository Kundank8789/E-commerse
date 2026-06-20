import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {  // ✅ added request parameter
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("❌ JWT verification failed:", error.message);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.id || decoded._id || decoded.userId;

    if (!userId) {
      return NextResponse.json({ error: "User ID not found in token" }, { status: 400 });
    }

    console.log("✅ Decoded userId:", userId);

    // ✅ use request.url instead of req.url
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit")) || 50;
    const page = parseInt(url.searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    const filter = { user: userId };
    if (status) filter.status = status;

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .populate("items.product", "name images price slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    console.log(`✅ Orders found: ${orders.length} (Total: ${totalOrders})`);

    const stats = {
      total: totalOrders,
      pending: await Order.countDocuments({ user: userId, status: "pending" }),
      confirmed: await Order.countDocuments({ user: userId, status: "confirmed" }),
      shipped: await Order.countDocuments({ user: userId, status: "shipped" }),
      delivered: await Order.countDocuments({ user: userId, status: "delivered" }),
      cancelled: await Order.countDocuments({ user: userId, status: "cancelled" }),
    };

    return NextResponse.json({
      success: true,
      orders,
      stats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit,
        hasMore: page * limit < totalOrders,
      },
    });

  } catch (err) {
    console.error("❌ MY-ORDERS ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}