import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    // 🔥 MUST USE AWAIT
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const orders = await Order.find({ user: decoded.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return Response.json(orders);

  } catch (err) {
    console.error("❌ MY-ORDERS ERROR:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}