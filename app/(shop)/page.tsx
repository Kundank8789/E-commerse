import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import PromoBanner from "@/components/home/PromoBanner";
import Newsletter from "@/components/home/Newsletter";
import Reveal from "@/components/ui/Reveal";
import ProductSection from "@/components/home/ProductSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-white text-black ">

      {/* HERO */}
      <Reveal fullWidth>
        <Hero />
      </Reveal>

      {/* CATEGORIES */}
      <Reveal delay={100} fullWidth>
        <Categories />
      </Reveal>

      {/* NEW ARRIVALS */}
      <Reveal delay={200}>
        <NewArrivals />
      </Reveal>

      {/* TRENDING PRODUCTS */}
      <Reveal delay={300}>
        <FeaturedProducts />
      </Reveal>

      {/* JEWELLERY */}
      <Reveal delay={400}>
        <ProductSection
          title="Jewellery Collection"
          category="Jewellery"
        />
      </Reveal>

      {/* SHOES */}
      <Reveal delay={500}>
        <ProductSection
          title="Shoes Collection"
          category="Shoes"
        />
      </Reveal>

      {/* CLOTHING */}
      <Reveal delay={600}>
        <ProductSection
          title="Cloth Collection"
          category="cloth"
        />
      </Reveal>

      {/* WATCHES */}
      <Reveal delay={700}>
        <ProductSection
          title="Watches Collection"
          category="Watch"
        />
      </Reveal>

      {/* SEE ALL PRODUCTS */}
      <Reveal delay={800}>
        <div className="text-center py-20">

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Explore Our Full Collection
          </h2>

          <p className="text-gray-600 mb-8 max-w-2xl mx-auto px-6">
            Discover premium fashion, jewellery, shoes, watches and more curated for modern lifestyle.
          </p>

          <Link
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 rounded-full 
  hover:bg-yellow-600 transition duration-300"
          >
            See All Products
          </Link>

        </div>
      </Reveal>

      {/* PROMO */}
      <Reveal delay={900}>
        <PromoBanner />
      </Reveal>

      {/* NEWSLETTER */}
      <Reveal delay={1000}>
        <Newsletter />
      </Reveal>

    </main>
  );
}