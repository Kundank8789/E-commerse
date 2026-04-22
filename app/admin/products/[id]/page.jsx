

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category";
import Image from "next/image";

export default async function ProductDetails({ params }) {
  await connectDB();

  // ✅ FIXED: use "category" not "categories"
  const product = await Product.findById(params.id)
    .populate("category")
    .lean();

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  // ✅ Safe images
  const images =
    product?.images?.filter(
      (img) => typeof img === "string" && img.startsWith("http")
    ) || [];

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">

      {/* 🔥 IMAGE SECTION */}
      <div className="space-y-4">
        <div className="relative w-full h-96 border rounded-lg overflow-hidden">
          {images.length > 0 ? (
            <Image
              src={images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              No Image
            </div>
          )}
        </div>

        {/* THUMBNAILS */}
        <div className="flex gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-20 h-20 border rounded overflow-hidden"
            >
              <Image src={img} alt="thumb" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 DETAILS SECTION */}
      <div className="space-y-4">

        {/* TITLE */}
        <h1 className="text-3xl font-bold">{product.name}</h1>

        {/* CATEGORY */}
        <p className="text-sm text-blue-500">
          {product?.category?.name || "No Category"}
        </p>

        {/* PRICE */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold text-green-600">
            ₹{product.price}
          </span>

          {product.mrp && (
            <span className="line-through text-gray-400">
              ₹{product.mrp}
            </span>
          )}

          {product.mrp && (
            <span className="text-sm text-red-500">
              {Math.round(
                ((product.mrp - product.price) / product.mrp) * 100
              )}
              % OFF
            </span>
          )}
        </div>

        {/* STOCK */}
        <p
          className={`text-sm ${
            product.stock > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        {/* DESCRIPTION */}
        <p className="text-gray-600">{product.description}</p>

        {/* 🔥 PRODUCT DETAILS */}

        {/* COLORS */}
        {product.colors?.length > 0 && (
          <div>
            <p className="font-semibold">Colors:</p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border rounded text-sm hover:bg-black hover:text-white cursor-pointer transition"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SIZES */}
        {product.sizes?.length > 0 && (
          <div>
            <p className="font-semibold">Sizes:</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s, i) => (
                <button
                  key={i}
                  className="px-3 py-1 border rounded hover:bg-black hover:text-white transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DIMENSIONS */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          {product.weight && <p>Weight: {product.weight}g</p>}
          {product.length && <p>Length: {product.length}cm</p>}
          {product.breadth && <p>Breadth: {product.breadth}cm</p>}
          {product.height && <p>Height: {product.height}cm</p>}
        </div>

        {/* TAX */}
        {product.tax && (
          <p className="text-sm text-gray-500">
            Tax: {product.tax}%
          </p>
        )}

        {/* ADD TO CART */}
        <button className="bg-black text-white px-6 py-3 rounded-lg hover:scale-105 transition">
          Add to Cart
        </button>

      </div>
    </div>
  );
}