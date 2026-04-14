import Image from "next/image";

export default function FeaturedProducts() {

const products = [
{
id: 1,
name: "Classic Jacket",
price: 4999,
image: "/jacket.jpg",
tag: "FEATURED",
},
{
id: 2,
name: "Modern Sneakers",
price: 3499,
image: "/shoes.jpg",
tag: "BEST SELLER",
},
];

return ( <section className="py-16 px-6 bg-black text-white">

  <div className="max-w-7xl mx-auto">

    <h2 className="text-4xl font-bold text-center mb-12">
      Featured Products
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

      {products.map((product) => (

        <div
          key={product.id}
          className="group bg-neutral-900 border border-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition duration-300"
        >

          {/* Product Image */}
          <div className="relative overflow-hidden">

            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
            />

            {/* Badge */}
            <span className="absolute top-3 left-3 bg-white text-black text-xs px-3 py-1 rounded">
              {product.tag}
            </span>

          </div>

          {/* Product Info */}
          <div className="p-4">

            <h3 className="text-lg font-semibold">
              {product.name}
            </h3>

            <p className="text-gray-400 mt-1">
              ₹{product.price}
            </p>

            <button className="mt-4 w-full border border-white py-2 rounded-lg hover:bg-white hover:text-black transition">
              Add to Cart
            </button>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>

);
}
