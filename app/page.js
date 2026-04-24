import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import PromoBanner from "@/components/home/PromoBanner";
import Newsletter from "@/components/home/Newsletter";

import Reveal from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <main className="bg-black text-white">

      {/* Hero (no delay) */}
      <Reveal>
        <Hero />
      </Reveal>

      {/* Sections with stagger */}
      <Reveal delay={100}>
        <Categories />
      </Reveal>

      <Reveal delay={200}>
        <FeaturedProducts />
      </Reveal>

      <Reveal delay={300}>
        <NewArrivals />
      </Reveal>

      <Reveal delay={400}>
        <PromoBanner />
      </Reveal>

      <Reveal delay={500}>
        <Newsletter />
      </Reveal>

    </main>
  );
}