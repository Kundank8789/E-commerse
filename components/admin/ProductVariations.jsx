import { useState } from "react";

export default function ProductVariations({ product, onAddVariation, onRemoveVariation }) {
  const [variationSize, setVariationSize] = useState("");
  const [variationColor, setVariationColor] = useState("");
  const [variationStock, setVariationStock] = useState("");
  const [message, setMessage] = useState("");

  const addVariation = () => {
    if (!variationSize || !variationColor) {
      setMessage("Please select both size and color");
      return;
    }

    onAddVariation({
      size: variationSize,
      color: variationColor,
      stock: parseInt(variationStock) || 0,
    });

    setVariationSize("");
    setVariationColor("");
    setVariationStock("");
    setMessage("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Size & Color Variations</h2>
      
      <div className="grid grid-cols-4 gap-2 mb-3">
        <select
          value={variationSize}
          onChange={(e) => setVariationSize(e.target.value)}
          className="border p-2 rounded text-gray-800 bg-white"
        >
          <option value="">Select Size</option>
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        
        <select
          value={variationColor}
          onChange={(e) => setVariationColor(e.target.value)}
          className="border p-2 rounded text-gray-800 bg-white"
        >
          <option value="">Select Color</option>
          {['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        
        <input
          type="number"
          placeholder="Stock"
          value={variationStock}
          onChange={(e) => setVariationStock(e.target.value)}
          className="border p-2 rounded text-gray-800 bg-white"
        />
        
        <button
          type="button"
          onClick={addVariation}
          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
        >
          + Add
        </button>
      </div>

      {message && <p className="text-red-500 text-sm mb-2">{message}</p>}

      {product.variations.length > 0 && (
        <div className="mt-3">
          {product.variations.map((v, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-50 p-2 mb-2 rounded">
              <span className="text-gray-700">Size: {v.size} | Color: {v.color} | Stock: {v.stock}</span>
              <button
                type="button"
                onClick={() => onRemoveVariation(i)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
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