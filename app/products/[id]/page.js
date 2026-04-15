"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { FaStar, FaShoppingCart } from "react-icons/fa";

export default function ProductDetails() {

  const { id } = useParams();

  const product = {
    id: id,
    name: "Nike Running Shoes",
    price: 3999,
    oldPrice: 4999,
    rating: 4,
    description:
      "Comfortable running shoes designed for everyday performance and long-lasting comfort.",
    image: "/shoes.jpg"
  };

  const addToCart = (product) => {

    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {

      // Increase quantity if product already exists
      existingProduct.qty += 1;

    } else {

      // Add new product
      existingCart.push({
        ...product,
        qty: 1,
      });

    }

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    alert("Product added to cart!");
  };

  return (
    <div className="bg-black text-white min-h-screen py-16">

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

        <div className="bg-gray-900 p-6 rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={400}
            className="w-full rounded-lg object-cover"
          />
        </div>

        <div>

          <h1 className="text-4xl font-bold mb-4">
            {product.name}
          </h1>

          <div className="flex gap-1 mb-4">
            {[...Array(product.rating)].map((_, i) => (
              <FaStar key={i} size={18} color="yellow" />
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <p className="text-3xl font-semibold">
              ₹{product.price}
            </p>

            <span className="text-gray-400 line-through">
              ₹{product.oldPrice}
            </span>

            <span className="bg-red-600 px-2 py-1 text-sm rounded">
              20% OFF
            </span>
          </div>

          <p className="text-gray-300 mb-6">
            {product.description}
          </p>

          <div className="mb-6">
            <label className="block mb-2 text-gray-400">
              Quantity
            </label>

            <input
              type="number"
              defaultValue={1}
              className="bg-gray-900 border border-gray-700 px-3 py-2 w-20 rounded"
            />
          </div>

          <div className="flex gap-4 mt-4">

            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
                <FaShoppingCart size={18} />
              Add to Cart
            </button>

            <button className="border border-gray-500 text-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition font-semibold">
              Buy Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}