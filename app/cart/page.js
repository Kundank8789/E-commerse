"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function CartPage() {
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

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const items = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
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
    <section className="bg-black text-white min-h-screen py-16 px-6">

      <h1 className="text-4xl font-bold text-center mb-10">
        Your Cart 🛒
      </h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400">Your cart is empty</p>
          <Link
            href="/products"
            className="mt-4 inline-block bg-white text-black px-6 py-2 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">

            {cart.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 bg-gray-900 p-4 rounded-xl items-center"
              >

                {/* IMAGE */}
                {item.images?.[0] ? (
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] bg-gray-700 flex items-center justify-center text-xs rounded-lg">
                    No Image
                  </div>
                )}

                {/* INFO */}
                <div className="flex-1">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-400 text-sm">₹{item.price}</p>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3 mt-3">

                    <button
                      onClick={() => decreaseQty(item)}
                      className="bg-gray-700 px-3 py-1 rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => {
                        addToCart(item);
                        toast.success("Quantity updated 🛒");
                      }}
                      className="bg-gray-700 px-3 py-1 rounded"
                    >
                      +
                    </button>

                  </div>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => {
                    removeFromCart(item);
                    toast.success("Removed from cart");
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>

              </div>
            ))}

          </div>

          {/* RIGHT */}
          <div className="bg-gray-900 p-6 rounded-xl h-fit">

            <h2 className="text-xl font-semibold mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Total Price</span>
              <span className="font-bold">₹{total}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              {loading ? "Placing Order..." : "Checkout"}
            </button>

          </div>

        </div>
      )}
    </section>
  );
}