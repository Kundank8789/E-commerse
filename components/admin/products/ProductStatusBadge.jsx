// components/admin/products/ProductStatusBadge.jsx
export default function ProductStatusBadge({ status }) {
  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: '🟢' },
    draft: { label: 'Draft', color: 'bg-yellow-100 text-yellow-800', icon: '📝' },
    archived: { label: 'Archived', color: 'bg-gray-100 text-gray-800', icon: '📦' },
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
}