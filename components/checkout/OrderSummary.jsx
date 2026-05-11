export default function OrderSummary({
  cart, total, customerName, customerPhone, email,
  paymentMethod, setPaymentMethod, placing, onPlaceOrder
}) {
  return (
    <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item._id} className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <p className="font-medium text-black">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-black">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold text-black">₹{total}</span>
      </div>

      {/* Customer summary */}
      {customerName && customerPhone && (
        <div className="mt-4 p-3 bg-gray-50 rounded-2xl text-sm text-gray-600 space-y-1">
          <p>👤 <span className="font-medium text-black">{customerName}</span></p>
          <p>📱 <span className="font-medium text-black">{customerPhone}</span></p>
          <p>✉️ <span className="font-medium text-black">{email}</span></p>
        </div>
      )}

      {/* ✅ Payment Method */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Payment Method</p>
        <div className="space-y-3">

          <label className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition
            ${paymentMethod === "razorpay" ? "border-black bg-gray-50" : "border-gray-200"}`}>
            <input type="radio" name="payment" value="razorpay"
              checked={paymentMethod === "razorpay"}
              onChange={() => setPaymentMethod("razorpay")}
              className="accent-black" />
            <div>
              <p className="font-medium text-sm">💳 Pay Online</p>
              <p className="text-xs text-gray-500">UPI, Cards, NetBanking via Razorpay</p>
            </div>
          </label>

          <label className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition
            ${paymentMethod === "cod" ? "border-black bg-gray-50" : "border-gray-200"}`}>
            <input type="radio" name="payment" value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="accent-black" />
            <div>
              <p className="font-medium text-sm">💵 Cash on Delivery</p>
              <p className="text-xs text-gray-500">Pay when order arrives</p>
            </div>
          </label>

        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        disabled={placing}
        className="w-full mt-6 bg-black text-white py-4 rounded-2xl font-semibold
        hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {placing ? "Processing..." : paymentMethod === "cod" ? "Place Order 🛍️" : "Pay Now 💳"}
      </button>

    </div>
  );
}