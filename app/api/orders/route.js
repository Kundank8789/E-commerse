import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

// 🔥 CREATE ORDER
export async function POST(req) {
  try {
    await connectDB();

    const { items, total, address } = await req.json();

    // 🔐 CHECK AUTH
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ❌ VALIDATION
    if (!items || items.length === 0) {
      return Response.json(
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
      return Response.json(
        { error: "Address is incomplete" },
        { status: 400 }
      );
    }

    // ✅ CREATE ORDER
    const order = await Order.create({
      items,
      total,
      address,
      user: decoded.id, // 🔥 attach user
      status: "pending",
    });

    return Response.json(order);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// 🔥 GET ORDERS
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find()
      .populate("items.product")
      .sort({ createdAt: -1 });

    return Response.json(orders);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}