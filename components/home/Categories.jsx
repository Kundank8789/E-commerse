"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);

    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  // 🔥 Get image from products
  const getCategoryImage = (categoryId) => {
    const product = products.find(
      (p) =>
        p.category?._id === categoryId ||
        p.categories?.some((c) => c._id === categoryId)
    );

    return product?.images?.[0] || "/placeholder.jpg";
  };

  return (
    <section className="bg-white text-black py-16 overflow-hidden">

      {/* TITLE */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide">
          SHOP BY CATEGORY
        </h2>

        <div className="w-28 h-[3px] bg-yellow-600 mx-auto mt-4 rounded-full" />
      </div>

      {/* AUTO SCROLL WRAPPER */}
      <div className="relative w-full overflow-hidden py-4">

        {/* AUTO SCROLL */}
        <div className="flex gap-8 md:gap-12 animate-scroll whitespace-nowrap pl-8 md:pl-16">

          {[...categories.slice(0, 5), ...categories.slice(0, 5)].map(
            (cat, index) => {
              const image = getCategoryImage(cat._id);

              return (
                <div
                  key={index}
                  onClick={() =>
                    router.push(`/products?category=${cat._id}`)
                  }
                  className="flex flex-col items-center cursor-pointer group min-w-[180px] shrink-0"
                >
                  {/* IMAGE */}
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border border-gray-200 shadow-md group-hover:shadow-xl transition duration-300">

                    <Image
                      src={image}
                      alt={cat.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  {/* NAME */}
                  <p className="mt-4 text-base md:text-lg font-medium text-center group-hover:text-yellow-600 transition">
                    {cat.name}
                  </p>
                </div>
              );
            }
          )}

        </div>
      </div>

    </section>
  );
}