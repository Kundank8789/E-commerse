import Image from "next/image";

export default function Categories() {

  const categories = [
    {
      name: "Electronics",
      image: "/headphone.jpg"
    },
    {
      name: "Fashion",
      image: "/watch.jpg"
    },
    {
      name: "Shoes",
      image: "/shoes.jpg"
    },
    {
      name: "Accessories",
      image: "/Accessories.jpg"
    }
  ];

  return (
    <section className="bg-black text-white py-16">

      <h2 className="text-3xl text-center font-bold mb-12">
        Shop by Category
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">

        {categories.map((cat, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer"
          >

            <Image
              src={cat.image}
              alt={cat.name}
              width={400}
              height={250}
              className="w-full h-40 object-cover"
            />

            <div className="p-4 text-center font-semibold">
              {cat.name}
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}