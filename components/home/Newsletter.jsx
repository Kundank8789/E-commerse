"use client";

import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <section className="bg-white text-black py-16 px-6">

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
          className="text-gray-600 mt-4 text-lg"
        >
          Get exclusive deals, new arrivals & special offers
        </motion.p>

       
      </div>

    </section>
  );
}