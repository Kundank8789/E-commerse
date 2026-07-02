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
      image: "/banner.png",
      title: "Step Into Style",
      subtitle: "Modern designs for everyday confidence",
    },
  ];

  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left - next slide
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right - previous slide
      prevSlide();
    }
  };

  return (
    <section 
      className="relative h-[60vh] sm:h-[70vh] md:h-[90vh] w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* IMAGE */}
      <AnimatePresence mode="wait">
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
            alt={`Slide ${index + 1}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* OVERLAY - Mobile optimized gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent md:from-white/90 md:via-white/60 md:to-transparent" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center px-4 sm:px-6 md:px-16 z-10">
        <div className="max-w-xs sm:max-w-sm md:max-w-xl">
          {/* TAG */}
          <motion.p
            key={index + "tag"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-yellow-400 md:text-yellow-600 uppercase tracking-[0.2em] md:tracking-widest mb-1.5 md:mb-2 text-[10px] sm:text-xs md:text-sm font-medium"
          >
            New Collection
          </motion.p>

          {/* TITLE */}
          <motion.h1
            key={slides[index].title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-6xl font-serif text-white md:text-black mb-2 md:mb-4 leading-tight"
          >
            {slides[index].title}
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p
            key={slides[index].subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-200 md:text-gray-700 mb-4 md:mb-6 text-xs sm:text-sm md:text-lg"
          >
            {slides[index].subtitle}
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto"
          >
            <button 
              className="w-full sm:w-auto bg-white md:bg-black text-black md:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-gray-100 md:hover:bg-gray-800 transition text-xs sm:text-sm md:text-base font-medium active:scale-95"
              onClick={() => window.location.href = '/products'}
            >
              Shop Now
            </button>

            <button 
              className="w-full sm:w-auto border border-white md:border-black text-white md:text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-white hover:text-black md:hover:bg-black md:hover:text-white transition text-xs sm:text-sm md:text-base font-medium active:scale-95"
              onClick={() => window.location.href = '/about'}
            >
              Explore
            </button>
          </motion.div>
        </div>
      </div>

      {/* LEFT ARROW - Hide on very small screens, show on larger */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition hover:scale-110 active:scale-95"
        aria-label="Previous slide"
      >
        <FaArrowLeft className="text-black text-xs sm:text-sm" />
      </button>

      {/* RIGHT ARROW - Hide on very small screens, show on larger */}
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition hover:scale-110 active:scale-95"
        aria-label="Next slide"
      >
        <FaArrowRight className="text-black text-xs sm:text-sm" />
      </button>

      {/* DOTS - Larger touch targets on mobile */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 w-full flex justify-center gap-2 sm:gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full cursor-pointer transition-all duration-300 ${
              i === index
                ? "bg-white md:bg-black scale-125 shadow-lg"
                : "bg-white/50 md:bg-gray-400 hover:bg-white/80 md:hover:bg-gray-500"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide indicator - Mobile only */}
      <div className="absolute top-3 right-3 sm:hidden z-20 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
        <span className="text-white text-xs font-medium">
          {index + 1}/{slides.length}
        </span>
      </div>
    </section>
  );
}