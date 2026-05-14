// app/admin/products/new/page.jsx
"use client";

import ProductForm from "@/components/admin/ProductForm";

export default function AddProductPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm isEdit={false} />
    </div>
  );
}