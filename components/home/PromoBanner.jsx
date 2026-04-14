"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function PromoBanner() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">

      {/* Background Image */}
      <Image
        src="/hero2.jpg"
        alt="Sale Banner"
        fill
        className="object-cover scale-105"
      />

      {/* Gradient Overlay (IMPORTANT) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />

      {/* Content */}
      <div className="relative max-w-5xl mx-auto text-center text-white">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight"
        >
          Summer Sale
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg md:text-xl text-gray-200"
        >
          Up to 50% Off on Selected Items
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 px-10 py-3 rounded-full font-semibold 
          bg-white text-black 
          hover:bg-black hover:text-white border border-white 
          transition-all duration-300 hover:scale-105"
        >
          Shop Now
        </motion.button>

      </div>
    </section>
  );
}