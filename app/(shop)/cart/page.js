"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    addToCart,
    decreaseQty,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const totalItems = cart.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  // ✅ Get variation display text
  const getVariationText = (item) => {
    const parts = [];
    if (item.selectedSize) parts.push(`Size: ${item.selectedSize}`);
    if (item.selectedColor) parts.push(`Color: ${item.selectedColor}`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const items = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        selectedSize: item.selectedSize || '',
        selectedColor: item.selectedColor || '',
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, total }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Order failed");

      toast.success("Order placed 🎉");

      clearCart();
      window.location.href = "/order-success";

    } catch (error) {
      console.error(error);
      toast.error("❌ Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white text-black min-h-screen py-4 sm:py-8 md:py-16 px-3 sm:px-4 md:px-6">
      {/* Back Button - Mobile */}
      <button
        onClick={() => router.back()}
        className="md:hidden flex items-center gap-2 text-gray-600 mb-4 hover:text-black transition"
      >
        <FaArrowLeft className="text-sm" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-10">
        Your Cart 🛒
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-8 sm:py-12 md:py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-base sm:text-lg">Your cart is empty</p>
          <p className="text-gray-300 text-xs sm:text-sm mt-1">Start adding some items!</p>
          <Link
            href="/products"
            className="mt-4 inline-block bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition active:scale-95"
          >
            Continue Shopping →
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* LEFT - Cart Items */}
          <div className="md:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Mobile Summary Card */}
            <div className="md:hidden bg-gray-50 border border-gray-200 p-4 rounded-xl mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Total Items</p>
                  <p className="text-lg font-bold">{totalItems}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Price</p>
                  <p className="text-lg font-bold">₹{total}</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/checkout")}
                className="w-full mt-3 bg-black text-white py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 active:scale-95 text-sm"
              >
                Proceed to Checkout
              </button>
            </div>

            {cart.map((item, index) => {
              const variationText = getVariationText(item);
              
              return (
                <div
                  key={index}
                  className="flex gap-3 sm:gap-4 bg-white border border-gray-200 shadow-sm p-3 sm:p-4 rounded-xl md:rounded-2xl items-center hover:shadow-md transition"
                >
                  {/* IMAGE - Mobile Optimized */}
                  <div className="flex-shrink-0">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] rounded-lg md:rounded-xl object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] bg-gray-200 flex items-center justify-center text-xs rounded-lg">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm sm:text-base line-clamp-1">
                      {item.name}
                    </h2>
                    
                    {/* Variation Details */}
                    {variationText && (
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 bg-gray-50 px-2 py-0.5 sm:py-1 rounded inline-block">
                        {variationText}
                      </p>
                    )}
                    
                    <p className="text-gray-600 text-sm sm:text-base font-medium mt-0.5 sm:mt-1">
                      ₹{item.price}
                    </p>

                    {/* QUANTITY - Mobile Optimized */}
                    <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                      <button
                        onClick={() => decreaseQty(item)}
                        className="bg-gray-100 hover:bg-gray-200 w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition flex items-center justify-center text-sm sm:text-base active:scale-95"
                      >
                        -
                      </button>

                      <span className="font-semibold min-w-[20px] text-center text-sm sm:text-base">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          addToCart(item);
                          toast.success("Quantity updated 🛒");
                        }}
                        className="bg-gray-100 hover:bg-gray-200 w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition flex items-center justify-center text-sm sm:text-base active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* REMOVE - Mobile Optimized */}
                  <button
                    onClick={() => {
                      removeFromCart(item);
                      toast.success("Removed from cart");
                    }}
                    className="text-red-500 hover:text-red-700 transition cursor-pointer p-2 active:scale-90"
                    aria-label="Remove item"
                  >
                    <FaTrash className="text-sm sm:text-base" />
                  </button>
                </div>
              );
            })}

            {/* Clear Cart - Mobile */}
            {cart.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your cart?")) {
                      clearCart();
                      toast.success("Cart cleared");
                    }
                  }}
                  className="text-red-500 text-xs sm:text-sm hover:text-red-700 transition px-3 py-1.5 border border-red-200 rounded-full hover:border-red-400 active:scale-95"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* RIGHT - Order Summary (Desktop only) */}
          <div className="hidden md:block bg-white border border-gray-200 shadow-sm p-6 rounded-2xl h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-4">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Items</span>
                <span className="font-medium">{totalItems}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{total}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 active:scale-95"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => router.push("/products")}
              className="w-full mt-3 border border-gray-300 text-gray-600 py-2.5 rounded-xl font-medium hover:border-black hover:text-black transition-all duration-300 text-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </section>
  );
}