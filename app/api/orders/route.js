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
    const { items, subtotal, shippingCost, total, address, notes, paymentMethod } = body;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!address?.phone || !address?.city || !address?.state || !address?.pincode || !address?.addressLine) {
      return NextResponse.json({ error: "Address is incomplete" }, { status: 400 });
    }

    // ✅ Validate stock before creating order
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
    }

    // ✅ Calculate shipping cost if not provided
    const calculatedShippingCost = shippingCost !== undefined ? shippingCost : 0;
    const calculatedSubtotal = subtotal || total || 0;
    const calculatedTotal = (calculatedSubtotal + calculatedShippingCost);

    // ✅ Create order with all fields
    const order = await Order.create({
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        productName: item.productName || '',
        productPrice: item.productPrice || 0,
        productImage: item.productImage || '',
        selectedSize: item.selectedSize || '',
        selectedColor: item.selectedColor || '',
      })),
      subtotal: calculatedSubtotal,
      shippingCost: calculatedShippingCost,
      total: calculatedTotal,
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
      paymentStatus: "pending",
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
    console.error("POST ORDER ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🔥 GET ORDERS
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(orders);

  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    return NextResponse.json({ error: err.message, orders: [] }, { status: 500 });
  }
}