import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductDetails({ params }) {
  await connectDB();

  // ✅ FIXED: Use "categories" (plural) not "category"
  const product = await Product.findById(params.id)
    .populate("categories") // ✅ Changed from "category" to "categories"
    .lean();

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  // ✅ Safe images
  const images =
    product?.images?.filter(
      (img) => typeof img === "string" && img.startsWith("http")
    ) || [];

  // ✅ Calculate discount
  const discount = product.mrp 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">

      {/* IMAGE SECTION */}
      <div className="space-y-4">
        <div className="relative w-full h-96 border rounded-lg overflow-hidden bg-gray-100">
          {images.length > 0 ? (
            <Image
              src={images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* THUMBNAILS */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative w-20 h-20 border rounded overflow-hidden flex-shrink-0"
              >
                <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAILS SECTION */}
      <div className="space-y-4">

        {/* TITLE */}
        <h1 className="text-3xl font-bold">{product.name}</h1>

        {/* CATEGORIES */}
        {product.categories?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {product.categories.map((cat) => (
              <span 
                key={cat._id} 
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* PRICE */}
        <div className="flex items-center gap-3">
          <span className="text-3xl font-semibold text-green-600">
            ₹{product.price}
          </span>

          {product.mrp && product.mrp > product.price && (
            <>
              <span className="line-through text-gray-400 text-lg">
                ₹{product.mrp}
              </span>
              <span className="text-sm text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* STOCK & SHIPPING */}
        <div className="flex items-center gap-4">
          <p className={`text-sm font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-600"
          }`}>
            {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
          </p>
          
          {/* ✅ Show shipping cost */}
          {product.shippingCost > 0 && (
            <p className="text-sm text-gray-500">
              Shipping: ₹{product.shippingCost}
            </p>
          )}
          {product.shippingCost === 0 && (
            <p className="text-sm text-green-600">
              🚚 Free Shipping
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        {product.description && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>
        )}

        {/* COLORS */}
        {product.colors?.length > 0 && (
          <div>
            <p className="font-semibold text-gray-700 mb-2">Colors:</p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-black hover:text-white cursor-pointer transition"
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
            <p className="font-semibold text-gray-700 mb-2">Sizes:</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s, i) => (
                <button
                  key={i}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-black hover:text-white transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DIMENSIONS */}
        {(product.weight || product.length || product.breadth || product.height) && (
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {product.weight && <p>⚖️ Weight: {product.weight}g</p>}
            {product.length && <p>📏 Length: {product.length}cm</p>}
            {product.breadth && <p>📐 Breadth: {product.breadth}cm</p>}
            {product.height && <p>📏 Height: {product.height}cm</p>}
          </div>
        )}

        {/* TAX */}
        {product.tax > 0 && (
          <p className="text-sm text-gray-500">
            Tax: {product.tax}% included
          </p>
        )}

        {/* ✅ ADD TO CART WITH FUNCTIONALITY */}
        <AddToCartButton product={product} />

        {/* Order limits info */}
        {product.minOrderQuantity > 1 && (
          <p className="text-xs text-gray-400">
            Minimum order: {product.minOrderQuantity} units
          </p>
        )}
        {product.maxOrderQuantity < 999 && (
          <p className="text-xs text-gray-400">
            Maximum order: {product.maxOrderQuantity} units
          </p>
        )}

      </div>
    </div>
  );
}