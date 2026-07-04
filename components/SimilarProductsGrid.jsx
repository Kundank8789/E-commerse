'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

export default function SimilarProductsGrid({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/similar/${productId}?limit=4`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch similar products');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching similar products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchSimilarProducts();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">You Might Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg"></div>
              <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">You Might Also Like</h2>
        <Link 
          href="/products" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
                {product.mrp && product.mrp > product.price && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.mrp.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.categories && product.categories.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {product.categories.slice(0, 2).map((cat, idx) => (
                      <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
                {product.rating && (
                  <div className="mt-1 flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}