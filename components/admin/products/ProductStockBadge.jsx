// components/admin/products/ProductStockBadge.jsx
export default function ProductStockBadge({ stock, threshold = 10 }) {
  const getStockConfig = () => {
    if (stock === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: '❌' };
    }
    if (stock < threshold) {
      return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800', icon: '⚠️' };
    }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: '✅' };
  };

  const config = getStockConfig();

  return (
    <div>
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon} {config.label}
      </span>
      <div className="text-xs text-gray-500 mt-1">{stock} units</div>
    </div>
  );
}