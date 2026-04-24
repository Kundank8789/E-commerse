"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();

  const images = product?.images?.length ? product.images : [];
  const [index, setIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || null
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || null
  );

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">

      <div className="bg-gray-900 rounded-2xl max-w-5xl w-full p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-6">

          {/* 🔥 IMAGE SLIDER */}
          <div className="relative">

            {/* Main Image */}
            <div className="relative h-[350px] overflow-hidden rounded-xl group">
              {images.length > 0 ? (
                <Image
                  src={images[index]}
                  alt="product"
                  fill
                  className="object-cover transition duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 px-3 py-1"
                >
                  ‹
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 px-3 py-1"
                >
                  ›
                </button>
              </>
            )}

            {/* Thumbnails */}
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-16 h-16 relative cursor-pointer border ${
                    index === i ? "border-white" : "border-gray-600"
                  }`}
                >
                  <Image
                    src={img}
                    alt="thumb"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 🔥 PRODUCT INFO */}
          <div className="flex flex-col justify-between">

            <div>
              <h2 className="text-2xl font-bold">
                {product.name}
              </h2>

              <p className="text-gray-400 mt-2">
                {product.description || "No description"}
              </p>

              <p className="text-xl mt-4 font-semibold">
                ₹{product.price}
              </p>

              {/* 🔥 SIZE */}
              {product?.sizes?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm mb-1">Size</p>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 border ${
                          selectedSize === size
                            ? "bg-white text-black"
                            : ""
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔥 COLOR */}
              {product?.colors?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm mb-1">Color</p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1 border ${
                          selectedColor === color
                            ? "bg-white text-black"
                            : ""
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* 🔥 ADD TO CART */}
            <button
              onClick={() => {
                addToCart({
                  ...product,
                  selectedSize,
                  selectedColor,
                });
                onClose();
              }}
              className="mt-6 bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200"
            >
              Add to Cart
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}