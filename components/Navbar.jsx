import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">

      {/* Logo */}
      <Link href="/">
        <h1 className="text-2xl font-bold cursor-pointer">
          MyStore
        </h1>
      </Link>

      {/* Menu */}
      <div className="flex items-center gap-8">

        <Link href="/" className="hover:text-blue-500 transition">
          Home
        </Link>

        <Link href="/products" className="hover:text-blue-500 transition">
          Products
        </Link>

        <Link href="/cart" className="hover:text-blue-500 transition">
          🛒 Cart
        </Link>

        <Link href="/login">
          <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
            Login
          </button>
        </Link>

      </div>
    </nav>
  );
}