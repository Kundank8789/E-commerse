export default function OrderSummary({
  cart, 
  subtotal, 
  shippingCost, 
  total, 
  customerName, 
  customerPhone, 
  email,
  placing, 
  onPlaceOrder
}) {
  // Generate unique key for each cart item
  const getItemKey = (item, index) => {
    if (item.cartId) return item.cartId;
    const variationKey = item.selectedSize || item.selectedColor || '';
    return `${item._id}-${variationKey}-${index}`;
  };

  return (
    <div className="bg-white border border-gray-200 shadow-xl rounded-2xl md:rounded-3xl p-4 md:p-6 sticky top-20 md:top-24">
      <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Order Summary</h2>

      {/* Cart Items with shipping info */}
      <div className="space-y-3 md:space-y-4 max-h-48 md:max-h-60 overflow-y-auto pr-1 md:pr-2">
        {cart.map((item, index) => {
          const itemShipping = item.shippingCost || 0;
          const itemTotal = item.price * item.quantity;
          
          // ✅ Get variation details
          const variationParts = [];
          if (item.selectedSize) variationParts.push(`Size: ${item.selectedSize}`);
          if (item.selectedColor) variationParts.push(`Color: ${item.selectedColor}`);
          const variationText = variationParts.join(' | ');
          
          return (
            <div key={getItemKey(item, index)} className="border-b border-gray-100 pb-3 md:pb-4 last:border-0">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black text-sm md:text-base line-clamp-1">
                    {item.name}
                  </p>
                  
                  {/* ✅ SHOW VARIATION DETAILS */}
                  {variationText && (
                    <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 bg-gray-50 px-1.5 md:px-2 py-0.5 rounded inline-block">
                      {variationText}
                    </p>
                  )}
                  
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] md:text-xs text-gray-400">Shipping:</span>
                    <span className={`text-[10px] md:text-xs font-medium ${itemShipping > 0 ? 'text-gray-700' : 'text-green-600'}`}>
                      {itemShipping > 0 ? `₹${itemShipping}` : 'FREE'}
                    </span>
                  </div>
                </div>
                <p className="font-semibold text-black text-sm md:text-base flex-shrink-0">
                  ₹{itemTotal}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Breakdown */}
      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200 space-y-1.5 md:space-y-2">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-xs md:text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-black">₹{subtotal?.toFixed(2) || 0}</span>
        </div>

        {/* Shipping Cost */}
        <div className="flex justify-between items-center text-xs md:text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="text-[10px] md:text-xs text-gray-400 text-right">
            * Based on highest shipping cost: 
            {cart.filter(item => (item.shippingCost || 0) > 0).length > 0 && (
              <span className="font-medium">
                {cart.find(item => (item.shippingCost || 0) === Math.max(...cart.map(i => i.shippingCost || 0)))?.name}
              </span>
            )}
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-2 md:pt-3 border-t border-gray-200">
          <span className="text-base md:text-lg font-semibold">Total</span>
          <span className="text-xl md:text-2xl font-bold text-black">₹{total?.toFixed(2) || 0}</span>
        </div>
      </div>

      {/* Customer summary */}
      {customerName && customerPhone && (
        <div className="mt-3 md:mt-4 p-2.5 md:p-3 bg-gray-50 rounded-xl md:rounded-2xl text-xs md:text-sm text-gray-600 space-y-0.5 md:space-y-1">
          <p>👤 <span className="font-medium text-black">{customerName}</span></p>
          <p>📱 <span className="font-medium text-black">{customerPhone}</span></p>
          {email && <p>✉️ <span className="font-medium text-black">{email}</span></p>}
        </div>
      )}

      {/* ✅ Only Online Payment - No COD */}
      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-xs md:text-sm text-black">💳 Secure Online Payment</p>
            <p className="text-[10px] md:text-xs text-gray-500">UPI, Cards, NetBanking via Razorpay</p>
            <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-0.5">
              <span className="text-[10px] md:text-xs text-green-600">✓ 100% Secure</span>
              <span className="text-[10px] md:text-xs text-gray-300">|</span>
              <span className="text-[10px] md:text-xs text-green-600">✓ Instant Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Updated Place Order Button - Only Pay Now */}
      <button
        onClick={onPlaceOrder}
        disabled={placing}
        className="w-full mt-4 md:mt-6 bg-black text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold
        hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm md:text-base"
      >
        {placing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pay ₹{total?.toFixed(2) || 0} 💳
          </span>
        )}
      </button>

      {/* ✅ Trust Badges */}
      <div className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[10px] md:text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Secure Checkout
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Encrypted Payment
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Quick Delivery
        </span>
      </div>
    </div>
  );
}