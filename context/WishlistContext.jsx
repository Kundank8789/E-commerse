"use client";
import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // ✅ Load once
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  // ✅ Save every change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find(
        (p) =>
          (p._id || p.id)?.toString() ===
          (product._id || product.id)?.toString()
      );

      if (exists) return prev;

      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) =>
      prev.filter(
        (p) =>
          (p._id || p.id)?.toString() !== id?.toString()
      )
    );
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);