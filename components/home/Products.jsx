import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaShoppingCart, FaEye, FaStar } from "react-icons/fa";

export default function Products() {

  const products = [
    {
      id: 1,
      name: "Nike Shoes",
      price: 3999,
      oldPrice: 4999,
      rating: 4,
      image: "/shoes.jpg"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 4999,
      oldPrice: 6999,
      rating: 5,
      image: "/watch.jpg"
    },
    {
      id: 3,
      name: "Headphones",
      price: 1999,
      oldPrice: 2999,
      rating: 4,
      image: "/headphone.jpg"
    },
    {
      id: 4,
      name: "Backpack",
      price: 1499,
      oldPrice: 1999,
      rating: 3,
      image: "/bag.jpg"
    }
  ];

  return (
    <section className="bg-black text-white py-16">

      <h2 className="text-4xl text-center font-bold mb-14">
        Featured Products
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">

        {products.map((product) => (

          <div
            key={product.id}
            className="bg-gray-900 rounded-xl overflow-hidden 
            hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 relative group"
          >

            {/* Discount Badge */}
            <span className="absolute top-3 left-3 bg-red-600 text-xs px-2 py-1 rounded">
              SALE
            </span>

            {/* Wishlist */}
            <button className="absolute top-3 right-3 bg-black/70 backdrop-blur p-2 rounded-full hover:text-red-500 transition">
              <FaHeart size={16}/>
            </button>

            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
              />
            </Link>

            <div className="p-4">

              <h3 className="font-semibold text-lg">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex gap-1 mt-1">
                {[...Array(product.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
              </div>

              {/* Price */}
              <div className="mt-2 flex items-center gap-2">
                <p className="text-lg font-semibold">
                  ₹{product.price}
                </p>
                <span className="text-gray-400 line-through text-sm">
                  ₹{product.oldPrice}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">

                <button className="flex-1 bg-white text-black py-2 rounded-lg 
                hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm font-medium">
                  <FaShoppingCart size={16}/>
                  Cart
                </button>

                <button className="bg-gray-800 px-3 rounded-lg hover:bg-gray-700 transition">
                  <FaEye size={16}/>
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}