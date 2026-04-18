import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: String,
}, { timestamps: true });

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);