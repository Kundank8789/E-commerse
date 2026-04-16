import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";

// ✅ GET ALL PRODUCTS
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ✅ CREATE PRODUCT (MULTIPLE IMAGES)
export async function POST(req) {
  try {
    await connectDB();

    const { name, price, images, description } = await req.json();

    // 🔥 validation
    if (!name || !price || !images || images.length === 0) {
      return NextResponse.json(
        { error: "All fields including images are required" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      price,
      images, // ✅ array
      description,
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