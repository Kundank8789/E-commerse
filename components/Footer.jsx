import Link from "next/link";

export default function Footer() {
return ( <footer className="bg-black text-white pt-16 pb-8 mt-20">

  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

    {/* Brand */}
    <div>
      <h2 className="text-2xl font-bold">MY STORE</h2>
      <p className="text-gray-400 mt-3">
        Modern fashion ecommerce store bringing premium style and comfort.
      </p>
    </div>

    {/* Shop Links */}
    <div>
      <h3 className="font-semibold text-lg">Shop</h3>
      <ul className="mt-4 space-y-2 text-gray-400">
        <li>
          <Link href="/products" className="hover:text-white transition">
            All Products
          </Link>
        </li>
        <li>
          <Link href="/collections" className="hover:text-white transition">
            Collections
          </Link>
        </li>
        <li>
          <Link href="/new" className="hover:text-white transition">
            New Arrivals
          </Link>
        </li>
      </ul>
    </div>

    {/* Support */}
    <div>
      <h3 className="font-semibold text-lg">Support</h3>
      <ul className="mt-4 space-y-2 text-gray-400">
        <li>
          <Link href="/contact" className="hover:text-white transition">
            Contact Us
          </Link>
        </li>
        <li>
          <Link href="/faq" className="hover:text-white transition">
            FAQ
          </Link>
        </li>
        <li>
          <Link href="/returns" className="hover:text-white transition">
            Returns
          </Link>
        </li>
      </ul>
    </div>

    {/* Newsletter */}
    <div>
      <h3 className="font-semibold text-lg">Newsletter</h3>

      <p className="text-gray-400 mt-3">
        Subscribe to get updates on new arrivals and offers.
      </p>

      <div className="flex mt-4">

        <input
          type="email"
          placeholder="Enter email"
          className="px-3 py-2 w-full rounded-l-lg text-black"
        />

        <button className="bg-white text-black px-4 rounded-r-lg hover:bg-gray-200 transition">
          Subscribe
        </button>

      </div>
    </div>

  </div>

  {/* Bottom Section */}
  <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
    © 2026 ZIVA. All rights reserved.
  </div>

</footer>


);
}
