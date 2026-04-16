import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// ✅ GET SINGLE PRODUCT
export async function GET(req, { params }) {
  await connectDB();

  const { id } = params;

  const product = await Product.findById(id);

  if (!product) {
    return Response.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  return Response.json(product);
}

// ✅ DELETE PRODUCT
export async function DELETE(req,context) {
  await connectDB();

  const { id } = await context.params;

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return Response.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  return Response.json({
    message: "Product deleted successfully ✅",
  });
}

// ✅ UPDATE PRODUCT
export async function PUT(req, context) {
  await connectDB();

  const { id } = await context.params;
  const body = await req.json();

  const updatedProduct = await Product.findByIdAndUpdate(id, body, {
    new: true,
  });

  return Response.json(updatedProduct);
}