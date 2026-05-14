// components/admin/products/ProductTableRow.jsx
import Image from "next/image";
import Link from "next/link";
import ProductStatusBadge from "./ProductStatusBadge";
import ProductStockBadge from "./ProductStockBadge";

export default function ProductTableRow({ product, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      {/* Image */}
      <td className="px-4 py-3">
        <div className="relative w-12 h-12">
          {product.images?.filter(img => img?.startsWith("http"))[0] ? (
            <Image
              src={product.images.find(img => img?.startsWith("http"))}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
              No img
            </div>
          )}
        </div>
      </td>

      {/* Name */}
      <td className="px-4 py-3">
        <div className="font-medium text-gray-800">{product.name}</div>
        {product.description && (
          <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
            {product.description.substring(0, 50)}...
          </div>
        )}
      </td>

      {/* SKU */}
      <td className="px-4 py-3">
        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {product.sku || 'N/A'}
        </span>
      </td>

      {/* Price */}
      <td className="px-4 py-3">
        <div className="font-semibold text-gray-800">₹{product.price}</div>
        {product.mrp && product.mrp > product.price && (
          <div className="text-xs text-gray-400 line-through">₹{product.mrp}</div>
        )}
      </td>

      {/* Stock */}
      <td className="px-4 py-3">
        <ProductStockBadge stock={product.stock} threshold={product.lowStockThreshold || 10} />
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <ProductStatusBadge status={product.status} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Link href={`/admin/products/edit/${product._id}`}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition duration-150 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition duration-150 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}