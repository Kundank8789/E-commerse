import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],
    total: Number,

    // ✅ SINGLE STATUS FIELD (FIXED)
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
    },

    address: {
      phone: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      addressLine: { type: String, required: true },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 🔥 IMPORTANT for /my-orders
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);