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

        setProducts(data.slice(0, 2));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // 🔥 LOADING UI
  if (loading) {
    return (
      <section className="py-16 bg-black text-white text-center">
        <p className="text-gray-400">Loading featured products...</p>
      </section>
    );
  }

  // 🔥 ERROR UI
  if (error) {
    return (
      <section className="py-16 bg-black text-white text-center">
        <p className="text-red-500">Failed to load products ❌</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black text-white">

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Featured Products
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6">

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
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl overflow-hidden border border-white/10 cursor-pointer"
              onClick={() => router.push(`/products/${product._id}`)}
            >

              {/* Image */}
              <div className="relative h-[420px] overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt={product.name || "product"}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    No Image
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Tag */}
                <span className="absolute top-4 left-4 bg-white text-black text-xs px-4 py-1 rounded-full font-semibold">
                  FEATURED
                </span>

                {/* Content */}
                <div className="absolute bottom-6 left-6">

                  <h3 className="text-2xl font-bold mb-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-300 mb-4">
                    ₹{product.price}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${product._id}`);
                    }}
                    className="bg-white text-black px-6 py-2 rounded-full font-medium 
                    hover:bg-black hover:text-white border border-white transition"
                  >
                    Shop Now
                  </button>

                </div>
              </div>

            </motion.div>
          );
        })}

      </div>
    </section>
  );
}