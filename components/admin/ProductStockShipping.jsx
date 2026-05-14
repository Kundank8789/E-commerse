export default function ProductStockShipping({ product, handleChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Stock & Shipping</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="stock"
          type="number"
          placeholder="Stock Quantity"
          value={product.stock}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="lowStockThreshold"
          type="number"
          placeholder="Low Stock Alert (e.g., 10)"
          value={product.lowStockThreshold}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="shippingCost"
          type="number"
          step="0.01"
          placeholder="Shipping Cost"
          value={product.shippingCost}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="minOrderQuantity"
          type="number"
          placeholder="Min per Order"
          value={product.minOrderQuantity}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="maxOrderQuantity"
          type="number"
          placeholder="Max per Order"
          value={product.maxOrderQuantity}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="colors"
          placeholder="Colors (Red, Blue, Black)"
          value={product.colors}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="sizes"
          placeholder="Sizes (S, M, L, XL)"
          value={product.sizes}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
      </div>
    </div>
  );
}