export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Size Guide</h1>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <p className="text-gray-600 text-center mb-8">
          At NIWLE, we want you to find the perfect fit for your style and comfort.
        </p>

        <div className="space-y-8">
          {/* Clothing Size Guide */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Clothing Size Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Chest (inches)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Waist (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2">S</td><td className="border border-gray-300 px-4 py-2">36-38</td><td className="border border-gray-300 px-4 py-2">30-32</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">M</td><td className="border border-gray-300 px-4 py-2">38-40</td><td className="border border-gray-300 px-4 py-2">32-34</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">L</td><td className="border border-gray-300 px-4 py-2">40-42</td><td className="border border-gray-300 px-4 py-2">34-36</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">XL</td><td className="border border-gray-300 px-4 py-2">42-44</td><td className="border border-gray-300 px-4 py-2">36-38</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2">XXL</td><td className="border border-gray-300 px-4 py-2">44-46</td><td className="border border-gray-300 px-4 py-2">38-40</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Jewellery Size Guide</h2>
            <p className="text-gray-600">Rings, chains, and bracelets may vary slightly depending on the design.</p>
            <p className="text-gray-600 mt-2">Product-specific sizing details will be mentioned on each product page.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600">If you are unsure about your size, feel free to contact our support team before placing your order.</p>
            <p className="text-yellow-600 font-medium mt-2">Email: support@niwle.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}