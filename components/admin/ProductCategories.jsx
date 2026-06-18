export default function ProductCategories({ categories, selectedCategories, onCategoryChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Categories</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map(cat => (
          <button
            key={cat._id}
            type="button"
            onClick={() => onCategoryChange(cat._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategories.includes(cat._id)
                ? 'bg-black text-white hover:bg-gray-800'  // Selected
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'  // Not selected
            }`}
          >
            {cat.name}
            {selectedCategories.includes(cat._id) && (
              <span className="ml-2 text-xs">✓</span>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">Click to select/deselect categories</p>
    </div>
  );
}