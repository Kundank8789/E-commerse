"use client";

import { useEffect, useState } from "react";

export default function CartPage() {

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart =
      JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        Your Cart
      </h1>

      {cart.length === 0 && (
        <p>Your cart is empty</p>
      )}

      {cart.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between border p-4 mb-4"
        >

          <div className="flex items-center gap-4">

            <img
              src={item.image}
              className="w-20 h-20 object-cover"
            />

            <div>
              <h2 className="font-semibold">
                {item.name}
              </h2>

              <p>₹{item.price}</p>
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

      <div className="mt-6 text-xl font-semibold">
        Total: ₹{total}
      </div>

      <button className="mt-6 bg-black text-white px-6 py-3">
        Checkout
      </button>

    </div>
  );
}