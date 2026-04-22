import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category"; // ✅ ADD THIS LINE

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .populate("categories")
      .sort({ createdAt: -1 });

    return NextResponse.json(products);

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: "Name and price required" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      ...body,
      images: body.images || [],
      categories: body.categories || [],
    });

    return NextResponse.json({ success: true, product });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}