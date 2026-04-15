"use client";

import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <CartProvider>
      <Toaster position="top-right" />
      {children}
    </CartProvider>
  );
}