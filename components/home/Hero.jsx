"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
  const slides = [
    {
      image: "/banner1.jpg",
      title: "Timeless Elegance",
      subtitle: "Crafted for those who value premium style",
    },
    {
      image: "/banner2.jpg",
      title: "Luxury Redefined",
      subtitle: "Up to 50% off on selected collections",
    },
    {
      image: "/shoes.jpg",
      title: "Step Into Style",
      subtitle: "Modern designs for everyday confidence",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">

      {/* IMAGE */}
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].image}
            alt="hero"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* OVERLAY (Luxury Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center px-6 md:px-16">

        <div className="max-w-xl">

          <motion.p
            key={index + "tag"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-yellow-600 uppercase tracking-widest mb-2 text-sm"
          >
            New Collection
          </motion.p>

          <motion.h1
            key={slides[index].title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-serif text-black mb-4 leading-tight"
          >
            {slides[index].title}
          </motion.h1>

          <motion.p
            key={slides[index].subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-700 mb-6 text-lg"
          >
            {slides[index].subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
              Shop Now
            </button>

            <button className="border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition">
              Explore
            </button>
          </motion.div>

        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full cursor-pointer transition ${
              i === index ? "bg-black scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

    </section>
  );
}