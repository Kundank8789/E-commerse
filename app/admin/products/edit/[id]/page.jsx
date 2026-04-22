"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const updateProduct = async () => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });

    alert("Updated!");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Edit Product</h1>

      <input
        name="name"
        value={product.name}
        onChange={handleChange}
        className="border p-2 block mb-2"
      />

      <input
        name="price"
        value={product.price}
        onChange={handleChange}
        className="border p-2 block mb-2"
      />

      <input
        name="stock"
        value={product.stock}
        onChange={handleChange}
        className="border p-2 block mb-2"
      />

      <button onClick={updateProduct} className="bg-black text-white px-4 py-2">
        Update
      </button>
    </div>
  );
}