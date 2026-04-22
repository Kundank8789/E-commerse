"use client";

import { useEffect, useState } from "react";

export default function CategoryPage() {
  const [name, setName] = useState("");
  const [bulk, setBulk] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    setName("");
    fetchCategories();
  };

  const bulkAdd = async () => {
    const list = bulk.split(",").map(c => c.trim());

    await fetch("/api/categories/bulk", {
      method: "POST",
      body: JSON.stringify(list),
    });

    setBulk("");
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      {/* Single */}
      <div className="mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Category"
          className="border p-2"
        />
        <button onClick={addCategory} className="ml-2 bg-black text-white px-3 py-2">
          Add
        </button>
      </div>

      {/* Bulk */}
      <div className="mb-6">
        <input
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          placeholder="Bulk (Shoes, Clothes, Electronics)"
          className="border p-2 w-80"
        />
        <button onClick={bulkAdd} className="ml-2 bg-blue-500 text-white px-3 py-2">
          Bulk Add
        </button>
      </div>

      {/* List */}
      <ul>
        {categories.map(cat => (
          <li key={cat._id} className="flex justify-between border-b py-2">
            {cat.name}
            <button
              onClick={() => deleteCategory(cat._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}