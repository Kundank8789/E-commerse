"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BestSellersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      const productsData = Array.isArray(data) ? data : [];
      // Sort by stock or rating to simulate best sellers
      const bestSellers = productsData.sort((a, b) => b.stock - a.stock).slice(0, 8);
      setProducts(bestSellers);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Best Sellers</h1>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
          <p className="text-gray-600 mt-2">Our most popular products loved by customers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                <div className="relative w-full h-64 bg-gray-100">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
                  )}
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                    Best Seller
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 group-hover:text-yellow-600 transition">{product.name}</h3>
                  <p className="text-lg font-bold text-gray-900 mt-2">₹{product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}