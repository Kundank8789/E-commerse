"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        setProducts(data.slice(0, 4)); // ✅ SHOW 4 PRODUCTS
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white text-black text-center">
        <p className="text-gray-500">Loading featured products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white text-black text-center">
        <p className="text-red-500">Failed to load products ❌</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white text-black">

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Trending Products
        </h2>
      </div>

      {/* GRID */}
      {/* GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">

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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => router.push(`/products/${product._id}`)}
            >

              {/* IMAGE */}
              <div className="relative h-[160px] sm:h-[220px] md:h-56 overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt={product.name || "product"}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-3 sm:p-4">

                <h3 className="text-sm sm:text-lg font-semibold text-black line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-gray-600 mt-1 mb-3 text-sm sm:text-base">
                  ₹{product.price}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/products/${product._id}`);
                  }}
                  className="w-full bg-black text-white py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-800 transition"
                >
                  View Product
                </button>

              </div>

            </motion.div>
          );
        })}

      </div>
    </section>
  );
}