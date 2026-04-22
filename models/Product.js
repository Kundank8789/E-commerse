import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    // 💰 Pricing
    price: {
      type: Number,
      required: true,
    },

    mrp: {
      type: Number, // original price
    },

    tax: {
      type: Number, // percentage
      default: 0,
    },

    // 🖼️ Images
    images: [String],

    // 📦 Categories (MULTIPLE)
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // 🎨 Variants
    colors: [String],
    sizes: [String],

    // 📏 Dimensions
    weight: Number,
    length: Number,
    breadth: Number,
    height: Number,

    // 📦 Stock
    stock: {
      type: Number,
      default: 0,
    },

    // 🚨 Low stock alert
    lowStockThreshold: {
      type: Number,
      default: 20,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);