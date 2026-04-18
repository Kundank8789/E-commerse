"use client";

import { useState, useEffect } from "react";

export default function ProductForm({ productId }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (productId) {
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name);
          setPrice(data.price);
        });
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = productId ? "PUT" : "POST";
    const url = productId
      ? `/api/products/${productId}`
      : "/api/products";

    await fetch(url, {
      method,
      body: JSON.stringify({ name, price }),
    });

    alert("Saved ✅");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 w-full"
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        {productId ? "Update" : "Create"} Product
      </button>
    </form>
  );
}