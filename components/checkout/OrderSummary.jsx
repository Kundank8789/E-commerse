export default function OrderSummary({
  cart, 
  subtotal, 
  shippingCost, 
  total, 
  customerName, 
  customerPhone, 
  email,
  paymentMethod, 
  setPaymentMethod, 
  placing, 
  onPlaceOrder
}) {
  return (
    <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

      {/* Cart Items with shipping info */}
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {cart.map((item) => {
          const itemShipping = item.shippingCost || 0;
          const itemTotal = item.price * item.quantity;
          
          return (
            <div key={item._id} className="border-b border-gray-100 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-black">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  {/* ✅ Show shipping per product */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-400">Shipping:</span>
                    <span className={`text-xs font-medium ${itemShipping > 0 ? 'text-gray-700' : 'text-green-600'}`}>
                      {itemShipping > 0 ? `₹${itemShipping}` : 'FREE'}
                    </span>
                  </div>
                </div>
                <p className="font-semibold text-black">₹{itemTotal}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Breakdown */}
      <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-black">₹{subtotal?.toFixed(2) || 0}</span>
        </div>

        {/* ✅ Shipping Cost - Always show */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Shipping
          </span>
          <span className={`font-medium ${shippingCost > 0 ? 'text-black' : 'text-green-600'}`}>
            {shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : 'FREE 🎉'}
          </span>
        </div>

        {/* Show which product has the highest shipping */}
        {shippingCost > 0 && cart.length > 0 && (
          <div className="text-xs text-gray-400 text-right">
            * Based on highest shipping cost: 
            {cart.filter(item => (item.shippingCost || 0) > 0).length > 0 && (
              <span className="font-medium">
                {cart.find(item => (item.shippingCost || 0) === Math.max(...cart.map(i => i.shippingCost || 0)))?.name}
              </span>
            )}
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-black">₹{total?.toFixed(2) || 0}</span>
        </div>
      </div>

      {/* Customer summary */}
      {customerName && customerPhone && (
        <div className="mt-4 p-3 bg-gray-50 rounded-2xl text-sm text-gray-600 space-y-1">
          <p>👤 <span className="font-medium text-black">{customerName}</span></p>
          <p>📱 <span className="font-medium text-black">{customerPhone}</span></p>
          {email && <p>✉️ <span className="font-medium text-black">{email}</span></p>}
        </div>
      )}

      {/* Payment Method */}
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
        {placing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : paymentMethod === "cod" ? (
          "Place Order 🛍️"
        ) : (
          `Pay ₹${total?.toFixed(2) || 0} 💳`
        )}
      </button>

    </div>
  );
}