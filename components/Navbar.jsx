"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaShoppingBag, FaHeart, FaSearch } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { cart } = useCart();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-black text-white border-b border-white/10">

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

        {/* LEFT: Logo + Search */}
        <div className="flex items-center gap-4 flex-1">

          {/* Logo */}
          <Link href="/">
            <Image
              src="/newlogo.png"
              alt="Logo"
              width={100}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* 🔍 Search */}
          <div className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-[350px] border border-gray-300 focus-within:border-yellow-400">

            <FaSearch className="text-gray-400 mr-2" />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full text-black text-sm bg-transparent outline-none focus:outline-none"
            />
          </div>

        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">

          <Link href="/" className="hover:text-yellow-400 transition">
            Home
          </Link>

          <Link href="/products" className="hover:text-yellow-400 transition">
            Shop
          </Link>

          <Link href="/orders" className="hover:text-yellow-400 transition">
            My Orders
          </Link>

          {/* Wishlist */}
          <Link href="/wishlist" className="group">
            <FaHeart className="text-lg group-hover:text-red-500 transition" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative group">
            <FaShoppingBag className="text-lg group-hover:text-yellow-400 transition" />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] px-1.5 py-[1px] rounded-full font-semibold">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Login */}
          <Link href="/login">
            <button className="bg-white text-black px-4 py-2 rounded-full hover:text-yellow-400 transition relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 hover:after:w-full after:bg-yellow-400 after:transition-all text-sm">
              Login
            </button>
          </Link>

        </div>

        {/* MOBILE BUTTON */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

      </div>

      {/* 🔥 MOBILE MENU (IMPROVED) */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 px-4 py-5 flex flex-col gap-4 text-sm animate-fadeIn shadow-2xl">

          {/* 🔍 Mobile Search */}
          <div className="flex items-center bg-neutral-900 rounded-full border border-white/20 px-4 py-2">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full text-white placeholder-gray-400 text-sm outline-none"
            />
          </div>

          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/my-orders" onClick={() => setOpen(false)}>My Orders</Link>
          <Link href="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>

          <Link href="/cart" onClick={() => setOpen(false)}>
            Cart ({totalItems})
          </Link>

          <Link href="/login">
            <button className="mt-2 bg-white text-black px-4 py-2 rounded-full w-full">
              Login
            </button>
          </Link>

        </div>
      )}

    </nav>
  );
}