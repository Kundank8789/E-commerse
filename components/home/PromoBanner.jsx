import Image from "next/image";

export default function PromoBanner() {

  return (

    <section className="relative py-24 px-6 rounded-xl overflow-hidden">

      {/* Background Image */}
      <Image
        src="/sale-banner.jpg"
        alt="Sale Banner"
        fill
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center text-white">

        <h2 className="text-4xl md:text-5xl font-bold">
          Summer Sale
        </h2>

        <p className="mt-4 text-lg text-gray-300">
          Up to 50% Off on Selected Items
        </p>

        <button className="mt-8 px-8 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition">
          Shop Now
        </button>

      </div>

    </section>

  );
}