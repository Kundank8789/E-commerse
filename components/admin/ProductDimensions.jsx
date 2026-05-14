export default function ProductDimensions({ product, handleChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Dimensions</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="weight"
          type="number"
          step="0.01"
          placeholder="Weight (kg)"
          value={product.weight}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="length"
          type="number"
          placeholder="Length (cm)"
          value={product.length}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="breadth"
          type="number"
          placeholder="Breadth (cm)"
          value={product.breadth}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="height"
          type="number"
          placeholder="Height (cm)"
          value={product.height}
          onChange={handleChange}
          className="border p-2 rounded text-gray-800 bg-white"
        />
      </div>
    </div>
  );
}