import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// GET products
export async function GET() {
  await connectDB();
  const products = await Product.find();
  return Response.json(products);
}

// POST product
export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const product = await Product.create(body);

  return Response.json(product);
}