export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shipping Policy</h1>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Thank you for shopping with NIWLE.</h2>
            <p className="text-gray-600">We aim to deliver your orders safely and on time.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Processing</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Orders are usually processed within 1–3 business days.</li>
              <li>Orders are not processed on Sundays or public holidays.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery Time</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Estimated delivery time: 4–8 business days depending on your location.</li>
              <li>Delivery time may vary during sales, festivals, or unexpected situations.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Shipping Charges</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Free shipping may be available on selected orders or offers.</li>
              <li>Shipping charges (if applicable) will be shown at checkout.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Tracking</h3>
            <p className="text-gray-600">Once your order is shipped, you will receive tracking details by email or SMS.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delayed Orders</h3>
            <p className="text-gray-600">In rare cases, delivery may be delayed due to courier issues, weather conditions, or high order volume.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Incorrect Address</h3>
            <p className="text-gray-600">Please make sure your shipping address and phone number are correct while placing the order. NIWLE is not responsible for delays caused by incorrect information.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Us</h3>
            <p className="text-gray-600">If you have any questions regarding shipping, feel free to contact us at:</p>
            {/* ✅ FIXED: Email is now clickable */}
            <a 
              href="mailto:supportniwle@gmail.com" 
              className="text-yellow-600 font-medium mt-1 hover:text-yellow-700 hover:underline transition inline-block"
            >
              supportniwle@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}