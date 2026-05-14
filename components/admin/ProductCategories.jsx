export default function ProductCategories({ categories, selectedCategories, onCategoryChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Categories</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map(cat => (
          <label key={cat._id} className="inline-flex items-center text-gray-700">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat._id)}
              onChange={() => onCategoryChange(cat._id)}
              className="mr-1"
            />
            {cat.name}
          </label>
        ))}
      </div>
    </div>
  );
}