import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import "@/models/Product";
import "@/models/Category";

// Helper function to generate unique slug
async function generateUniqueSlug(name, existingId = null) {
  // ✅ Get Product model from mongoose
  const Product = mongoose.models.Product;
  
  if (!Product) {
    throw new Error("Product model not found");
  }
  
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug exists
  let existingProduct = await Product.findOne({ slug });
  while (existingProduct && (existingId ? existingProduct._id.toString() !== existingId : true)) {
    slug = `${baseSlug}-${counter}`;
    existingProduct = await Product.findOne({ slug });
    counter++;
  }
  
  return slug;
}

// Helper function to generate unique SKU
function generateSKU() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000);
  return `SKU-${timestamp}-${random}`;
}

// ✅ GET products - ONLY ACTIVE for public
export async function GET(req) {
  try {
    await connectDB();
    
    // ✅ Get Product model from mongoose
    const Product = mongoose.models.Product;
    
    if (!Product) {
      console.error("❌ Product model not found");
      console.log("Available models:", Object.keys(mongoose.models));
      return NextResponse.json(
        { error: "Product model not found" },
        { status: 500 }
      );
    }
    
    // Check if it's an admin request (optional)
    const url = new URL(req.url);
    const isAdmin = url.searchParams.get("admin") === "true";
    
    // ✅ Public: Only show active products
    // Admin: Show all products
    const query = isAdmin ? {} : { status: "active" };
    
    const products = await Product.find(query)
      .populate("categories")
      .sort({ createdAt: -1 });
    
    console.log(`📦 Public API: Returning ${products.length} products`);
    
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
    
    // ✅ Get Product model from mongoose
    const Product = mongoose.models.Product;
    
    if (!Product) {
      console.error("❌ Product model not found");
      return NextResponse.json(
        { error: "Product model not found" },
        { status: 500 }
      );
    }
    
    const body = await req.json();

    console.log("Received body:", body);

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }
    
    if (!body.price) {
      return NextResponse.json(
        { error: "Price is required" },
        { status: 400 }
      );
    }

    // Validate min/max quantity
    const minQty = Number(body.minOrderQuantity) || 1;
    const maxQty = Number(body.maxOrderQuantity) || 5;
    if (minQty > maxQty) {
      return NextResponse.json(
        { error: "Minimum quantity cannot be greater than maximum quantity" },
        { status: 400 }
      );
    }

    // Validate stock vs max quantity
    const stock = Number(body.stock) || 0;
    if (stock > 0 && maxQty > stock) {
      return NextResponse.json(
        { error: `Maximum order quantity (${maxQty}) cannot exceed available stock (${stock})` },
        { status: 400 }
      );
    }

    // Generate slug
    let slug = body.slug;
    if (!slug) {
      slug = await generateUniqueSlug(body.name);
    } else {
      const existingSlug = await Product.findOne({ slug });
      if (existingSlug) {
        return NextResponse.json(
          { error: "Slug already exists. Please use a different slug." },
          { status: 400 }
        );
      }
    }

    // Generate SKU
    let sku = body.sku;
    if (!sku) {
      sku = generateSKU();
    } else {
      sku = sku.toUpperCase();
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return NextResponse.json(
          { error: "SKU already exists. Please use a different SKU." },
          { status: 400 }
        );
      }
    }

    // ✅ Handle status - draft products won't show on frontend
    const status = body.status || "active";

    // Prepare product data
    const productData = {
      name: body.name,
      slug: slug,
      sku: sku,
      description: body.description || "",
      price: Number(body.price),
      mrp: body.mrp ? Number(body.mrp) : 0,
      tax: Number(body.tax) || 0,
      stock: stock,
      lowStockThreshold: Number(body.lowStockThreshold) || 10,
      lowStockWarning: Number(body.lowStockWarning) || 10,
      shippingCost: Number(body.shippingCost) || 0,
      minOrderQuantity: minQty,
      maxOrderQuantity: maxQty,
      status: status,
      weight: body.weight ? Number(body.weight) : 0,
      length: body.length ? Number(body.length) : 0,
      breadth: body.breadth ? Number(body.breadth) : 0,
      height: body.height ? Number(body.height) : 0,
      colors: Array.isArray(body.colors) ? body.colors : (body.colors ? body.colors.split(',').map(c => c.trim()) : []),
      sizes: Array.isArray(body.sizes) ? body.sizes : (body.sizes ? body.sizes.split(',').map(s => s.trim()) : []),
      variations: body.variations || [],
      images: body.images || [],
      categories: body.categories || [],
      isActive: true,
    };

    console.log("Creating product with:", productData);

    const product = await Product.create(productData);
    console.log("Product created successfully:", product._id);

    return NextResponse.json({ 
      success: true, 
      product: product 
    }, { status: 201 });

  } catch (err) {
    console.error("POST ERROR DETAILS:", err);
    
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists. Please use a unique ${field}.` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}