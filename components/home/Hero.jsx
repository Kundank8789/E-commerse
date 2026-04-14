"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
  const slides = [
    {
      image: "/hero.jpg",
      title: "New Summer Collection",
      subtitle: "Discover premium fashion crafted for style",
    },
    {
      image: "/hero1.jpg",
      title: "Big Sale is Live",
      subtitle: "Up to 50% off on selected items",
    },
    {
      image: "/shoes.jpg",
      title: "Step Into Style",
      subtitle: "Trendy sneakers for modern lifestyle",
    },
  ];

  const [index, setIndex] = useState(0);

  // Auto change slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">

      {/* Image Slider */}
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">

        <motion.h1
          key={slides[index].title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold mb-4"
        >
          {slides[index].title}
        </motion.h1>

        <motion.p
          key={slides[index].subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-lg md:text-xl text-gray-200 max-w-xl"
        >
          {slides[index].subtitle}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white text-black px-8 py-3 rounded-full font-semibold 
          hover:bg-black hover:text-white border border-white 
          transition-all duration-300 hover:scale-105"
        >
          Shop Now
        </motion.button>

      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full cursor-pointer transition ${
              i === index ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

    </section>
  );
}