import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import Products from "../components/home/Products";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <Products />
    </>
  );
}