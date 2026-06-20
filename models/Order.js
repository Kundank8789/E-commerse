import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      sparse: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        productName: { type: String },
        productPrice: { type: Number },
        productImage: { type: String },
        selectedSize: { type: String },
        selectedColor: { type: String },
        shippingCost: { type: Number, default: 0 },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    minOrderQuantity: { type: Number, default: 1 },
    maxOrderQuantity: { type: Number, default: 5 },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "rto"],
      default: "pending",
    },

    address: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      addressLine: { type: String, required: true },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },

    notes: { type: String, default: "" },
    trackingNumber: { type: String, default: "" },
    trackingUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ async hook — no next parameter, no next() call
OrderSchema.pre('save', async function () {
  if (!this.orderId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000);
    this.orderId = `ORD-${timestamp}-${random}`;
  }

  if (this.subtotal !== undefined && this.subtotal !== null) {
    this.total = this.subtotal + (this.shippingCost || 0);
  }
});

// ✅ Virtuals
OrderSchema.virtual('discount').get(function () {
  return this.subtotal && this.total ? this.subtotal - this.total : 0;
});

OrderSchema.virtual('itemCount').get(function () {
  return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
});

OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

// ✅ Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderId: 1 }, { unique: true, sparse: true });

// ✅ Ensure model is registered only once
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;