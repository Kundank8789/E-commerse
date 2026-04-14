import Image from "next/image";

export default function NewArrivals() {

  const products = [
    { id: 1, name: "Nike Shoes", price: 3999, image: "/shoes.jpg", tag: "NEW" },
    { id: 2, name: "Tshirt", price: 999, image: "/tshirt.jpg", tag: "TRENDING" },
  ];

  return (
    <section className="py-16 px-6 bg-black text-white">

      <h2 className="text-4xl font-bold text-center mb-12">
        New Arrivals
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

        {products.map((product) => (

          <div
            key={product.id}
            className="group bg-neutral-900 rounded-xl overflow-hidden border border-gray-800 hover:shadow-2xl transition duration-300"
          >

            <div className="relative overflow-hidden">

              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
              />

              <span className="absolute top-3 left-3 bg-white text-black text-xs px-3 py-1 rounded">
                {product.tag}
              </span>

            </div>

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

    </section>
  );
}