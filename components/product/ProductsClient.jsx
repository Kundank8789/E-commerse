"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProductsClient() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "default";
  const page = Number(searchParams.get("page")) || 1;

  // FETCH DATA
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);

    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // UPDATE URL
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

  // FILTER
  let filtered = products.filter((p) => {
    const matchSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "all" ||
      p.category?._id === selectedCategory ||
      p.categories?.some((c) => c._id === selectedCategory);

    return matchSearch && matchCategory;
  });

  // SORT
  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  // PAGINATION
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedProducts = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Explore Products</h1>
        <p className="text-gray-400 text-sm">{filtered.length} items</p>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        value={search}
        onChange={(e) => updateURL({ search: e.target.value })}
        placeholder="Search..."
        className="border p-2 w-full mb-4 bg-black text-white"
      />

      {/* CATEGORY */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => updateURL({ category: "all" })}
          className={`px-3 py-1 border ${
            selectedCategory === "all" ? "bg-white text-black" : ""
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => updateURL({ category: cat._id })}
            className={`px-3 py-1 border ${
              selectedCategory === cat._id ? "bg-white text-black" : ""
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* SORT */}
      <select
        value={sort}
        onChange={(e) => updateURL({ sort: e.target.value })}
        className="border p-2 mb-6 bg-black text-white"
      >
        <option value="default">Sort</option>
        <option value="low">Low to High</option>
        <option value="high">High to Low</option>
      </select>

      {/* GRID */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          No products found 😔
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex gap-2 mt-8 justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pNum) => (
            <button
              key={pNum}
              onClick={() => updateURL({ page: pNum })}
              className={`px-3 py-1 border ${
                page === pNum ? "bg-white text-black" : ""
              }`}
            >
              {pNum}
            </button>
          )
        )}
      </div>
    </div>
  );
}