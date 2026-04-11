import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-md">
      
      <h1 className="text-2xl font-bold">
        MyStore
      </h1>

      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}