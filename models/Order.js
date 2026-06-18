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
        // ✅ Store product details at time of order
        productName: { type: String },
        productPrice: { type: Number },
        productImage: { type: String },
        selectedSize: { type: String },
        selectedColor: { type: String },
      },
    ],
    
    // ✅ Pricing breakdown
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    
    // ✅ Order limits tracking
    minOrderQuantity: { type: Number, default: 1 },
    maxOrderQuantity: { type: Number, default: 5 },

    // 🔥 UPDATED STATUS ENUM
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "rto"],
      default: "pending",
    },

    address: {
      name: { type: String },
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
    
    // ✅ Order notes
    notes: { type: String, default: "" },
    
    // ✅ Tracking information
    trackingNumber: { type: String, default: "" },
    trackingUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Pre-save middleware to calculate total if not provided
OrderSchema.pre('save', function(next) {
  if (!this.total && this.subtotal !== undefined) {
    this.total = this.subtotal + (this.shippingCost || 0);
  }
  next();
});

// ✅ Virtual for discount calculation (if needed later)
OrderSchema.virtual('discount').get(function() {
  return this.subtotal && this.total ? this.subtotal - this.total : 0;
});

// ✅ Ensure virtuals are included in JSON
OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

// ✅ Indexes for better performance
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);