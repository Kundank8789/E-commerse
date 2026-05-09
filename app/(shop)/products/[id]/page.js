"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

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

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }

    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <p className="text-lg font-medium animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">
          Product not found
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f8f8] py-16 px-4 md:px-8">

      {/* POPUP */}
      {showPopup && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle size={20} />
          Added to cart successfully
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* IMAGE SECTION */}
        <div className="relative bg-gray-100 flex items-center justify-center p-6">

          {/* STOCK BADGE */}
          <span className="absolute top-5 left-5 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
            In Stock
          </span>

          <div className="relative w-full h-[350px] md:h-[550px] group">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name || "product"}
                fill
                className="object-contain transition duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="p-8 md:p-12 flex flex-col justify-center">

          <p className="text-sm uppercase tracking-widest text-gray-500">
            Premium Collection
          </p>

          <h1 className="text-3xl md:text-5xl font-bold mt-3 leading-tight">
            {product.name}
          </h1>

          <p className="text-gray-600 mt-6 leading-relaxed">
            {product.description || "No description available"}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span className="text-4xl font-bold text-black">
              ₹{product.price}
            </span>

            <span className="line-through text-gray-400 text-lg">
              ₹{product.price + 500}
            </span>
          </div>

          {/* QUANTITY */}
          <div className="mt-10">
            <p className="font-medium mb-3">Quantity</p>

            <div className="flex items-center w-fit border border-gray-300 rounded-full overflow-hidden">

              <button
                onClick={() =>
                  setQty((prev) => Math.max(1, prev - 1))
                }
                className="px-5 py-3 text-xl hover:bg-gray-100 transition"
              >
                -
              </button>

              <span className="px-6 font-semibold text-lg">
                {qty}
              </span>

              <button
                onClick={() => setQty((prev) => prev + 1)}
                className="px-5 py-3 text-xl hover:bg-gray-100 transition"
              >
                +
              </button>

            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-4 rounded-full font-semibold text-lg 
              hover:scale-[1.02] hover:bg-gray-900 transition-all duration-300 shadow-lg"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                addToCart(product);
                router.push("/checkout");
              }}
              className="flex-1 border border-black py-4 rounded-full font-semibold text-lg
  hover:bg-black hover:text-white transition-all duration-300"
            >
              Buy Now
            </button>

          </div>

          {/* EXTRA INFO */}
          <div className="mt-10 border-t pt-6 text-sm text-gray-500 space-y-2">
            <p>🚚 Free shipping on orders above ₹999</p>
            <p>🔒 Secure payment & checkout</p>
            <p>↩ 7 Days easy return policy</p>
          </div>

        </div>
      </div>
    </section>
  );
}