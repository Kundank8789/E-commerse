import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Bug 2 Fix — handle both id and _id
    const userId = decoded.id || decoded._id;

    console.log("✅ Decoded userId:", userId); // 👈 check this in terminal

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    console.log("✅ Orders found:", orders.length); // 👈 check this in terminal

    // ✅ Bug 1 Fix — wrap in { orders: [...] }
    return Response.json({ orders });

  } catch (err) {
    console.error("❌ MY-ORDERS ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}