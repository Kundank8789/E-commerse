"use client";

import Image from "next/image";

export default function ProductCard({ product }) {
  const imageSrc =
    product?.images?.length > 0
      ? product.images[0]
      : product?.image || "/placeholder.png";

  return (
    <div className="group bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:scale-105 transition duration-300">
      
      {/* Image */}
      <div className="relative w-full h-52 overflow-hidden rounded-xl mb-4">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition duration-500"
        />
      </div>

      {/* Info */}
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-400 text-sm">₹{product.price}</p>

      {/* Button */}
      <button className="mt-3 w-full bg-white text-black py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
        Add to Cart
      </button>
    </div>
  );
}