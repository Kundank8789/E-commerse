"use client";

import { useState } from "react";
import Image from "next/image";

export default function CartPage() {

  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart")) || [];
    }
    return [];
  });

  const updateLocalStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    updateLocalStorage(updatedCart);
  };

  const increaseQty = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].qty += 1;
    updateLocalStorage(updatedCart);
  };

  const decreaseQty = (index) => {
    const updatedCart = [...cart];

    if (updatedCart[index].qty > 1) {
      updatedCart[index].qty -= 1;
    }

    updateLocalStorage(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-xl p-5 mb-4"
            >

              <div className="flex items-center gap-6">

                <Image
                  src={item.image}
                  width={80}
                  height={80}
                  alt={item.name}
                />

                <div>
                  <h2 className="font-semibold">
                    {item.name}
                  </h2>

                  <p>₹{item.price}</p>

                  <div className="flex gap-2 mt-2">

                    <button onClick={() => decreaseQty(index)}>
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button onClick={() => increaseQty(index)}>
                      +
                    </button>

                  </div>
                </div>

              </div>

              <button
                onClick={() => removeItem(index)}
                className="bg-red-500 text-white px-4 py-2"
              >
                Remove
              </button>

            </div>
          ))}

          <h2 className="text-xl font-bold mt-6">
            Total: ₹{total}
          </h2>
        </>
      )}
    </div>
  );
}