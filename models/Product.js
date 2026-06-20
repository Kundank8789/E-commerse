"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    // Recalculate shipping when cart changes
    const newShipping = calculateShippingCost(cart);
    setShippingCost(newShipping);
  }, [cart]);

  // ✅ Calculate shipping cost based on products in cart
  const calculateShippingCost = (items) => {
    if (!items || items.length === 0) return 0;
    
    // Option 1: Highest shipping cost (recommended for simplicity)
    let maxShipping = 0;
    items.forEach(item => {
      const itemShipping = Number(item.shippingCost) || 0;
      if (itemShipping > maxShipping) {
        maxShipping = itemShipping;
      }
    });
    return maxShipping;
    
    // Option 2: Sum of all shipping costs (use this if you want to add them up)
    // return items.reduce((sum, item) => sum + (Number(item.shippingCost) || 0), 0);
  };

  // ✅ Get subtotal (items total)
  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // ✅ Get shipping cost
  const getShippingCost = () => {
    return calculateShippingCost(cart);
  };

  // ✅ Get grand total (items + shipping)
  const getGrandTotal = () => {
    return getCartTotal() + getShippingCost();
  };

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { 
        ...product, 
        quantity: quantity,
        shippingCost: product.shippingCost || 0 // ✅ Ensure shipping cost is included
      }];
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Get total items in cart
  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getShippingCost,
      getGrandTotal,
      getTotalItems,
      shippingCost,
      total: getGrandTotal(),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};