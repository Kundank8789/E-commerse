"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { cart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith("/admin")) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ── Search handler ───────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
      setMobileSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-black text-white border-b border-white/10">

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

        {/* LEFT: Logo + Desktop Search */}
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

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-[350px] border border-gray-300 focus-within:border-yellow-400"
          >
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full text-black text-sm bg-transparent outline-none"
            />
          </form>

        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link href="/products" className="hover:text-yellow-400 transition">Shop</Link>
          <Link href="/orders" className="hover:text-yellow-400 transition">My Orders</Link>

          <Link href="/wishlist" className="group">
            <FaHeart className="text-lg group-hover:text-red-500 transition" />
          </Link>

          <Link href="/cart" className="relative group">
            <FaShoppingBag className="text-lg group-hover:text-yellow-400 transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] px-1.5 py-[1px] rounded-full font-semibold">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <Link href="/login">
            <button className="bg-white text-black px-4 py-2 rounded-full hover:text-yellow-400 transition text-sm">
              Login
            </button>
          </Link>
        </div>

        {/* MOBILE RIGHT ICONS */}
        <div className="flex md:hidden items-center gap-3">

          {/* 🔍 Mobile Search Icon */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="text-white"
          >
            <FiSearch size={20} />
          </button>

          {/* 🛒 Mobile Cart Icon */}
          <Link href="/cart" className="relative">
            <FaShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] px-1.5 py-[1px] rounded-full font-semibold">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* ☰ Hamburger */}
          <button onClick={() => setOpen(!open)}>
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

        </div>

      </div>

      {/* 📱 MOBILE SEARCH BAR (drops down when search icon clicked) */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 animate-fadeIn">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-neutral-900 rounded-full border border-white/20 px-4 py-2"
          >
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="w-full text-white placeholder-gray-400 text-sm outline-none bg-transparent"
            />
            <button type="submit" className="text-yellow-400 text-sm ml-2 font-medium">
              Go
            </button>
          </form>
        </div>
      )}

      {/* 📱 MOBILE MENU */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 px-4 py-5 flex flex-col gap-4 text-sm animate-fadeIn shadow-2xl">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/orders" onClick={() => setOpen(false)}>My Orders</Link>
          <Link href="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
          <Link href="/cart" onClick={() => setOpen(false)}>
            Cart {totalItems > 0 && `(${totalItems})`}
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