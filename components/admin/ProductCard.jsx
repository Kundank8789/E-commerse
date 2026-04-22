"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductCard({ product, handleEdit, handleDelete }) {

  // ✅ Handle old + new image formats
  const images =
    product?.images?.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : [];

  const [index, setIndex] = useState(0);

  const next = () => {
    if (images.length === 0) return;
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    if (images.length === 0) return;
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="group bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 
    transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:border-white/20">

      {/* 🔥 IMAGE SECTION */}
      <div className="relative w-full h-40 mb-3 overflow-hidden rounded-lg">

        {images.length > 0 ? (
          <Image
            src={images[index]}
            alt={product?.name || "product"}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500 text-sm">
            No Image
          </div>
        )}

        {/* LEFT BUTTON */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 px-2 py-1 rounded-full text-white text-xs hover:bg-black"
          >
            ◀
          </button>
        )}

        {/* RIGHT BUTTON */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 px-2 py-1 rounded-full text-white text-xs hover:bg-black"
          >
            ▶
          </button>
        )}

        {/* DOTS */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"
                  }`}
              />
            ))}
          </div>
        )}

        {/* OPTIONAL LABEL */}
        {images.length === 0 && (
          <span className="absolute bottom-1 right-1 text-xs bg-black/60 px-1 rounded text-white">
            No Image
          </span>
        )}
      </div>

      {/* CONTENT */}
      <h3 className="font-semibold text-lg group-hover:text-white transition">
        {product?.name}
      </h3>

      <p className="text-xs text-blue-400">
        {product?.category?.name || "No Category"}
      </p>

      <p className="text-gray-400 text-sm mb-2">
        ₹{product?.price}
      </p>

      {/* BUTTONS */}
      <div className="flex gap-2 mt-3 opacity-80 group-hover:opacity-100 transition">

        <button
          type="button"
          onClick={() => handleEdit(product)}
          className="flex-1 bg-yellow-500 py-2 rounded-lg text-sm 
          hover:bg-yellow-600 hover:scale-[1.03] transition"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => handleDelete(product?._id)}
          className="flex-1 bg-red-500 py-2 rounded-lg text-sm 
          hover:bg-red-600 hover:scale-[1.03] transition"
        >
          Delete
        </button>

      </div>
    </div>
  );
}