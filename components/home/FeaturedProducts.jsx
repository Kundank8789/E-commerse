"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Classic Jacket",
      price: 4999,
      image: "/jacket.jpg",
      tag: "FEATURED",
    },
    {
      id: 2,
      name: "Modern Sneakers",
      price: 3499,
      image: "/shoes.jpg",
      tag: "BEST SELLER",
    },
  ];

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

        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="group relative rounded-3xl overflow-hidden border border-white/10"
          >

            {/* Image */}
            <div className="relative h-[420px] overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-700"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Tag */}
              <span className="absolute top-4 left-4 bg-white text-black text-xs px-4 py-1 rounded-full font-semibold">
                {product.tag}
              </span>

              {/* Content inside image */}
              <div className="absolute bottom-6 left-6">

                <h3 className="text-2xl font-bold mb-2">
                  {product.name}
                </h3>

                <p className="text-gray-300 mb-4">
                  ₹{product.price}
                </p>

                <button className="bg-white text-black px-6 py-2 rounded-full font-medium 
                hover:bg-black hover:text-white border border-white 
                transition-all duration-300">
                  Shop Now
                </button>

              </div>
            </div>

          </motion.div>
        ))}

      </div>
    </section>
  );
}