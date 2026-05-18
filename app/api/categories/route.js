import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    console.log("Received body:", body);

    if (!body.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Generate slug manually
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${body.name}$`, 'i') } 
    });
    
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    // Create category - include ALL fields
    const categoryData = {
      name: body.name,
      slug: slug,
      icon: body.icon || "📦",
      image: body.image || "",
      description: body.description || "",
      isActive: true,
    };

    console.log("Creating category with:", categoryData);

    const category = await Category.create(categoryData);

    console.log("Category created:", category);

    return NextResponse.json({ success: true, category }, { status: 201 });

  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}