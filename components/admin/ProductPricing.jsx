export default function ProductPricing({ product, handleChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Pricing</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price * <span className="text-xs text-gray-400">(Selling Price)</span>
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price *"
            value={product.price || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MRP <span className="text-xs text-gray-400">(Original Price)</span>
          </label>
          <input
            name="mrp"
            type="number"
            step="0.01"
            placeholder="MRP"
            value={product.mrp || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />
          {product.mrp && product.price && parseFloat(product.mrp) > parseFloat(product.price) && (
            <p className="text-xs text-green-600 mt-1">
              ✅ {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% discount
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax (%) <span className="text-xs text-gray-400">(GST)</span>
          </label>
          <input
            name="tax"
            type="number"
            step="0.01"
            placeholder="Tax (%)"
            value={product.tax || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}