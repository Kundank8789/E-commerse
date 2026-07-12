"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NewArrivals() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProducts(sorted.slice(0, 8));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // LOADING - Mobile friendly
  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white text-black text-center px-4">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-500 mt-3 text-sm md:text-base">Loading new arrivals...</p>
      </section>
    );
  }

  // ERROR - Mobile friendly
  if (error) {
    return (
      <section className="py-12 md:py-16 bg-white text-black text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-500 font-medium">Failed to load products ❌</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 px-6 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition active:scale-95"
        >
          Try Again
        </button>
      </section>
    );
  }

  // EMPTY - Mobile friendly
  if (products.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-white text-black text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm md:text-base">No products available</p>
        <p className="text-gray-400 text-xs mt-1">Check back later for new arrivals</p>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 bg-white text-black">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 md:mb-8 text-center">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
          New Arrivals
        </h2>
        <div className="w-16 h-[3px] bg-yellow-600 mx-auto mt-2 md:mt-3 rounded-full" />
        <p className="text-gray-500 text-xs md:text-sm mt-2 md:mt-3">
          Discover our latest collection
        </p>
      </div>

      {/* Grid - 2 columns on mobile, 4 columns on desktop */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 px-3 md:px-6">
        {products.map((product, index) => {
          const image =
            product?.images?.[0] &&
              typeof product.images[0] === "string" &&
              product.images[0].trim() !== ""
              ? product.images[0]
              : null;

          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.3) }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 active:scale-[0.98] md:active:scale-100 cursor-pointer"
            >
              <Link href={`/products/${product._id}`} className="block">
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100">
                  {image ? (
                    <Image
                      src={image}
                      alt={product.name || "product"}
                      width={500}
                      height={500}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="w-full h-[140px] sm:h-[180px] md:h-[260px] object-cover group-hover:scale-105 transition duration-500"
                      priority={index < 2}
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="w-full h-[140px] sm:h-[180px] md:h-[260px] bg-gray-200 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                      <div className="flex flex-col items-center">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        No Image
                      </div>
                    </div>
                  )}

                  {/* Tag - Mobile optimized */}
                  <span className="absolute top-2 left-2 bg-black text-white text-[8px] sm:text-[10px] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold">
                    NEW
                  </span>
                </div>

                {/* Content */}
                <div className="p-2 sm:p-3 md:p-4">
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold line-clamp-1 min-h-[1.5rem] md:min-h-[2rem]">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 mt-0.5 md:mt-1 text-sm sm:text-base font-medium">
                    ₹{product.price?.toLocaleString() || product.price}
                  </p>
                </div>
              </Link>

              {/* Add to Cart - Outside the link to prevent navigation */}
              <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product);
                    toast.success("Added to cart 🛒", {
                      duration: 2000,
                      position: 'bottom-center',
                    });
                  }}
                  className="w-full bg-black text-white py-1.5 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium hover:bg-gray-800 transition active:bg-gray-700 active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center mt-6 md:mt-10 px-4">
        <button
          onClick={() => window.location.href = '/products'}
          className="px-6 md:px-8 py-2.5 md:py-3 bg-transparent border-2 border-black text-black rounded-full text-sm md:text-base font-medium hover:bg-black hover:text-white transition-all duration-300 active:scale-95"
        >
          View All Products →
        </button>
      </div>
    </section>
  );
}