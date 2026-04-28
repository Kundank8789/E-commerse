import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PUT(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIX
    const { status } = await req.json();

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" } // ✅ replaces deprecated "new: true"
    );

    return Response.json(updated);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}