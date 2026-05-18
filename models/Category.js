import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "📦",
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ⚠️ MAKE SURE THERE IS NO pre('save') FUNCTION HERE

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);