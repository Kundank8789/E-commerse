import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

// GET categories
export async function GET() {
  await connectDB();
  const categories = await Category.find();
  return Response.json(categories);
}

// ADD category
export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const category = await Category.create(body);

  return Response.json(category);
}