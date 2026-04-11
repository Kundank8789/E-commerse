import Link from "next/link";
import Image from "next/image";

export default function Products() {

  const products = [
    {
      id: 1,
      name: "Nike Shoes",
      price: 3999,
      image: "/shoes.jpg"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 4999,
      image: "/watch.jpg"
    },
    {
      id: 3,
      name: "Headphones",
      price: 1999,
      image: "/headphone.jpg"
    },
    {
      id: 4,
      name: "Backpack",
      price: 1499,
      image: "/bag.jpg"
    }
  ];

  return (
    <section className="py-16">

      <h2 className="text-3xl text-center font-bold mb-10">
        Featured Products
      </h2>

      <div className="grid grid-cols-4 gap-6 px-10">

        {products.map((product) => (
          <div key={product.id} className="border p-4">

            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={200}
                className="w-full h-40 object-cover"
              />
            </Link>

            <h3 className="mt-4 font-semibold">
              {product.name}
            </h3>

            <p className="text-gray-600">
              ₹{product.price}
            </p>

            <button className="mt-4 bg-black text-white px-4 py-2 w-full">
              Add to Cart
            </button>

          </div>
        ))}

      </div>

    </section>
  );
}