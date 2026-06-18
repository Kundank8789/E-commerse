export default function ProductStockShipping({ product, handleChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Stock & Shipping</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
          <input
            name="stock"
            type="number"
            placeholder="Stock Quantity"
            value={product.stock || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            min="0"
          />
        </div>
        
        {/* Low Stock Alert */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Low Stock Alert <span className="text-xs text-gray-400">(Threshold)</span>
          </label>
          <input
            name="lowStockThreshold"
            type="number"
            placeholder="Low Stock Alert (e.g., 10)"
            value={product.lowStockThreshold || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            min="0"
          />
          {product.stock > 0 && product.stock <= product.lowStockThreshold && (
            <p className="text-xs text-orange-500 mt-1">⚠️ Stock is low (below {product.lowStockThreshold})</p>
          )}
        </div>
        
        {/* Shipping Cost */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shipping Cost <span className="text-xs text-gray-400">(₹0 = Free Shipping)</span>
          </label>
          <input
            name="shippingCost"
            type="number"
            step="0.01"
            placeholder="Shipping Cost (e.g., 50)"
            value={product.shippingCost || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            min="0"
          />
          <p className="text-xs text-gray-400 mt-1">
            {Number(product.shippingCost) === 0 
              ? '✅ Free shipping for this product' 
              : `📦 Shipping charge: ₹${product.shippingCost} will be added at checkout`}
          </p>
        </div>
        
        {/* Min & Max Order Quantity */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Quantity Limits
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="minOrderQuantity"
                type="number"
                placeholder="Min Quantity (default: 1)"
                value={product.minOrderQuantity || 1}
                onChange={handleChange}
                className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                min="1"
              />
              <p className="text-xs text-gray-400 mt-1">Minimum quantity per order</p>
            </div>
            <div>
              <input
                name="maxOrderQuantity"
                type="number"
                placeholder="Max Quantity (default: 5)"
                value={product.maxOrderQuantity || 5}
                onChange={handleChange}
                className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                min="1"
              />
              <p className="text-xs text-gray-400 mt-1">Maximum quantity per order</p>
            </div>
          </div>
          {parseInt(product.minOrderQuantity) > parseInt(product.maxOrderQuantity) && (
            <p className="text-red-500 text-xs mt-1">
              ⚠️ Minimum quantity cannot be greater than maximum quantity
            </p>
          )}
          {parseInt(product.stock) > 0 && parseInt(product.maxOrderQuantity) > parseInt(product.stock) && (
            <p className="text-orange-500 text-xs mt-1">
              ⚠️ Maximum quantity ({product.maxOrderQuantity}) exceeds available stock ({product.stock})
            </p>
          )}
        </div>
        
        {/* Colors & Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
          <input
            name="colors"
            placeholder="Red, Blue, Black"
            value={product.colors || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
          <input
            name="sizes"
            placeholder="S, M, L, XL"
            value={product.sizes || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
        </div>
      </div>
    </div>
  );
}