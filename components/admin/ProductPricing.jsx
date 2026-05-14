export default function ProductPricing({ product, handleChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Pricing</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price *"
          value={product.price}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="mrp"
          type="number"
          step="0.01"
          placeholder="MRP"
          value={product.mrp}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="tax"
          type="number"
          step="0.01"
          placeholder="Tax (%)"
          value={product.tax}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
      </div>
    </div>
  );
}