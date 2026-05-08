"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductSection({
  title,
  category,
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {

        // ✅ FILTER PRODUCTS BY CATEGORY
        const filtered = data.filter((p) =>
          p.categories?.some(
            (c) =>
              c.name?.toLowerCase() ===
              category.toLowerCase()
          )
        );

        // ✅ SHOW ONLY 4 PRODUCTS
        setProducts(filtered.slice(0, 4));
      });
  }, [category]);

  return (
    <section className="py-16 bg-white text-black">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between mb-10">

        <h2 className="text-3xl md:text-4xl font-bold">
          {title}
        </h2>

        <Link
          href="/products"
          className="group flex items-center gap-2 border border-black px-4 py-2 rounded-full text-sm md:text-base font-medium hover:bg-black hover:text-white transition-all duration-300"
        >
          See More

          <span className="group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </Link>

      </div>

      {/* PRODUCTS */}
      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

        {products.map((product) => (

          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="group"
          >

            {/* CARD */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">

              {/* IMAGE */}
              <div className="relative h-[160px] sm:h-[220px] md:h-64 overflow-hidden bg-gray-100">

                <Image
                  src={
                    product.images &&
                      product.images.length > 0
                      ? product.images[0]
                      : "/placeholder.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* INFO */}
              <div className="p-3 sm:p-4">

                <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  ₹{product.price}
                </p>

              </div>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}