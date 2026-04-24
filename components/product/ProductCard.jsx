"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  return (
    <div className="group bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:scale-105 transition duration-300">

      {/* IMAGE + LINK */}
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative w-full h-52 overflow-hidden rounded-xl mb-4">

          {product?.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs">
              No Image
            </div>
          )}

          {/* CATEGORY */}
          {product?.category?.name && (
            <span className="absolute top-2 left-2 bg-black/70 text-xs px-2 py-1 rounded">
              {product.category.name}
            </span>
          )}
        </div>
      </Link>

      {/* INFO */}
      <h2 className="text-lg font-semibold line-clamp-1">
        {product.name}
      </h2>

      <p className="text-gray-400 text-sm mb-2">
        ₹{product.price}
      </p>

      {/* BUTTON */}
      <button
        onClick={() => {
          addToCart(product);
          toast.success("Added to cart 🛒");
          router.push("/cart"); // 🔥 redirect
        }}
        className="mt-auto w-full bg-white text-black py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
      >
        Add to Cart
      </button>

    </div>
  );
}