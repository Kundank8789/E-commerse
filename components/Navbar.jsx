"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FaShoppingBag, FaHeart, FaUserCircle } from "react-icons/fa";
import { FiMenu, FiX, FiSearch, FiLogOut, FiEdit2 } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ separate refs for desktop and mobile
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const { cart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith("/admin")) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

  // ── Fetch user ───────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]);

  // ── Close dropdown on outside click ─────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedOutsideDesktop =
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target);
      const clickedOutsideMobile =
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(e.target);

      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Logout ───────────────────────────────────────
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setDropdownOpen(false);
    router.push("/login");
  };

  // ── Search ───────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
      setMobileSearchOpen(false);
    }
  };

  // ── Dropdown JSX (reused for desktop + mobile) ──
  const DropdownMenu = () => (
    <div className="w-48 bg-white text-black rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[999]">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="font-semibold text-sm truncate">{user?.name}</p>
        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
      </div>

      {/* Edit Profile */}
      <button
        onClick={() => { router.push("/account"); setDropdownOpen(false); }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition text-left"
      >
        <FiEdit2 size={15} className="text-gray-500" />
        Edit Profile
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition text-left"
      >
        <FiLogOut size={15} />
        Logout
      </button>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-black text-white border-b border-white/10">

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

        {/* LEFT: Logo + Desktop Search */}
        <div className="flex items-center gap-4 flex-1">
          <Link href="/">
            <Image src="/newlogo.png" alt="Logo" width={100} height={40} className="object-contain" />
          </Link>
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

          {/* ✅ DESKTOP USER SECTION */}
          {user ? (
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1.5 rounded-full font-semibold text-sm hover:bg-yellow-300 transition"
              >
                <span className="w-6 h-6 rounded-full bg-black text-yellow-400 flex items-center justify-center text-xs font-bold">
                  {avatarLetter}
                </span>
                <span className="max-w-[80px] truncate">{user.name}</span>
              </button>

              {/* ✅ Desktop Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2">
                  <DropdownMenu />
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-white text-black px-4 py-2 rounded-full hover:text-yellow-400 transition text-sm">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* MOBILE RIGHT ICONS */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="text-white">
            <FiSearch size={20} />
          </button>

          <Link href="/cart" className="relative">
            <FaShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] px-1.5 py-[1px] rounded-full font-semibold">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* ✅ Mobile Avatar */}
          {user ? (
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-sm"
            >
              {avatarLetter}
            </button>
          ) : (
            <Link href="/login">
              <FaUserCircle size={22} className="text-white" />
            </Link>
          )}

          <button onClick={() => setOpen(!open)}>
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3">
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
            <button type="submit" className="text-yellow-400 text-sm ml-2 font-medium">Go</button>
          </form>
        </div>
      )}

      {/* ✅ MOBILE DROPDOWN — fixed positioning */}
      {dropdownOpen && user && (
        <div
          ref={mobileDropdownRef}
          className="md:hidden absolute top-[60px] right-4 z-[999]"
        >
          <DropdownMenu />
        </div>
      )}

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 px-4 py-5 flex flex-col gap-4 text-sm shadow-2xl">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/orders" onClick={() => setOpen(false)}>My Orders</Link>
          <Link href="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
          <Link href="/cart" onClick={() => setOpen(false)}>
            Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-full w-full text-left"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="mt-2 bg-white text-black px-4 py-2 rounded-full w-full">
                Login
              </button>
            </Link>
          )}
        </div>
      )}

    </nav>
  );
}