import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  images: [String],
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  variants: [
    {
      color: String,
      sizes: [String],
    }
  ],
  seoTitle: String,
  seoDesc: String,
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);