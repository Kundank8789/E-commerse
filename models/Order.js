import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
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
  status: {
    type: String,
    default: "Pending",
  },
  address: {
  phone: String,
  city: String,
  state: String, // ✅ NEW
  pincode: String,
  addressLine: String,
},
}, { timestamps: true });

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);