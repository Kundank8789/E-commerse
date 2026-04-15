"use client";

import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <section className="bg-black text-white py-16 px-6">

      <div className="max-w-4xl mx-auto text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight"
        >
          Join Our Newsletter
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 mt-4 text-lg"
        >
          Get exclusive deals, new arrivals & special offers
        </motion.p>

        {/* Input + Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4"
        >

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full md:w-[380px] px-5 py-3 rounded-full 
            bg-neutral-900 border border-white/20 
            focus:outline-none focus:border-white 
            transition"
          />

          <button className="px-8 py-3 rounded-full font-medium 
          bg-white text-black 
          hover:bg-black hover:text-white border border-white 
          transition-all duration-300 hover:scale-105">
            Subscribe
          </button>

        </motion.div>

        {/* Optional small note */}
        <p className="text-xs text-gray-500 mt-4">
          No spam. Only good stuff.
        </p>

      </div>

    </section>
  );
}