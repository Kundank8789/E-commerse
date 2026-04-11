"use client";

import { useParams } from "next/navigation";

export default function ProductDetails() {

  const { id } = useParams();

  const product = {
    id: id,
    name: "Nike Running Shoes",
    price: 3999,
    description: "Comfortable running shoes for everyday use",
    image: "/shoe.jpg"
  };

  return (
    <div className="max-w-6xl mx-auto p-10 grid grid-cols-2 gap-10">

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full rounded"
      />

      {/* Product Info */}
      <div>

        <h1 className="text-3xl font-bold mb-4">
          {product.name}
        </h1>

        <p className="text-xl text-gray-700 mb-4">
          ₹{product.price}
        </p>

        <p className="mb-6">
          {product.description}
        </p>

        {/* Quantity */}
        <div className="mb-6">

          <label className="block mb-2">
            Quantity
          </label>

          <input
            type="number"
            defaultValue={1}
            className="border p-2 w-20"
          />

        </div>

        {/* Add to Cart */}
        <button className="bg-black text-white px-6 py-3 rounded">
          Add to Cart
        </button>

      </div>

    </div>
  );
}