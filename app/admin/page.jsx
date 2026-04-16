"use client";

import { useEffect, useState } from "react";
import AdminForm from "@/components/admin/AdminForm";
import ProductCard from "@/components/admin/ProductCard";

export default function AdminPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔥 Fetch products
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Add / Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editId
        ? `/api/products/${editId}`
        : "/api/products";

      const method = editId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      // Reset form
      setForm({
        name: "",
        price: "",
        image: "",
        description: "",
      });

      setEditId(null);
      fetchProducts();

    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  // 🔥 Delete product
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  };

  // 🔥 Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
    });

    setEditId(product._id);

    // optional UX improvement
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-neutral-900 text-white py-20 px-6 animate-fadeIn">

      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-10 text-center tracking-wide">
          Admin Dashboard
        </h1>

        {/* 🔥 FORM COMPONENT */}
        <AdminForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          editId={editId}
        />

        {/* 🔥 PRODUCT LIST */}
        <div>

          <h2 className="text-2xl font-semibold mb-6">
            All Products
          </h2>

          {products.length === 0 ? (
            <p className="text-gray-400">No products found</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">

              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))}

            </div>
          )}

        </div>

      </div>

    </section>
  );
}