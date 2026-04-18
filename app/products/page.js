"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // 🔥 FETCH PRODUCTS
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  // 🔥 FETCH CATEGORIES
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // 🔥 FILTERED PRODUCTS
  const filteredProducts = products.filter((p) => {
    if (!p.categoryCategory) return true;

    // ✅ handle both populated + non-populated
    return (
      p.category?._id === selectedCategory ||
      p.category === selectedCategory
    );
  });

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10">

      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Explore Products
        </h1>

        <p className="text-gray-400 text-sm">
          {filteredProducts.length} items
        </p>
      </div>

      {/* ✅ CATEGORY FILTER */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="mb-6 p-2 bg-black border text-white"
      >
        <option value="">All Categories</option>

        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* 🧱 Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          No products found 😔
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}