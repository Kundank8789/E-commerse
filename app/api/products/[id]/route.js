import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

// ✅ GET SINGLE PRODUCT - Only shows if active (or admin request)
export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    // Check if it's an admin request
    const url = new URL(req.url);
    const isAdmin = url.searchParams.get("admin") === "true";
    
    // Build query
    const query = { _id: id };
    if (!isAdmin) {
      query.status = "active"; // ✅ Only show active products to public
    }
    
    const product = await Product.findOne(query).populate("categories");

    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(product);
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// ✅ DELETE PRODUCT
export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Product deleted successfully ✅",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE PRODUCT (with Draft support)
export async function PUT(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!body.name || !body.price) {
      return Response.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    // Check if SKU is being changed and if it's unique
    if (body.sku && body.sku !== existingProduct.sku) {
      const skuExists = await Product.findOne({ 
        sku: body.sku.toUpperCase(), 
        _id: { $ne: id } 
      });
      if (skuExists) {
        return Response.json(
          { error: "SKU already exists. Please use a unique SKU." },
          { status: 400 }
        );
      }
    }

    // Handle slug (auto-generate if name changed and slug not provided)
    let slug = body.slug;
    if (!slug && body.name && body.name !== existingProduct.name) {
      slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Check if slug is unique
      let existingSlug = await Product.findOne({ slug, _id: { $ne: id } });
      let counter = 1;
      while (existingSlug) {
        slug = `${slug.split('-')[0]}-${counter}`;
        existingSlug = await Product.findOne({ slug, _id: { $ne: id } });
        counter++;
      }
    }

    // ✅ Validate min/max quantity
    const minQty = parseInt(body.minOrderQuantity) || 1;
    const maxQty = parseInt(body.maxOrderQuantity) || 5;
    if (minQty > maxQty) {
      return Response.json(
        { error: "Minimum quantity cannot be greater than maximum quantity" },
        { status: 400 }
      );
    }

    // ✅ Validate stock vs max quantity
    const stock = parseInt(body.stock) || 0;
    if (stock > 0 && maxQty > stock) {
      return Response.json(
        { error: `Maximum order quantity (${maxQty}) cannot exceed available stock (${stock})` },
        { status: 400 }
      );
    }

    // Prepare update data with all fields
    const updateData = {
      name: body.name,
      slug: slug || existingProduct.slug,
      sku: body.sku ? body.sku.toUpperCase() : existingProduct.sku,
      description: body.description || "",
      price: parseFloat(body.price),
      mrp: body.mrp ? parseFloat(body.mrp) : null,
      tax: parseFloat(body.tax) || 0,
      stock: stock,
      lowStockThreshold: parseInt(body.lowStockThreshold) || 10,
      lowStockWarning: parseInt(body.lowStockWarning) || 10,
      shippingCost: parseFloat(body.shippingCost) || 0,
      minOrderQuantity: minQty,
      maxOrderQuantity: maxQty,
      status: body.status || "active", // ✅ Draft/Active/Archived
      weight: body.weight ? parseFloat(body.weight) : null,
      length: body.length ? parseFloat(body.length) : null,
      breadth: body.breadth ? parseFloat(body.breadth) : null,
      height: body.height ? parseFloat(body.height) : null,
      colors: body.colors || [],
      sizes: body.sizes || [],
      variations: body.variations || [],
      images: body.images || [],
      categories: body.categories || [],
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate("categories");

    return Response.json({ 
      success: true, 
      product: updatedProduct 
    });

  } catch (error) {
    console.error("PUT ERROR:", error);
    return Response.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}