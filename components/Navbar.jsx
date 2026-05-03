"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaShoppingBag, FaHeart, FaSearch } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);

  const { cart } = useCart();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-black text-white border-b border-white/10 backdrop-blur">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT: Logo + Search */}
        <div className="flex items-center gap-6 flex-1">

          {/* Logo */}
          <Link href="/">
            <Image
              src="/newlogo.png"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* 🔍 Search (IMPROVED) */}
          <div className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-[420px] border border-gray-300 focus-within:border-yellow-400">

            <FaSearch className="text-gray-400 mr-2" />

            <input
              type="text"
              placeholder="Search for products..."
               className="w-full text-black text-sm bg-transparent outline-none focus:outline-none focus:ring-0 focus:border-none"
            />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">

          <Link href="/" className="hover:text-yellow-400 transition">
            Home
          </Link>

          {/* Shop Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="hover:text-yellow-400 transition">
              Shop ▾
            </button>

            {showDropdown && (
              <div className="absolute top-8 left-0 bg-white text-black rounded-xl shadow-xl p-4 w-52">
                {categories.length === 0 ? (
                  <p className="text-sm text-gray-500">No categories</p>
                ) : (
                  categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${cat.slug}`}
                      className="block py-2 px-2 rounded hover:bg-gray-100 transition"
                    >
                      {cat.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <Link href="/orders" className="hover:text-yellow-400 transition">
            Orders
          </Link>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative group">
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
            <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition text-sm">
              Login
            </button>
          </Link>

        </div>

        {/* Mobile Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-6 flex flex-col gap-4 text-sm">

          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/orders" onClick={() => setOpen(false)}>Orders</Link>
          <Link href="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
          <Link href="/cart" onClick={() => setOpen(false)}>
            Cart ({totalItems})
          </Link>

          <Link href="/login">
            <button className="mt-2 bg-white text-black px-4 py-2 rounded-full">
              Login
            </button>
          </Link>

        </div>
      )}

    </nav>
  );
}