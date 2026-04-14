"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Categories() {
  const categories = [
    { name: "Electronics", image: "/headphone.jpg" },
    { name: "Fashion", image: "/watch.jpg" },
    { name: "Shoes", image: "/shoes.jpg" },
    { name: "Accessories", image: "/Accessories.jpg" }
  ];

  return (
    <section className="bg-black text-white py-20">

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 mb-14">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">
          Shop by Category
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">

        {categories.map((cat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-2xl cursor-pointer"
          >

            {/* Image */}
            <Image
              src={cat.image}
              alt={cat.name}
              width={500}
              height={500}
              className="w-full h-[220px] md:h-[260px] object-cover 
              group-hover:scale-110 transition duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition" />

            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg md:text-xl font-semibold tracking-wide group-hover:scale-110 transition">
                {cat.name}
              </h3>
            </div>

          </motion.div>
        ))}

      </div>
    </section>
  );
}