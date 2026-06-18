export default function ProductBasicInfo({ product, handleChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Product Name *"
          value={product.name}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          required
        />
        <input
          name="slug"
          placeholder="Slug (auto-generated)"
          value={product.slug}
          onChange={handleChange}
          className="border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
          readOnly
        />
        <input
          name="sku"
          placeholder="SKU * (e.g., PROD-001)"
          value={product.sku}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          required
        />
        
        {/* ✅ Status with description */}
        <div>
          <select
            name="status"
            value={product.status}
            onChange={handleChange}
            className="w-full border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          >
            <option value="active">🟢 Active - Visible on store</option>
            <option value="draft">📝 Draft - Hidden from customers</option>
            <option value="archived">📦 Archived - Saved but hidden</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            {product.status === 'active' && '✅ Product will be visible to customers'}
            {product.status === 'draft' && '⏳ Product is saved as draft (not visible to customers)'}
            {product.status === 'archived' && '📦 Product is archived (hidden from customers)'}
          </p>
        </div>
        
        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-2 text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          rows="4"
        />
        <p className="text-xs text-gray-400 col-span-2 -mt-2">
          💡 Add bullet points with • or - for better formatting
        </p>
      </div>
    </div>
  );
}