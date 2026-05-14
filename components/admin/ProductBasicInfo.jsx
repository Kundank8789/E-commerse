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
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="slug"
          placeholder="Slug (auto-generated)"
          value={product.slug}
          onChange={handleChange}
          className="border p-2 rounded bg-gray-100 text-gray-600"
          readOnly
        />
        <input
          name="sku"
          placeholder="SKU * (e.g., PROD-001)"
          value={product.sku}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <select
          name="status"
          value={product.status}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        >
          <option value="active">🟢 Active</option>
          <option value="draft">📝 Draft</option>
          <option value="archived">📦 Archived</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-2 text-gray-800 bg-white"
          rows="3"
        />
      </div>
    </div>
  );
}