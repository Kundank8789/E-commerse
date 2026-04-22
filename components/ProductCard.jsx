"use client";

import Image from "next/image";
import Link from "next/link"; // ✅ import Link

export default function ProductCard({ product }) {
  const imageSrc =
    product?.images?.length > 0
      ? product.images[0]
      : product?.image || "/placeholder.png";

  return (
    <Link href={`/products/${product._id}`} className="block">
      <div className="group bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:scale-105 transition duration-300 cursor-pointer">
        
        {/* Image */}
        <div className="relative w-full h-52 overflow-hidden rounded-xl mb-4">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition duration-500"
          />

          {/* CATEGORY BADGE */}
          {product?.category?.name && (
            <span className="absolute top-2 left-2 bg-black/70 text-xs px-2 py-1 rounded">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Info */}
        <h2 className="text-lg font-semibold line-clamp-1">
          {product.name}
        </h2>

        <p className="text-gray-400 text-sm mb-2">
          ₹{product.price}
        </p>

        {/* Description */}
        {product?.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Button */}
        <button
          onClick={(e) => e.preventDefault()} // ✅ prevent navigation when clicking button
          className="mt-auto w-full bg-white text-black py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}