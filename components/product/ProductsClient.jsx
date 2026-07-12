"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";

export default function ProductsClient() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "default";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const productsData = Array.isArray(data) ? data : data.products || [];
        console.log("📦 Products loaded:", productsData.length);
        console.log("📦 Sample product:", productsData[0]);
        setProducts(productsData);
      })
      .catch((error) => console.error("Error fetching products:", error));

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const categoriesData = Array.isArray(data) ? data : data.categories || [];
        console.log("📂 Categories loaded:", categoriesData.length);
        setCategories(categoriesData);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const updateURL = (params) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (!value || value === "all" || value === "default") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    if (params.search || params.category || params.sort) {
      newParams.set("page", "1");
    }
    router.push(`/products?${newParams.toString()}`);
    setIsFilterOpen(false);
  };

  // ✅ DEBUG: Log products before filtering
  console.log("🔍 Total products:", products.length);
  console.log("🔍 Selected category:", selectedCategory);

  // ✅ FIX: Simple filtering - only search filter for now
  let filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    // ✅ Temporarily disable category filter to debug
    return matchSearch;
  });

  // ✅ If you want to enable category filter, uncomment this:
  /*
  let filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    
    let matchCategory = selectedCategory === "all";
    
    if (!matchCategory && p.category) {
      if (typeof p.category === 'string') {
        matchCategory = p.category === selectedCategory;
      } else if (p.category._id) {
        matchCategory = p.category._id === selectedCategory;
      }
    }
    
    if (!matchCategory && p.categories && Array.isArray(p.categories)) {
      matchCategory = p.categories.some((c) => {
        if (typeof c === 'string') return c === selectedCategory;
        if (c._id) return c._id === selectedCategory;
        return false;
      });
    }
    
    return matchSearch && matchCategory;
  });
  */

  console.log("🔍 Filtered products:", filtered.length);

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  const ITEMS_PER_PAGE = 16;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  console.log("📄 Paginated products:", paginatedProducts.length);

  return (
    <div className="min-h-screen bg-white text-black">

      {/* PAGE HEADER - Mobile Optimized */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-10">
        <h1 className="text-xl sm:text-2xl md:text-5xl font-bold tracking-tight mb-0.5 md:mb-1">
          Explore Products
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          {filtered.length} items found
        </p>
      </div>

      <div className="px-2 sm:px-4 md:px-6 lg:px-12 py-3 md:py-8">

        {/* SEARCH + SORT ROW - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3 md:mb-8">
          {/* SEARCH BAR */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-lg" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateURL({ search: e.target.value })}
              placeholder="Search products..."
              className="w-full pl-8 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-xs sm:text-base border border-gray-200 rounded-full bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
            />
          </div>

          {/* SORT DROPDOWN - Mobile Optimized */}
          <div className="relative flex-shrink-0 w-full sm:w-auto">
            <FiSliders className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-lg" />
            <select
              value={sort}
              onChange={(e) => updateURL({ sort: e.target.value })}
              className="w-full sm:w-auto pl-8 sm:pl-10 pr-7 sm:pr-8 py-2 sm:py-3 text-xs sm:text-base border border-gray-200 rounded-full bg-gray-50 text-black appearance-none focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition cursor-pointer"
            >
              <option value="default">Sort By</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* CATEGORY PILLS - Mobile Optimized with Scroll */}
        <div className="flex items-center gap-2 mb-3 md:mb-8">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 flex-1 hide-scrollbar">
            <button
              onClick={() => updateURL({ category: "all" })}
              className={`px-2.5 sm:px-5 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium border transition whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
              }`}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateURL({ category: cat._id })}
                className={`px-2.5 sm:px-5 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium border transition whitespace-nowrap ${
                  selectedCategory === cat._id
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Filter Toggle for Mobile */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex-shrink-0 px-2.5 py-1 bg-black text-white rounded-full text-[10px] font-medium"
          >
            {isFilterOpen ? '✕' : 'Filter'}
          </button>
        </div>

        {/* Mobile Filter Panel */}
        {isFilterOpen && (
          <div className="md:hidden mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)} className="text-gray-500">
                <FiX className="text-lg" />
              </button>
            </div>
            
            {/* Sort options on mobile */}
            <div className="mb-2">
              <label className="text-xs text-gray-500 block mb-1">Sort By</label>
              <select
                value={sort}
                onChange={(e) => updateURL({ sort: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              >
                <option value="default">Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
            
            <button
              onClick={() => updateURL({ search: "", category: "all", sort: "default" })}
              className="w-full py-2 bg-gray-200 text-black rounded-lg text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* DIVIDER */}
        <div className="w-full h-px bg-gray-100 mb-4 md:mb-8" />

        {/* PRODUCT GRID - Mobile Optimized with 2 columns */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-32">
            <p className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-4">😔</p>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">No products found</p>
            <button
              onClick={() => updateURL({ search: "", category: "all" })}
              className="mt-3 px-4 sm:px-6 py-1.5 sm:py-2.5 bg-black text-white rounded-full text-xs sm:text-sm hover:bg-yellow-600 transition active:scale-95"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3 md:gap-4 lg:gap-6">
            {paginatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {/* PAGINATION - Mobile Optimized */}
        {totalPages > 1 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-6 sm:mt-8 md:mt-12 justify-center">
            {/* PREV */}
            <button
              onClick={() => updateURL({ page: page - 1 })}
              disabled={page === 1}
              className="px-2.5 sm:px-4 py-1 sm:py-2 border border-gray-200 rounded-full text-[10px] sm:text-sm hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>

            {/* PAGE NUMBERS */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(pNum => {
                if (totalPages <= 7) return true;
                if (pNum === 1 || pNum === totalPages) return true;
                if (Math.abs(pNum - page) <= 1) return true;
                return false;
              })
              .map((pNum, index, array) => {
                if (index > 0 && array[index - 1] !== pNum - 1) {
                  return (
                    <span key={`ellipsis-${pNum}`} className="w-6 sm:w-9 h-6 sm:h-9 flex items-center justify-center text-[10px] sm:text-sm text-gray-400">
                      …
                    </span>
                  );
                }
                return (
                  <button
                    key={pNum}
                    onClick={() => updateURL({ page: pNum })}
                    className={`w-6 sm:w-9 h-6 sm:h-9 rounded-full text-[10px] sm:text-sm font-medium border transition ${
                      page === pNum
                        ? "bg-black text-white border-black"
                        : "border-gray-200 hover:border-black"
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

            {/* NEXT */}
            <button
              onClick={() => updateURL({ page: page + 1 })}
              disabled={page === totalPages}
              className="px-2.5 sm:px-4 py-1 sm:py-2 border border-gray-200 rounded-full text-[10px] sm:text-sm hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}

      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}