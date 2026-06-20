"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const minQty = product.minOrderQuantity || 1;
  const maxQty = Math.min(product.maxOrderQuantity || 5, product.stock || 0);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error("Product is out of stock!");
      return;
    }

    setLoading(true);
    
    // Add product to cart with shipping cost
    addToCart({
      ...product,
      quantity: quantity,
      shippingCost: product.shippingCost || 0
    });
    
    setLoading(false);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(prev => Math.max(prev - 1, minQty))}
            disabled={quantity <= minQty}
            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="px-4 py-2 min-w-[40px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(prev => Math.min(prev + 1, maxQty))}
            disabled={quantity >= maxQty}
            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">
          (Max: {maxQty})
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading || product.stock === 0}
        className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : product.stock === 0 ? (
          "Out of Stock"
        ) : (
          `Add to Cart • ₹${(product.price * quantity).toFixed(2)}`
        )}
      </button>

      {/* Shipping info */}
      {product.shippingCost > 0 && (
        <p className="text-xs text-gray-400 text-center">
          + ₹{product.shippingCost} shipping
        </p>
      )}
      {product.shippingCost === 0 && (
        <p className="text-xs text-green-600 text-center">
          🚚 Free Shipping
        </p>
      )}
    </div>
  );
}