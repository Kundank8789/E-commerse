import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-black text-white py-24">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Discover Amazing <span className="text-blue-500">Products</span>
        </h1>

        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Shop the latest trends with unbeatable prices.
          Find fashion, gadgets, and essentials all in one place.
        </p>

        <div className="flex justify-center gap-4">

          <Link href="/products">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
              Shop Now
            </button>
          </Link>

          <Link href="/products">
            <button className="border border-gray-400 px-8 py-3 rounded-lg hover:bg-white hover:text-black transition">
              Explore Products
            </button>
          </Link>

        </div>

      </div>

    </section>
  );
}