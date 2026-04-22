"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);

    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });

    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const getStockStatus = (p) => {
    if (p.stock === 0) return "❌ Out of Stock";
    if (p.stock < p.lowStockThreshold) return "⚠️ Low Stock";
    return "✅ In Stock";
  };

  // 🔥 FILTER LOGIC
  let filtered = products.filter((p) => {
    const matchSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "all" ||
      p.category?._id === selectedCategory || // ✅ single category
      p.categories?.some((c) => c._id === selectedCategory); // ✅ if array

    return matchSearch && matchCategory;
  });

  // 🔥 SORTING
  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>

      <Link href="/admin/products/new">
        <button className="mb-4 bg-black text-white px-4 py-2">
          + Add Product
        </button>
      </Link>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {/* 🏷 CATEGORY FILTER */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1 border ${
            selectedCategory === "all" ? "bg-black text-white" : ""
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`px-3 py-1 border ${
              selectedCategory === cat._id ? "bg-black text-white" : ""
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 🔽 SORT */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="default">Sort By</option>
        <option value="low">Price: Low to High</option>
        <option value="high">Price: High to Low</option>
      </select>

      {/* 📦 TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((p) => (
            <tr key={p._id} className="border-t text-center">
              
              {/* IMAGE */}
              <td>
                <div className="relative w-12 h-12 mx-auto">
                  {(() => {
                    const validImages = (p.images || []).filter(
                      (img) =>
                        typeof img === "string" &&
                        img.startsWith("http")
                    );

                    if (validImages.length > 0) {
                      return (
                        <Image
                          src={validImages[0]}
                          alt={p.name || "product"}
                          fill
                          className="object-cover"
                        />
                      );
                    }

                    return (
                      <div className="flex items-center justify-center h-full bg-gray-200 text-sm">
                        No Image
                      </div>
                    );
                  })()}
                </div>
              </td>

              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>{getStockStatus(p)}</td>

              <td className="space-x-2">
                <Link href={`/admin/products/edit/${p._id}`}>
                  <button className="bg-blue-500 text-white px-2 py-1">
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => deleteProduct(p._id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}