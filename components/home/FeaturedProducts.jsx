import Image from "next/image";

export default function FeaturedProducts() {
  return (
    <section>

      <h2 className="text-3xl font-bold text-center mb-10">
        Featured Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

        <div className="border p-4 hover:shadow-xl transition">
          <Image
            src="/product1.jpg"
            alt="Classic Jacket"
            width={300}
            height={300}
            className="w-full h-auto"
          />
          <p>Classic Jacket</p>
        </div>

        <div className="border p-4 hover:shadow-xl transition">
          <Image
            src="/product2.jpg"
            alt="Modern Sneakers"
            width={300}
            height={300}
            className="w-full h-auto"
          />
          <p>Modern Sneakers</p>
        </div>

      </div>

    </section>
  );
}