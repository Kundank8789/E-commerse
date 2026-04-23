"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "../../../../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-white text-center py-20">Loading...</p>;
  }

  if (!product) {
    return <p className="text-red-500 text-center py-20">Product not found</p>;
  }

  return (
    <section className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        {/* Image */}
        <div className="relative w-full h-[400px] md:h-[500px] bg-gray-900 rounded-2xl overflow-hidden">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name || "product"}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-400 mt-4">
            {product.description || "No description available"}
          </p>

          <p className="text-2xl font-semibold mt-6">
            ₹{product.price}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-6">
            <span>Qty:</span>
            <button
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 bg-gray-700 rounded"
            >
              -
            </button>
            <span>{qty}</span>
            <button
              onClick={() => setQty((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-700 rounded"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(product, qty)}
            className="mt-8 w-full bg-white text-black py-3 rounded-full font-semibold 
            hover:bg-black hover:text-white border border-white transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}