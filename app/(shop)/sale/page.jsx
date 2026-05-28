"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SalePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  const fetchSaleProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      const productsData = Array.isArray(data) ? data : [];
      // Filter products with discount (mrp > price)
      const saleProducts = productsData.filter(p => p.mrp && p.mrp > p.price);
      setProducts(saleProducts);
    } catch (error) {
      console.error("Error fetching sale products:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (mrp, price) => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sale & Offers</h1>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
          <p className="text-gray-600 mt-2">Grab the best deals on your favorite products</p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No sale products available at the moment.</p>
            <Link href="/products">
              <button className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                Shop All Products
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const discount = calculateDiscount(product.mrp, product.price);
                return (
                  <Link key={product._id} href={`/product/${product._id}`} className="group">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                      {/* Product Image */}
                      <div className="relative w-full h-64 bg-gray-100">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            🛍️
                          </div>
                        )}
                        {/* Discount Badge */}
                        {discount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 group-hover:text-yellow-600 transition line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-lg font-bold text-red-600">
                            ₹{product.price}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.mrp}
                            </span>
                          )}
                        </div>
                        {discount > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            Save ₹{product.mrp - product.price}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* View All Products Link */}
            <div className="text-center mt-12">
              <Link href="/products">
                <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition">
                  View All Products →
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}