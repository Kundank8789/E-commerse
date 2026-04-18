import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";

// ✅ GET ALL PRODUCTS
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .populate("category") // ✅ correct
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

// ✅ CREATE PRODUCT (WITH CATEGORY)
export async function POST(req) {
  try {
    await connectDB();

    const { name, price, images, description, category } = await req.json();

    // 🔥 validation
    if (!name || !price || !images || images.length === 0 || !category) {
      return NextResponse.json(
        { error: "All fields including category are required" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      price,
      images,
      description,
      category, // ✅ IMPORTANT
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}