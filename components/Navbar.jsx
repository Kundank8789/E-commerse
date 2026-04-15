"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 🔥 Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "products", "new"];

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const rect = section.getBoundingClientRect();

        if (rect.top <= 100 && rect.bottom >= 100) {
          setActive(id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🎨 Active style
  const linkStyle = (id) =>
    `relative group transition ${
      active === id ? "text-white" : "text-gray-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-widest">
            MY SHOPPING
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">

          {/* Home */}
          <a href="#home" className={linkStyle("home")}>
            Home
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300 ${
                active === "home" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </a>

          {/* Shop */}
          <a href="#products" className={linkStyle("products")}>
            Shop
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300 ${
                active === "products" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </a>

          {/* New */}
          <a href="#new" className={linkStyle("new")}>
            New
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300 ${
                active === "new" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </a>

          {/* Cart */}
          <Link href="/cart" className="relative group">
            <FaShoppingBag className="w-5 h-5 group-hover:scale-110 transition" />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-red-500 text-[12px] w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Login */}
          <Link href="/login">
            <button className="bg-white text-black px-5 py-2 rounded-full hover:scale-105 transition-all duration-300">
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