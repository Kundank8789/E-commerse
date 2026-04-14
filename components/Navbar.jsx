"use client";

import Link from "next/link";
import { useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-widest hover:opacity-80 transition">
            MY SHOPPING
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">

          <Link href="/" className="hover:text-gray-300 transition">
            Home
          </Link>

          <Link href="/products" className="hover:text-gray-300 transition">
            Shop
          </Link>

          <Link href="#" className="hover:text-gray-300 transition">
            New
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative group">
            <FaShoppingBag className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] px-1.5 py-[1px] rounded-full">
              2
            </span>
          </Link>

          {/* Button */}
          <Link href="/login">
            <button className="bg-white text-black px-5 py-2 rounded-full hover:scale-105 transition-all duration-300">
              Login
            </button>
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 bg-black/90 backdrop-blur-md">

          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="#" onClick={() => setOpen(false)}>New</Link>
          <Link href="/cart" onClick={() => setOpen(false)}>Cart</Link>

          <Link href="/login">
            <button className="bg-white text-black px-5 py-2 rounded-full mt-2">
              Login
            </button>
          </Link>

        </div>
      )}
    </nav>
  );
}