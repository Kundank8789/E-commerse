// components/admin/products/ProductFilters.jsx
export default function ProductFilters({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sort,
  onSortChange 
}) {
  const statusOptions = [
    { value: 'all', label: 'All', icon: '📊' },
    { value: 'active', label: 'Active', icon: '🟢' },
    { value: 'draft', label: 'Draft', icon: '📝' },
    { value: 'archived', label: 'Archived', icon: '📦' },
  ];

  const getStatusCount = (status) => {
    // This should be passed from parent or calculated
    return 0;
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="default">Sort By: Default</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {statusOptions.map((status) => (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-200 flex items-center gap-1 ${
              selectedStatus === status.value 
                ? status.value === 'active' ? "bg-green-600 text-white"
                  : status.value === 'draft' ? "bg-yellow-600 text-white"
                  : status.value === 'archived' ? "bg-gray-600 text-white"
                  : "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status.icon} {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}