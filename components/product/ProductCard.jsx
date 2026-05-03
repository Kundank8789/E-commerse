"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const { addToWishlist, wishlist } = useWishlist();

  // 🔥 normalize product (IMPORTANT)
  const normalizedProduct = {
    ...product,
    _id: product._id || product.id,
    images: product.images || (product.image ? [product.image] : []),
    category: product.category || { name: "General" },
  };

  // ✅ check if already in wishlist
  const isInWishlist = wishlist?.some(
    (item) =>
      (item._id || item.id)?.toString() ===
      normalizedProduct._id?.toString()
  );

  return (
    <div className="group bg-white p-4 rounded-2xl border hover:shadow-lg transition duration-300">

      {/* IMAGE + LINK */}
      <Link href={`/products/${normalizedProduct._id}`} className="block">
        <div className="relative w-full h-52 overflow-hidden rounded-xl mb-4">

          {/* ❤️ WISHLIST BUTTON */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToWishlist(normalizedProduct);
              toast.success("Added to wishlist ❤️");
            }}
            className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow hover:bg-red-100 transition"
          >
            <FaHeart
              className={`transition ${
                isInWishlist
                  ? "text-red-500 scale-110"
                  : "text-gray-400"
              }`}
            />
          </button>

          {/* IMAGE */}
          {normalizedProduct?.images?.[0] ? (
            <Image
              src={normalizedProduct.images[0]}
              alt={normalizedProduct.name}
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
              No Image
            </div>
          )}

          {/* CATEGORY */}
          {normalizedProduct?.category?.name && (
            <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
              {normalizedProduct.category.name}
            </span>
          )}
        </div>
      </Link>

      {/* INFO */}
      <h2 className="text-lg font-semibold line-clamp-1">
        {normalizedProduct.name}
      </h2>

      <p className="text-gray-600 text-sm mb-2">
        ₹{normalizedProduct.price}
      </p>

      {/* BUTTON */}
      <button
        onClick={() => {
          addToCart(normalizedProduct);
          toast.success("Added to cart 🛒");
          router.push("/cart");
        }}
        className="mt-auto w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
      >
        Add to Cart
      </button>

    </div>
  );
}