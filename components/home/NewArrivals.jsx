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
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
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

  // 🔥 LOADING
  if (loading) {
    return (
      <section className="py-16 bg-black text-white text-center">
        <p className="text-gray-400">Loading new arrivals...</p>
      </section>
    );
  }

  // 🔥 ERROR
  if (error) {
    return (
      <section className="py-16 bg-black text-white text-center">
        <p className="text-red-500">Failed to load products ❌</p>
      </section>
    );
  }

  // 🔥 EMPTY
  if (products.length === 0) {
    return (
      <section className="py-16 bg-black text-white text-center">
        <p className="text-gray-400">No products available</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black text-white">

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          New Arrivals
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 px-6">

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
              className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-white/10"
            >

              {/* Image */}
              <div className="relative overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt={product.name || "product"}
                    width={500}
                    height={500}
                    className="w-full h-[260px] object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-[260px] bg-gray-700 flex items-center justify-center">
                    No Image
                  </div>
                )}

                {/* Tag */}
                <span className="absolute top-3 left-3 bg-white text-black text-[10px] px-3 py-1 rounded-full font-semibold">
                  NEW
                </span>

                {/* Quick View */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white text-black px-6 py-2 rounded-full font-medium hover:scale-105 transition"
                  >
                    Quick View
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-semibold tracking-wide">
                  {product.name}
                </h3>

                <p className="text-gray-400 mt-1 text-sm">
                  ₹{product.price}
                </p>

                {/* Add to Cart */}
                <button
                  onClick={() => {
                    addToCart(product);
                    toast.success("Added to cart 🛒");
                  }}
                  className="mt-4 w-full bg-white text-black py-2 rounded-full font-medium 
                  hover:bg-black hover:text-white border border-white transition-all duration-300"
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