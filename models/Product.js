import mongoose from "mongoose";

const VariationSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
}, { _id: false });

const ProductSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    sku: { type: String, unique: true, required: true },
    description: { type: String, default: "" },
    
    // Pricing
    price: { type: Number, required: true },
    mrp: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    
    // Stock Management
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    lowStockWarning: { type: Number, default: 10 },
    
    // Order Limits
    minOrderQuantity: { type: Number, default: 1 },
    maxOrderQuantity: { type: Number, default: 5 },
    
    // Status
    status: { 
      type: String, 
      enum: ['active', 'draft', 'archived'],
      default: 'active'
    },
    
    // Dimensions
    weight: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
    breadth: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    
    // Attributes
    colors: [{ type: String }],
    sizes: [{ type: String }],
    variations: [VariationSchema],
    
    // Media & Categories
    images: [{ type: String }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    
    // Legacy
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// NO MIDDLEWARE HERE - We'll handle slug/SKU generation in the API

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);