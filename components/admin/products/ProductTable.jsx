// components/admin/products/ProductTable.jsx
import ProductTableRow from "./ProductTableRow";

export default function ProductTable({ products, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Image</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">SKU</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stock</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <ProductTableRow key={product._id} product={product} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}