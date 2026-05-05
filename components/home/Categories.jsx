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

  // 🔥 get image from products
  const getCategoryImage = (categoryId) => {
    const product = products.find(
      (p) =>
        p.category?._id === categoryId ||
        p.categories?.some((c) => c._id === categoryId)
    );

    return product?.images?.[0] || "/placeholder.jpg";
  };

  return (
    <section className="bg-white text-black py-16">

      {/* TITLE */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">
          SHOP BY CATEGORY
        </h2>
        <div className="w-20 h-[2px] bg-yellow-600 mx-auto mt-3" />
      </div>

      {/* CATEGORY ROW */}
      <div className="w-full px-6 md:px-10 flex justify-center gap-8 md:gap-12 flex-wrap">

        {categories.map((cat) => {
          const image = getCategoryImage(cat._id);

          return (
            <div
              key={cat._id}
              onClick={() => router.push(`/products?category=${cat._id}`)}
              className="flex flex-col items-center cursor-pointer group min-w-[100px]"
            >
              {/* CIRCLE IMAGE */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition">

                <Image
                  src={image}
                  alt={cat.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* NAME */}
              <p className="mt-3 text-sm font-medium text-center group-hover:text-yellow-600 transition">
                {cat.name}
              </p>
            </div>
          );
        })}

      </div>

    </section>
  );
}