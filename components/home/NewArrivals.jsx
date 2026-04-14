"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function NewArrivals() {
  const products = [
    { id: 1, name: "Nike Shoes", price: 3999, image: "/shoes.jpg", tag: "NEW" },
    { id: 2, name: "T-Shirt", price: 999, image: "/tshirt.jpg", tag: "TRENDING" },
    { id: 3, name: "Hoodie", price: 1999, image: "/hero2.jpg", tag: "HOT" },
    { id: 4, name: "Denim Jacket", price: 2999, image: "/jacket.jpg", tag: "NEW" },
    { id: 5, name: "Smart Watch", price: 4999, image: "/watch.jpg", tag: "TRENDING" },
    { id: 6, name: "Backpack", price: 1499, image: "/bag.jpg", tag: "SALE" },
    { id: 7, name: "Sunglasses", price: 799, image: "/hero.jpg", tag: "HOT" },
    { id: 8, name: "Casual Sneakers", price: 2599, image: "/shoes.jpg", tag: "NEW" },
  ];

  return (
    <section className="py-20 bg-black text-white">

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 mb-14 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          New Arrivals
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 px-6">

        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-white/10"
          >

            {/* Image */}
            <div className="relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-[260px] object-cover group-hover:scale-110 transition duration-500"
              />

              {/* Tag */}
              <span className="absolute top-3 left-3 bg-white text-black text-[10px] px-3 py-1 rounded-full font-semibold">
                {product.tag}
              </span>

              {/* Hover Overlay Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:scale-105 transition">
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
              <button className="mt-4 w-full bg-white text-black py-2 rounded-full font-medium 
              hover:bg-black hover:text-white border border-white 
              transition-all duration-300">
                Add to Cart
              </button>
            </div>

          </motion.div>
        ))}

      </div>
    </section>
  );
}