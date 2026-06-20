import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// 🔥 CREATE ORDER
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { 
      items, 
      subtotal, 
      shippingCost, 
      total, 
      address, 
      notes, 
      paymentMethod,
      paymentStatus 
    } = body;

    // ✅ Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!address?.phone || !address?.city || !address?.state || !address?.pincode || !address?.addressLine) {
      return NextResponse.json({ error: "Address is incomplete" }, { status: 400 });
    }

    // ✅ Validate stock and product limits before creating order
    let calculatedSubtotal = 0;
    let calculatedShippingCost = 0;
    const enrichedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.product}` },
          { status: 400 }
        );
      }
      
      // Check if enough stock
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
          { status: 400 }
        );
      }
      
      // Check min/max quantity limits
      const minQty = product.minOrderQuantity || 1;
      const maxQty = Math.min(product.maxOrderQuantity || 5, product.stock || 0);
      if (item.quantity < minQty) {
        return NextResponse.json(
          { error: `Minimum ${minQty} unit required for ${product.name}` },
          { status: 400 }
        );
      }
      if (item.quantity > maxQty) {
        return NextResponse.json(
          { error: `Maximum ${maxQty} units allowed for ${product.name}` },
          { status: 400 }
        );
      }

      // ✅ Calculate subtotal
      const itemPrice = product.price || 0;
      const itemTotal = itemPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      // ✅ Track shipping cost
      const itemShipping = product.shippingCost || 0;
      if (itemShipping > calculatedShippingCost) {
        calculatedShippingCost = itemShipping;
      }

      // ✅ Enrich item with product details
      enrichedItems.push({
        product: product._id,
        quantity: item.quantity,
        productName: product.name,
        productPrice: itemPrice,
        productImage: product.images?.[0] || '',
        selectedSize: item.selectedSize || '',
        selectedColor: item.selectedColor || '',
        shippingCost: itemShipping,
      });
    }

    // ✅ Use provided totals or calculated ones
    const finalSubtotal = subtotal !== undefined ? subtotal : calculatedSubtotal;
    const finalShippingCost = shippingCost !== undefined ? shippingCost : calculatedShippingCost;
    const finalTotal = total !== undefined ? total : (finalSubtotal + finalShippingCost);

    // ✅ Create order with all fields
    const order = await Order.create({
      items: enrichedItems,
      subtotal: finalSubtotal,
      shippingCost: finalShippingCost,
      total: finalTotal,
      address: {
        name: address.name || '',
        phone: address.phone,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        addressLine: address.addressLine,
      },
      user: decoded.id,
      status: "pending",
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentStatus || "pending",
      notes: notes || "",
    });

    // ✅ Reduce stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // ✅ Populate the order before returning
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name images price");

    return NextResponse.json(populatedOrder, { status: 201 });

  } catch (err) {
    console.error("❌ POST ORDER ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🔥 GET ORDERS (Admin)
export async function GET(req) {
  try {
    await connectDB();
    
    // ✅ Get query parameters for filtering
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const userId = url.searchParams.get("userId");
    const limit = parseInt(url.searchParams.get("limit")) || 100;
    
    // ✅ Build filter
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })
      .limit(limit);

    // ✅ Get order statistics
    const stats = {
      total: await Order.countDocuments(),
      pending: await Order.countDocuments({ status: "pending" }),
      confirmed: await Order.countDocuments({ status: "confirmed" }),
      shipped: await Order.countDocuments({ status: "shipped" }),
      delivered: await Order.countDocuments({ status: "delivered" }),
      cancelled: await Order.countDocuments({ status: "cancelled" }),
    };

    return NextResponse.json({ 
      success: true, 
      orders,
      stats,
      count: orders.length 
    });

  } catch (err) {
    console.error("❌ GET ORDERS ERROR:", err);
    return NextResponse.json({ 
      error: err.message, 
      orders: [] 
    }, { status: 500 });
  }
}

// 🔥 GET USER ORDERS
export async function getMyOrders(req) {
  try {
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const orders = await Order.find({ user: decoded.id })
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });

  } catch (err) {
    console.error("❌ GET USER ORDERS ERROR:", err);
    return NextResponse.json({ error: err.message, orders: [] }, { status: 500 });
  }
}