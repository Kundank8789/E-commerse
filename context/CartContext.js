"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ LOAD CART
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // ✅ SAVE CART (FIXED)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ ADD TO CART (FIXED - supports variants)
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find(
        (item) =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
      );

      if (exist) {
        return prev.map((item) =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ✅ REMOVE (FIXED)
  const removeFromCart = (product) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item._id === product._id &&
            item.selectedSize === product.selectedSize &&
            item.selectedColor === product.selectedColor
          )
      )
    );
  };

  // ✅ DECREASE (FIXED)
  const decreaseQty = (product) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ✅ CLEAR
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, decreaseQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);