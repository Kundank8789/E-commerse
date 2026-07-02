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
    
    addToCart({
      ...product,
      quantity: quantity,
      shippingCost: product.shippingCost || 0
    });
    
    setLoading(false);
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      position: 'bottom-center',
    });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Quantity Selector - Mobile Optimized */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <label className="text-xs sm:text-sm font-medium text-gray-700">
          Quantity:
        </label>
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(prev => Math.max(prev - 1, minQty))}
            disabled={quantity <= minQty}
            className="px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200 text-sm sm:text-base min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-3 sm:px-4 py-2 sm:py-2.5 min-w-[40px] text-center font-medium text-sm sm:text-base">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(prev => Math.min(prev + 1, maxQty))}
            disabled={quantity >= maxQty}
            className="px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200 text-sm sm:text-base min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span className="text-[10px] sm:text-sm text-gray-500">
          (Max: {maxQty})
        </span>
      </div>

      {/* Add to Cart Button - Mobile Optimized */}
      <button
        onClick={handleAddToCart}
        disabled={loading || product.stock === 0}
        className="w-full bg-black text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[48px] font-medium"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : product.stock === 0 ? (
          "Out of Stock"
        ) : (
          <span className="flex items-center justify-center gap-1 sm:gap-2">
            <span>Add to Cart</span>
            <span className="hidden xs:inline">•</span>
            <span className="text-xs sm:text-sm">₹{(product.price * quantity).toFixed(2)}</span>
          </span>
        )}
      </button>

      {/* Shipping info - Mobile Optimized */}
      <div className="text-center">
        {product.shippingCost > 0 ? (
          <p className="text-[10px] sm:text-xs text-gray-400">
            + ₹{product.shippingCost} shipping
          </p>
        ) : (
          <p className="text-[10px] sm:text-xs text-green-600 font-medium">
            🚚 Free Shipping
          </p>
        )}
        
        {/* Stock indicator */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-[10px] sm:text-xs text-orange-500 mt-0.5">
            Only {product.stock} left in stock!
          </p>
        )}
      </div>

      {/* Add responsive styles */}
      <style jsx>{`
        @media (max-width: 400px) {
          .xs\\:inline {
            display: inline;
          }
        }
        @media (min-width: 401px) {
          .xs\\:inline {
            display: none;
          }
        }
        @media (min-width: 640px) {
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}