import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// ✅ GET SINGLE ORDER
export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = context.params;

    const order = await Order.findById(id).populate("items.product");

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

// 🔄 UPDATE STATUS (WITH CANCEL PROTECTION)
export async function PUT(req, context) {
  try {
    await connectDB();

    const { id } = context.params;
    const { status } = await req.json();

    const existing = await Order.findById(id);

    if (!existing) {
      return Response.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // ❌ Prevent cancel after shipped/delivered
    if (
      existing.status === "shipped" ||
      existing.status === "delivered"
    ) {
      return Response.json(
        { error: "Cannot cancel after shipping" },
        { status: 400 }
      );
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // ✅ better than returnDocument in mongoose
    );

    return Response.json(updated);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}