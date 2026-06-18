import { useState } from "react";

export default function ProductVariations({ product, onAddVariation, onRemoveVariation }) {
  const [variationSize, setVariationSize] = useState("");
  const [variationColor, setVariationColor] = useState("");
  const [variationStock, setVariationStock] = useState("");
  const [variationPrice, setVariationPrice] = useState("");
  const [message, setMessage] = useState("");

  const addVariation = () => {
    if (!variationSize || !variationColor) {
      setMessage("Please enter both size and color");
      return;
    }

    // Check if variation already exists
    const exists = product.variations.some(
      v => v.size === variationSize && v.color === variationColor
    );
    if (exists) {
      setMessage("This size and color combination already exists");
      return;
    }

    onAddVariation({
      size: variationSize,
      color: variationColor,
      stock: parseInt(variationStock) || 0,
      price: parseFloat(variationPrice) || 0,
    });

    setVariationSize("");
    setVariationColor("");
    setVariationStock("");
    setVariationPrice("");
    setMessage("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Size & Color Variations</h2>
      
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
      
      <button
        type="button"
        onClick={addVariation}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-3 transition"
      >
        + Add Variation
      </button>

      {message && <p className="text-red-500 text-sm mb-2">{message}</p>}

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
              <button
                type="button"
                onClick={() => onRemoveVariation(i)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 ml-4 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}