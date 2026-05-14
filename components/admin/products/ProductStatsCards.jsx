// components/admin/products/ProductStatsCards.jsx
export default function ProductStatsCards({ products }) {
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    draft: products.filter(p => p.status === 'draft').length,
    archived: products.filter(p => p.status === 'archived').length,
  };

  const cards = [
    { label: 'Total Products', value: stats.total, color: 'blue', icon: '📦' },
    { label: 'Active Products', value: stats.active, color: 'green', icon: '🟢' },
    { label: 'Draft Products', value: stats.draft, color: 'yellow', icon: '📝' },
    { label: 'Archived Products', value: stats.archived, color: 'gray', icon: '📦' },
  ];

  const colorClasses = {
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    yellow: 'border-l-yellow-500',
    gray: 'border-l-gray-500',
  };

  const valueColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    gray: 'text-gray-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className={`bg-white rounded-lg shadow p-4 border-l-4 ${colorClasses[card.color]}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{card.label}</div>
              <div className={`text-2xl font-bold ${valueColors[card.color]}`}>{card.value}</div>
            </div>
            <span className="text-2xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}