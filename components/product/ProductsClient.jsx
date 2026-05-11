"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import { FiSearch, FiSliders } from "react-icons/fi";

export default function ProductsClient() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "default";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : data.products || []));
      

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : data.categories || []));
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
  };

  let filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "all" ||
      p.category?._id === selectedCategory ||
      p.categories?.some((c) => c._id === selectedCategory);
    return matchSearch && matchCategory;
  });

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-white text-black">

      {/* PAGE HEADER */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 md:px-12 py-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-1">
          Explore Products
        </h1>
        <p className="text-gray-500 text-sm">
          {filtered.length} items found
        </p>
      </div>

      <div className="px-6 md:px-12 py-8">

        {/* SEARCH + SORT ROW */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          {/* SEARCH BAR */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateURL({ search: e.target.value })}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
            />
          </div>

          {/* SORT DROPDOWN */}
          <div className="relative">
            <FiSliders className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={sort}
              onChange={(e) => updateURL({ sort: e.target.value })}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-full bg-gray-50 text-black appearance-none focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition cursor-pointer"
            >
              <option value="default">Sort By</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* CATEGORY PILLS */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => updateURL({ category: "all" })}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
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
              className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                selectedCategory === cat._id
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-gray-100 mb-8" />

        {/* PRODUCT GRID */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-5xl mb-4">😔</p>
            <p className="text-gray-400 text-lg">No products found</p>
            <button
              onClick={() => updateURL({ search: "", category: "all" })}
              className="mt-4 px-6 py-2 bg-black text-white rounded-full text-sm hover:bg-yellow-600 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex gap-2 mt-12 justify-center">
            {/* PREV */}
            <button
              onClick={() => updateURL({ page: page - 1 })}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-200 rounded-full text-sm hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>

            {/* PAGE NUMBERS */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => updateURL({ page: pNum })}
                className={`w-9 h-9 rounded-full text-sm font-medium border transition ${
                  page === pNum
                    ? "bg-black text-white border-black"
                    : "border-gray-200 hover:border-black"
                }`}
              >
                {pNum}
              </button>
            ))}

            {/* NEXT */}
            <button
              onClick={() => updateURL({ page: page + 1 })}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-full text-sm hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}