import Navbar from "../../components/Navbar";
import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import NewArrivals from "../../components/home/NewArrivals";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import PromoBanner from "../../components/home/PromoBanner";
import Newsletter from "../../components/home/Newsletter";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 space-y-24">

        {/* ✅ Home Section */}
        <section id="home">
          <Hero />
        </section>

        <Categories />

        {/* ✅ New Section */}
        <section id="new">
          <NewArrivals />
        </section>

        {/* ✅ Products Section */}
        <section id="products">
          <FeaturedProducts />
        </section>

        <PromoBanner />

        <Newsletter />

      </main>

      <Footer />
    </>
  );
}