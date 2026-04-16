"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "../../../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) {
    return <p className="text-white text-center py-20">Loading...</p>;
  }

  return (
    <section className="min-h-screen bg-black text-white py-20 px-6">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        {/* Image */}
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        {/* Info */}
        <div>

          <h1 className="text-3xl md:text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-400 mt-4">
            {product.description}
          </p>

          <p className="text-2xl font-semibold mt-6">
            ₹{product.price}
          </p>

          <button
            onClick={() => addToCart(product)}
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