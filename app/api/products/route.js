import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category";

// Helper function to generate unique slug
async function generateUniqueSlug(name, existingId = null) {
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

    // Generate slug (either from provided or auto-generate)
    let slug = body.slug;
    if (!slug) {
      slug = await generateUniqueSlug(body.name);
    } else {
      // Check if provided slug is unique
      const existingSlug = await Product.findOne({ slug });
      if (existingSlug) {
        return NextResponse.json(
          { error: "Slug already exists. Please use a different slug." },
          { status: 400 }
        );
      }
    }

    // Generate SKU (either from provided or auto-generate)
    let sku = body.sku;
    if (!sku) {
      sku = generateSKU();
    } else {
      sku = sku.toUpperCase();
      // Check if provided SKU is unique
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return NextResponse.json(
          { error: "SKU already exists. Please use a different SKU." },
          { status: 400 }
        );
      }
    }

    // Prepare product data
    const productData = {
      name: body.name,
      slug: slug,
      sku: sku,
      description: body.description || "",
      price: Number(body.price),
      mrp: body.mrp ? Number(body.mrp) : 0,
      tax: Number(body.tax) || 0,
      stock: Number(body.stock) || 0,
      lowStockThreshold: Number(body.lowStockThreshold) || 10,
      lowStockWarning: Number(body.lowStockWarning) || 10,
      shippingCost: Number(body.shippingCost) || 0,
      minOrderQuantity: Number(body.minOrderQuantity) || 1,
      maxOrderQuantity: Number(body.maxOrderQuantity) || 5,
      status: body.status || "active",
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

    // Create product
    const product = await Product.create(productData);
    
    console.log("Product created successfully:", product._id);

    return NextResponse.json({ 
      success: true, 
      product: product 
    }, { status: 201 });

  } catch (err) {
    console.error("POST ERROR DETAILS:", err);
    
    // Handle duplicate key errors
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