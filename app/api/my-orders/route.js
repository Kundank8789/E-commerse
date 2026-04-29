import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return Response.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const orders = await Order.find({ user: decoded.id }) // 🔥 FILTER
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