import mongoose from "mongoose";

const VariationSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
}, { _id: false });

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    sku: { type: String, unique: true, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    mrp: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    lowStockWarning: { type: Number, default: 10 },
    minOrderQuantity: { type: Number, default: 1 },
    maxOrderQuantity: { type: Number, default: 5 },
    status: { 
      type: String, 
      enum: ['active', 'draft', 'archived'],
      default: 'active'
    },
    weight: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
    breadth: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    variations: [VariationSchema],
    images: [{ type: String }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ IMPORTANT: Register the model
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;