"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative h-[75vh] md:h-[90vh] w-full overflow-hidden">

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

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center px-5 md:px-16 z-10">

        <div className="max-w-lg md:max-w-xl">

          {/* TAG */}
          <motion.p
            key={index + "tag"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-yellow-600 uppercase tracking-widest mb-2 text-xs md:text-sm"
          >
            New Collection
          </motion.p>

          {/* TITLE */}
          <motion.h1
            key={slides[index].title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-black mb-4 leading-tight"
          >
            {slides[index].title}
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p
            key={slides[index].subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-700 mb-6 text-base md:text-lg"
          >
            {slides[index].subtitle}
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
          >

            <button className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition text-sm md:text-base">
              Shop Now
            </button>

            <button className="w-full sm:w-auto border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition text-sm md:text-base">
              Explore
            </button>

          </motion.div>

        </div>
      </div>

      {/* LEFT ARROW */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition"
      >
        <FaArrowLeft className="text-black text-sm" />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition"
      >
        <FaArrowRight className="text-black text-sm" />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3 z-20">

        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full cursor-pointer transition ${
              i === index
                ? "bg-black scale-125"
                : "bg-gray-400"
            }`}
          />
        ))}

      </div>

    </section>
  );
}