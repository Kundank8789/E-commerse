import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import PromoBanner from "@/components/home/PromoBanner";
import Newsletter from "@/components/home/Newsletter";
import Reveal from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <main className="bg-white text-black">

      {/* HERO */}
      <Reveal>
        <Hero />
      </Reveal>

      {/* CATEGORIES */}
      <Reveal delay={100}>
        <Categories />
      </Reveal>

      {/* FEATURED PRODUCTS */}
      <Reveal delay={200}>
        <FeaturedProducts />
      </Reveal>

      {/* NEW ARRIVALS */}
      <Reveal delay={300}>
        <NewArrivals />
      </Reveal>

      {/* PROMO */}
      <Reveal delay={400}>
        <PromoBanner />
      </Reveal>

      {/* NEWSLETTER */}
      <Reveal delay={500}>
        <Newsletter />
      </Reveal>

    </main>
  );
}