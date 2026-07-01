// app/(shop)/layout.tsx (or wherever ShopLayout is)
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

// ✅ ADD METADATA HERE
export const metadata: Metadata = {
  title: "Niwle - Premium Fashion & Jewellery",
  description: "Premium fashion & jewellery for modern lifestyle. Designed for elegance, crafted for you.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}