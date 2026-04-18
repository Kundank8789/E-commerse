import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

// DELETE category
export async function DELETE(req, context) {
  await connectDB();

  const { id } = await context.params; // ✅ FIX HERE

  await Category.findByIdAndDelete(id);

  return Response.json({ success: true });
}