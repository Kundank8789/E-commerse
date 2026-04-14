"use client";

import Link from "next/link";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold tracking-widest">ZIVA</h2>
          <p className="text-gray-400 mt-4 text-sm leading-relaxed">
            Premium fashion for modern lifestyle. Designed for comfort and style.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <FaInstagram className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
            <FaTwitter className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
            <FaFacebook className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/products" className="hover:text-white">All Products</Link></li>
            <li><Link href="/collections" className="hover:text-white">Collections</Link></li>
            <li><Link href="/new" className="hover:text-white">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Newsletter</h3>

          <p className="text-gray-400 text-sm">
            Get updates on new arrivals and exclusive offers.
          </p>

          <div className="flex mt-5 overflow-hidden rounded-full border border-white/20">

            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />

            <button className="bg-white text-black px-5 hover:bg-gray-200 transition">
              Join
            </button>

          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-14 pt-6 border-t border-white/10 text-center text-gray-500 text-xs">
        © 2026 ZIVA. All rights reserved.
      </div>

    </footer>
  );
}