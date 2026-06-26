import { useState } from "react";

export default function ProductVariations({ product, onAddVariation, onRemoveVariation, onUpdateVariation }) {
  const [variationSize, setVariationSize] = useState("");
  const [variationColor, setVariationColor] = useState("");
  const [variationStock, setVariationStock] = useState("");
  const [variationPrice, setVariationPrice] = useState("");
  const [message, setMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const addVariation = () => {
    if (!variationSize || !variationColor) {
      setMessage("Please enter both size and color");
      return;
    }

    // Check if variation already exists (only when adding, not editing)
    if (editingIndex === null) {
      const exists = product.variations.some(
        v => v.size === variationSize && v.color === variationColor
      );
      if (exists) {
        setMessage("This size and color combination already exists");
        return;
      }
    }

    const variationData = {
      size: variationSize,
      color: variationColor,
      stock: parseInt(variationStock) || 0,
      price: parseFloat(variationPrice) || 0,
    };

    if (editingIndex !== null) {
      // ✅ Update existing variation
      onUpdateVariation(editingIndex, variationData);
      setEditingIndex(null);
    } else {
      // ✅ Add new variation
      onAddVariation(variationData);
    }

    setVariationSize("");
    setVariationColor("");
    setVariationStock("");
    setVariationPrice("");
    setMessage("");
  };

  const startEditing = (index) => {
    const variation = product.variations[index];
    setVariationSize(variation.size);
    setVariationColor(variation.color);
    setVariationStock(variation.stock.toString());
    setVariationPrice(variation.price ? variation.price.toString() : "");
    setEditingIndex(index);
    setMessage("");
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setVariationSize("");
    setVariationColor("");
    setVariationStock("");
    setVariationPrice("");
    setMessage("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Size & Color Variations</h2>
      
      {/* ✅ Add/Edit Form */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <input
          type="text"
          placeholder="Size (e.g., S, M, L)"
          value={variationSize}
          onChange={(e) => setVariationSize(e.target.value)}
          className="border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Color (e.g., Red, Blue)"
          value={variationColor}
          onChange={(e) => setVariationColor(e.target.value)}
          className="border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Stock"
          value={variationStock}
          onChange={(e) => setVariationStock(e.target.value)}
          className="border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          min="0"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price (optional)"
          value={variationPrice}
          onChange={(e) => setVariationPrice(e.target.value)}
          className="border p-2 rounded text-gray-800 bg-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          min="0"
        />
      </div>
      
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={addVariation}
          className={`px-4 py-2 rounded transition ${
            editingIndex !== null
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {editingIndex !== null ? "✅ Update Variation" : "+ Add Variation"}
        </button>
        {editingIndex !== null && (
          <button
            type="button"
            onClick={cancelEditing}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
      </div>

      {message && <p className="text-red-500 text-sm mb-2">{message}</p>}

      {/* ✅ Variations List */}
      {product.variations.length > 0 && (
        <div className="mt-3">
          <h3 className="font-medium mb-2 text-gray-700">
            Added Variations ({product.variations.length})
          </h3>
          {product.variations.map((v, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-50 p-3 mb-2 rounded border border-gray-200">
              <div className="grid grid-cols-4 gap-4 flex-1">
                <span className="text-gray-700 font-medium">Size: {v.size}</span>
                <span className="text-gray-700">Color: {v.color}</span>
                <span className="text-gray-700">Stock: {v.stock}</span>
                <span className="text-gray-700">
                  Price: {v.price ? `₹${v.price}` : 'Default'}
                </span>
              </div>
              <div className="flex gap-2 ml-4">
                {/* ✅ Edit Button */}
                <button
                  type="button"
                  onClick={() => startEditing(i)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                >
                  ✏️ Edit
                </button>
                {/* ✅ Remove Button */}
                <button
                  type="button"
                  onClick={() => onRemoveVariation(i)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}