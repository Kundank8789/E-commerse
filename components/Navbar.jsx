import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-wide hover:text-gray-300 transition">
            MyStore
          </h1>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            href="/"
            className="hover:text-gray-300 transition relative after:block after:h-0.5 after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="hover:text-gray-300 transition relative after:block after:h-0.5 after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
          >
            Products
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative hover:text-gray-300 transition"
          >
            🛒 Cart
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 rounded-full">
              2
            </span>
          </Link>

          {/* Login Button */}
          <Link href="/login">
            <button className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition">
              Login
            </button>
          </Link>

        </div>

      </div>

    </nav>
  );
}