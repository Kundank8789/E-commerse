import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import "@/models/Product";
import "@/models/Category";

// ✅ GET single product - Admin can see any product
export async function GET(req, { params }) {
  try {
    console.log("🔍 Admin GET single product - Starting");
    
    // ✅ IMPORTANT: Await the params promise
    const { id } = await params;
    console.log("🔍 Looking for product with ID:", id);
    
    await connectDB();
    console.log("✅ Database connected");
    
    // ✅ Check if mongoose has the Product model
    const Product = mongoose.models.Product;
    console.log("📦 Product model available:", !!Product);
    console.log("📦 Available models:", Object.keys(mongoose.models));
    
    if (!Product) {
      console.error("❌ Product model not found");
      return NextResponse.json(
        { error: "Product model not found" },
        { status: 500 }
      );
    }
    
    // ✅ Try to find product by ID
    console.log("🔎 Executing findById...");
    const product = await Product.findById(id).populate("categories");
    console.log("📦 Product found:", product ? "Yes" : "No");
    
    if (product) {
      console.log("📦 Product details:", {
        id: product._id,
        name: product.name,
        status: product.status,
        hasCategories: !!product.categories
      });
    }
    
    if (!product) {
      // ✅ Check if any products exist in the database
      const count = await Product.countDocuments();
      console.log("📊 Total products in database:", count);
      
      // ✅ Get first few products to see what IDs look like
      const sampleProducts = await Product.find({}).limit(3).select('_id name status');
      console.log("📊 Sample products:", sampleProducts.map(p => ({
        id: p._id.toString(),
        name: p.name,
        status: p.status
      })));
      
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error("❌ GET PRODUCT ERROR:", error);
    console.error("❌ Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to fetch product: " + error.message },
      { status: 500 }
    );
  }
}

// ✅ UPDATE product
export async function PUT(req, { params }) {
  try {
    console.log("🔍 Admin PUT product - Starting");
    
    // ✅ IMPORTANT: Await the params promise
    const { id } = await params;
    console.log("📝 Updating product with ID:", id);
    
    await connectDB();
    const body = await req.json();
    console.log("📝 Update data:", body);
    
    // ✅ Get Product model from mongoose
    const Product = mongoose.models.Product;
    
    if (!Product) {
      console.error("❌ Product model not found");
      return NextResponse.json(
        { error: "Product model not found" },
        { status: 500 }
      );
    }
    
    // Find and update product
    const product = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate("categories");
    
    if (!product) {
      console.error("❌ Product not found with ID:", id);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    console.log("✅ Product updated successfully:", product._id);
    
    return NextResponse.json({ 
      success: true, 
      product: product 
    });
  } catch (error) {
    console.error("❌ UPDATE PRODUCT ERROR:", error);
    console.error("❌ Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to update product: " + error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE product
export async function DELETE(req, { params }) {
  try {
    console.log("🔍 Admin DELETE product - Starting");
    
    // ✅ IMPORTANT: Await the params promise
    const { id } = await params;
    console.log("🗑️ Deleting product with ID:", id);
    
    await connectDB();
    
    // ✅ Get Product model from mongoose
    const Product = mongoose.models.Product;
    
    if (!Product) {
      console.error("❌ Product model not found");
      return NextResponse.json(
        { error: "Product model not found" },
        { status: 500 }
      );
    }
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      console.error("❌ Product not found with ID:", id);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    console.log("✅ Product deleted successfully:", product._id);
    
    return NextResponse.json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("❌ DELETE PRODUCT ERROR:", error);
    console.error("❌ Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to delete product: " + error.message },
      { status: 500 }
    );
  }
}