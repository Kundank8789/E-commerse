"use client";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext"; // ✅ ADD
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <CartProvider>
      <WishlistProvider> {/* ✅ WRAP HERE */}

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
            },
          }}
        />

        {children}

      </WishlistProvider>
    </CartProvider>
  );
}