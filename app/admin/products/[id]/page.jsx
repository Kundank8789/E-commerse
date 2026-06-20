"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/products/${id}`, {
          credentials: "include"
        });
        
        if (!res.ok) {
          throw new Error("Product not found");
        }
        
        const data = await res.json();
        const productData = data.product || data;
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="text-gray-600 mt-2">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-center py-10 bg-red-50 rounded-lg">
          <p className="text-red-600">{error || "Product not found"}</p>
          <Link href="/admin/products">
            <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm isEdit={true} existingProduct={product} />
    </div>
  );
}