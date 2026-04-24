"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);

    // fetch products
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // 🔥 get image from products
  const getCategoryImage = (categoryId) => {
    const product = products.find(
      (p) =>
        p.category?._id === categoryId ||
        p.categories?.some((c) => c._id === categoryId)
    );

    return product?.images?.[0] || null;
  };

  return (
    <section className="bg-black text-white py-16">

      <div className="max-w-7xl mx-auto px-6 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Shop by Category
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">

        {categories.map((cat, index) => {
          const image = getCategoryImage(cat._id);

          return (
            <motion.div
              key={cat._id}
              onClick={() => router.push(`/products?category=${cat._id}`)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-2xl cursor-pointer"
            >

              {/* IMAGE */}
              {image ? (
                <Image
                  src={image}
                  alt={cat.name}
                  width={500}
                  height={500}
                  className="w-full h-[220px] md:h-[260px] object-cover group-hover:scale-110 transition duration-500"
                />
              ) : (
                <div className="w-full h-[220px] md:h-[260px] bg-gray-700 flex items-center justify-center">
                  No Image
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition" />

              {/* Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-lg md:text-xl font-semibold">
                  {cat.name}
                </h3>
              </div>

            </motion.div>
          );
        })}

      </div>
    </section>
  );
}