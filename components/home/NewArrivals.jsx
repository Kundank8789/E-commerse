"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import QuickViewModal from "@/components/product/QuickViewModal";
import toast from "react-hot-toast";

export default function NewArrivals() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  // LOADING
  if (loading) {
    return (
      <section className="py-16 bg-white text-black text-center">
        <p className="text-gray-500">Loading new arrivals...</p>
      </section>
    );
  }

  // ERROR
  if (error) {
    return (
      <section className="py-16 bg-white text-black text-center">
        <p className="text-red-500">Failed to load products ❌</p>
      </section>
    );
  }

  // EMPTY
  if (products.length === 0) {
    return (
      <section className="py-16 bg-white text-black text-center">
        <p className="text-gray-500">No products available</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white text-black">

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          New Arrivals
        </h2>
      </div>

      {/* Grid */}
      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4 md:px-6">

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
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
            >

              {/* Image */}
              <div className="relative overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt={product.name || "product"}
                    width={500}
                    height={500}
                    className="w-full h-[160px] sm:h-[220px] md:h-[260px] object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-[160px] sm:h-[220px] md:h-[260px] bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}

                {/* Tag */}
                <span className="absolute top-2 left-2 bg-black text-white text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 rounded-full font-semibold">
                  NEW
                </span>

                {/* Quick View */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="bg-black text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:scale-105 transition"
                  >
                    Quick View
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  ₹{product.price}
                </p>

                {/* Add to Cart */}
                <button
                  onClick={() => {
                    addToCart(product);
                    toast.success("Added to cart 🛒");
                  }}
                  className="mt-3 w-full bg-black text-white py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
                >
                  Add to Cart
                </button>
              </div>

            </motion.div>
          );
        })}

      </div>

      {/* Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}