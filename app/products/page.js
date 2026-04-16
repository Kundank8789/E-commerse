import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic"; // always fetch fresh data

async function getProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/products", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10">
      
      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Explore Products
        </h1>
        <p className="text-gray-400 text-sm">
          {products.length} items
        </p>
      </div>

      {/* 🧱 Grid */}
      {products.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          No products found 😔
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}