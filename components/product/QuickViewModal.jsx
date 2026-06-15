"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { FaStar, FaStarHalfAlt, FaRegStar, FaTimes } from "react-icons/fa";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const images = product?.images?.length ? product.images : [];
  const [index, setIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  const nextImage = () => setIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const calculateDiscount = () => {
    if (product?.mrp && product?.price && product.mrp > product.price) {
      return Math.round(((product.mrp - product.price) / product.mrp) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();
  const isOutOfStock = product?.stock === 0;

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    }
    return stars;
  };

  const description = product?.description || "No description available";
  const isLongDescription = description.length > 120;
  const displayedDescription = showFullDescription 
    ? description 
    : description.substring(0, 120);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center transition"
        >
          <FaTimes />
        </button>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT: IMAGE SECTION */}
            <div className="space-y-4">
              <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] bg-gray-100 rounded-xl overflow-hidden">
                {images.length > 0 && images[index] ? (
                  <Image
                    src={images[index]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-4"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full transition flex items-center justify-center text-2xl"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full transition flex items-center justify-center text-2xl"
                  >
                    ›
                  </button>
                </>
              )}

              {images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                        index === i ? "border-yellow-500" : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <Image src={img} alt="thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: PRODUCT INFO */}
            <div className="flex flex-col space-y-4">
              
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">{renderStars()}</div>
                <span className="text-sm text-gray-500">(128 reviews)</span>
              </div>

              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* ✅ PRODUCT DETAILS HEADING + DESCRIPTION */}
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Product Details:</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {displayedDescription}
                  {!showFullDescription && isLongDescription && (
                    <button
                      onClick={() => setShowFullDescription(true)}
                      className="text-yellow-600 font-medium ml-1 hover:underline"
                    >
                      ... See More
                    </button>
                  )}
                  {showFullDescription && (
                    <button
                      onClick={() => setShowFullDescription(false)}
                      className="text-yellow-600 font-medium ml-1 hover:underline"
                    >
                      Show Less
                    </button>
                  )}
                </p>
              </div>

              {/* SIZE SELECTION */}
              {product?.sizes?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm transition ${
                          selectedSize === size
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COLOR SELECTION */}
              {product?.colors?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Select Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-md text-sm transition ${
                          selectedColor === color
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300 hover:border-black"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QUANTITY & STOCK - Side by side */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:border-black transition flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:border-black transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Stock Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}></div>
                    <span className={`text-sm font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                      {isOutOfStock ? "Out of Stock" : `In Stock (${product.stock})`}
                    </span>
                  </div>
                </div>
              </div>

              {/* ADD TO CART BUTTON */}
              <div className="mt-4 pt-2">
                <button
                  onClick={() => {
                    if (!isOutOfStock) {
                      addToCart({
                        ...product,
                        selectedSize,
                        selectedColor,
                        quantity,
                      });
                      onClose();
                    }
                  }}
                  disabled={isOutOfStock}
                  className={`w-full py-3 rounded-full font-semibold transition text-center ${
                    isOutOfStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 text-white"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : `Add to Cart — ₹${product.price * quantity}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}