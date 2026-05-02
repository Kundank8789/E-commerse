"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation"; // ✅ ADD THIS

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  const { cart } = useCart();
  const pathname = usePathname(); // ✅ ADD THIS

  // ❌ HIDE NAVBAR ON ADMIN ROUTES
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const displayCount = totalItems > 99 ? "99+" : totalItems;

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "products", "new"];

      for (let id of sections) {
        const section = document.getElementById(id);
        if (!section) continue;

        const rect = section.getBoundingClientRect();

        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkStyle = (id) =>
    `relative group transition ${
      active === id ? "text-white" : "text-gray-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo6.jpg"
            alt="My Shopping Logo"
            width={140}
            height={40}
            className="h-10 w-auto object-contain rounded hover:scale-105 transition"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">

          <a href="#home" className={linkStyle("home")}>Home</a>
          <a href="#products" className={linkStyle("products")}>Shop</a>
          <a href="#new" className={linkStyle("new")}>New</a>

          <Link href="/orders" className="hover:text-white">
            My Orders
          </Link>

          {/* 🛒 Cart */}
          <Link href="/cart" className="relative group">
            <FaShoppingBag className="w-5 h-5 group-hover:scale-110 transition" />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-red-500 text-[11px] min-w-[18px] h-[18px] px-[5px] flex items-center justify-center rounded-full font-semibold animate-bounce">
                {displayCount}
              </span>
            )}
          </Link>

          {/* Login */}
          <Link href="/login">
            <button className="bg-white text-black px-5 py-2 rounded-full hover:scale-105 transition">
              Login
            </button>
          </Link>

        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 bg-black/90">

          <a href="#home" onClick={() => setOpen(false)}>Home</a>
          <a href="#products" onClick={() => setOpen(false)}>Shop</a>
          <a href="#new" onClick={() => setOpen(false)}>New</a>

          <Link href="/cart" onClick={() => setOpen(false)}>
            Cart ({displayCount})
          </Link>

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