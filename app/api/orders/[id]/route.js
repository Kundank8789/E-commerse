import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// ✅ GET SINGLE ORDER (VERY IMPORTANT)
export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const order = await Order.findById(id)
      .populate("items.product");

    if (!order) {
      return Response.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json(order);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// 🔄 UPDATE STATUS
export async function PUT(req, context) {
  try {
    await connectDB();

    const { id } =  await context.params;
    const { status } = await req.json();

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" }
    );

    return Response.json(updated);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}