"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchCategories();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    fetchCategories();
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">Categories</h1>

      {/* ADD */}
      <form onSubmit={handleAdd} className="mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="p-2 border mr-2"
        />

        <button className="bg-blue-500 px-4 py-2">
          Add
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-2">
        {categories.map((c) => (
          <div
            key={c._id}
            className="flex justify-between bg-black p-3"
          >
            <p>{c.name}</p>

            <button
              onClick={() => handleDelete(c._id)}
              className="bg-red-500 px-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}