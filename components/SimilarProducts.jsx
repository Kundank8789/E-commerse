'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function SimilarProducts({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      let newItemsPerView;
      if (window.innerWidth < 480) newItemsPerView = 2;
      else if (window.innerWidth < 768) newItemsPerView = 2;
      else if (window.innerWidth < 1024) newItemsPerView = 3;
      else if (window.innerWidth < 1280) newItemsPerView = 4;
      else newItemsPerView = 6;

      if (newItemsPerView !== itemsPerView) {
        setItemsPerView(newItemsPerView);
        setCurrentSlide(0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/products/similar/${productId}?limit=16`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch similar products');
        }
        
        const data = await response.json();
        
        // ✅ Log to see what's being returned
        console.log('📦 API returned products:', data.length);
        console.log('📦 First product:', data[0]?.name);
        
        let productsData = Array.isArray(data) ? data : (data.products || data.data || []);
        
        // ✅ If less than 16, duplicate to reach 16
        if (productsData.length < 16 && productsData.length > 0) {
          console.log('🔄 Duplicating products to reach 16');
          const duplicated = [];
          while (duplicated.length < 16) {
            for (const product of productsData) {
              if (duplicated.length < 16) {
                // Create a copy with a unique key
                duplicated.push({
                  ...product,
                  _id: product._id + '_dup_' + duplicated.length
                });
              }
            }
          }
          productsData = duplicated;
        }
        
        console.log('📦 Final products count:', productsData.length);
        setProducts(productsData);
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

  // Group products into pages
  const totalPages = Math.ceil(products.length / itemsPerView);
  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(products.slice(i * itemsPerView, (i + 1) * itemsPerView));
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-sm md:text-base font-semibold mb-3 text-gray-800">You Might Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5 md:gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded"></div>
              <div className="mt-1.5 h-2.5 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-1 h-2.5 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-center py-3">
        <p className="text-gray-500 text-xs">Unable to load similar products</p>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 md:mt-8 relative">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h2 className="text-sm md:text-base font-semibold text-gray-800">You Might Also Like</h2>
        <Link 
          href="/products" 
          className="text-blue-600 hover:text-blue-800 text-[10px] md:text-xs font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${totalPages * 100}%`
          }}
        >
          {pages.map((page, pageIndex) => (
            <div 
              key={pageIndex} 
              className="flex gap-1 md:gap-2"
              style={{ width: `${100 / totalPages}%` }}
            >
              {page.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="flex-shrink-0 group"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="bg-white rounded hover:shadow transition-shadow duration-200 border border-gray-200 hover:border-blue-300 overflow-hidden">
                    <div className="relative bg-gray-50 aspect-square">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-contain group-hover:scale-105 transition-transform duration-300 p-1.5"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-[8px]">
                          No Image
                        </div>
                      )}
                      {product.mrp && product.mrp > product.price && (
                        <div className="absolute top-0.5 left-0.5 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-1.5 md:p-2">
                      <h3 className="font-medium text-[10px] md:text-xs text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[24px] md:min-h-[32px]">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] md:text-xs font-bold text-gray-900">
                          ₹{product.price.toFixed(2)}
                        </span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-[7px] md:text-[9px] text-gray-400 line-through">
                            ₹{product.mrp.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {product.categories && product.categories.length > 0 && (
                        <div className="mt-0.5 flex flex-wrap gap-0.5">
                          {product.categories.slice(0, 1).map((cat, idx) => (
                            <span key={idx} className="text-[6px] md:text-[8px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      {product.rating && (
                        <div className="mt-0.5 flex items-center">
                          <Star className="h-2 w-2 md:h-2.5 md:w-2.5 text-yellow-400 fill-current" />
                          <span className="text-[8px] md:text-[10px] text-gray-600 ml-0.5">{product.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {totalPages > 1 && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-r-lg p-1 transition-all duration-200 ${
                currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide >= totalPages - 1}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-l-lg p-1 transition-all duration-200 ${
                currentSlide >= totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
              aria-label="Next"
            >
              <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Dots indicator */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 md:gap-1.5 mt-2 md:mt-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 md:h-1.5 transition-all duration-200 rounded-full ${
                currentSlide === index 
                  ? 'w-4 md:w-6 bg-blue-600' 
                  : 'w-1 md:w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}