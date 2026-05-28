export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Return & Refund Policy</h1>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-600">At NIWLE, customer satisfaction is our priority. If you are not fully satisfied with your purchase, we're here to help.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Returns</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Products can be returned within 7 days of delivery.</li>
              <li>Items must be unused, undamaged, and in their original packaging.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Non-Returnable Items</h3>
            <p className="text-gray-600">The following items are not eligible for return:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mt-1">
              <li>Used or damaged products</li>
              <li>Products without original packaging</li>
              <li>Customized or personal items</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Refund Process</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Once your return is received and inspected, we will notify you about the approval status.</li>
              <li>Approved refunds will be processed within 5–7 business days to the original payment method.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Exchange</h3>
            <p className="text-gray-600">Exchanges are available only for damaged, defective, or wrong products received.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Damaged or Incorrect Products</h3>
            <p className="text-gray-600">If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with product photos & packaging video.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cancellation</h3>
            <p className="text-gray-600">Orders can only be cancelled before they are shipped.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Us</h3>
            <p className="text-gray-600">For any return or refund related queries, contact us at:</p>
            <p className="text-yellow-600 font-medium mt-1">support@niwle.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}