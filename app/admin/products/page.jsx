"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sort, setSort] = useState("default");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
    if (p.stock === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-800", icon: "❌" };
    if (p.stock < (p.lowStockThreshold || 10)) return { text: "Low Stock", color: "bg-orange-100 text-orange-800", icon: "⚠️" };
    return { text: "In Stock", color: "bg-green-100 text-green-800", icon: "✅" };
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return { text: 'Active', color: 'bg-green-100 text-green-800', icon: '🟢' };
      case 'draft':
        return { text: 'Draft', color: 'bg-yellow-100 text-yellow-800', icon: '📝' };
      case 'archived':
        return { text: 'Archived', color: 'bg-gray-100 text-gray-800', icon: '📦' };
      default:
        return { text: 'Active', color: 'bg-green-100 text-green-800', icon: '🟢' };
    }
  };

  // Filter logic
  let filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "all" || 
      p.category?._id === selectedCategory || 
      p.categories?.some((c) => c._id === selectedCategory);
    const matchStatus = selectedStatus === "all" || p.status === selectedStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  // Sorting
  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === "stock-low") {
    filtered.sort((a, b) => a.stock - b.stock);
  } else if (sort === "stock-high") {
    filtered.sort((a, b) => b.stock - a.stock);
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filtered.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedStatus, sort]);

  const activeCount = products.filter(p => p.status === 'active').length;
  const draftCount = products.filter(p => p.status === 'draft').length;
  const archivedCount = products.filter(p => p.status === 'archived').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
            <p className="text-gray-500 mt-1">Manage your product inventory</p>
          </div>
          <Link href="/admin/products/new">
            <button className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition duration-200 flex items-center gap-2 shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="text-sm text-gray-500">Total Products</div>
            <div className="text-2xl font-bold text-gray-800">{products.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="text-sm text-gray-500">Active Products</div>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="text-sm text-gray-500">Draft Products</div>
            <div className="text-2xl font-bold text-yellow-600">{draftCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
            <div className="text-sm text-gray-500">Archived Products</div>
            <div className="text-2xl font-bold text-gray-600">{archivedCount}</div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
            >
              <option value="all">📂 All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id} className="text-gray-900">
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Sort by Price */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
            >
              <option value="default" className="text-gray-900">📊 Sort By: Default</option>
              <option value="low" className="text-gray-900">💰 Price: Low to High</option>
              <option value="high" className="text-gray-900">💰 Price: High to Low</option>
              <option value="name-asc" className="text-gray-900">📝 Name: A to Z</option>
              <option value="name-desc" className="text-gray-900">📝 Name: Z to A</option>
              <option value="stock-low" className="text-gray-900">📦 Stock: Low to High</option>
              <option value="stock-high" className="text-gray-900">📦 Stock: High to Low</option>
            </select>

            {/* Items Per Page */}
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
            >
              <option value={5} className="text-gray-900">Show 5 per page</option>
              <option value={10} className="text-gray-900">Show 10 per page</option>
              <option value={20} className="text-gray-900">Show 20 per page</option>
              <option value={50} className="text-gray-900">Show 50 per page</option>
            </select>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-200 ${
                selectedStatus === "all" 
                  ? "bg-black text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setSelectedStatus("active")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-200 flex items-center gap-1 ${
                selectedStatus === "active" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              🟢 Active ({activeCount})
            </button>
            <button
              onClick={() => setSelectedStatus("draft")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-200 flex items-center gap-1 ${
                selectedStatus === "draft" 
                  ? "bg-yellow-600 text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              📝 Draft ({draftCount})
            </button>
            <button
              onClick={() => setSelectedStatus("archived")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-200 flex items-center gap-1 ${
                selectedStatus === "archived" 
                  ? "bg-gray-600 text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              📦 Archived ({archivedCount})
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">SKU</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      No products found
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((p) => {
                    const stockStatus = getStockStatus(p);
                    const statusBadge = getStatusBadge(p.status);
                    return (
                      <tr key={p._id} className="hover:bg-gray-50 transition duration-150">
                        {/* Image */}
                        <td className="px-4 py-3">
                          <div className="relative w-12 h-12">
                            {p.images?.filter(img => img?.startsWith("http"))[0] ? (
                              <Image
                                src={p.images.find(img => img?.startsWith("http"))}
                                alt={p.name}
                                fill
                                className="object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                No img
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{p.name}</div>
                          {p.description && (
                            <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                              {p.description.substring(0, 50)}...
                            </div>
                          )}
                        </td>

                        {/* SKU */}
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {p.sku || 'N/A'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-800">₹{p.price}</div>
                          {p.mrp && p.mrp > p.price && (
                            <div className="text-xs text-gray-400 line-through">₹{p.mrp}</div>
                          )}
                        </td>

                        {/* Stock with status */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.icon} {stockStatus.text}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{p.stock} units</div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">
                            {p.categories && p.categories.length > 0 
                              ? p.categories.map(c => c.name).join(', ')
                              : (p.category?.name || 'Uncategorized')}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                            {statusBadge.icon} {statusBadge.text}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link href={`/admin/products/edit/${p._id}`}>
                              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition duration-150 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                            </Link>
                            <button
                              onClick={() => deleteProduct(p._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition duration-150 flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} products
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded-lg transition flex items-center gap-1 ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg transition ${
                            currentPage === pageNum
                              ? 'bg-black text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1 border rounded-lg transition flex items-center gap-1 ${
                    currentPage === totalPages || totalPages === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}