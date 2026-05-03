import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      
      {/* ✅ NAVBAR (BLACK) */}
      <Navbar />

      {/* ✅ MAIN CONTENT (CENTERED + WHITE) */}
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          {children}
        </div>
      </main>

      {/* ✅ FOOTER (BLACK) */}
      <Footer />

    </div>
  );
}