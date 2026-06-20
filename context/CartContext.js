"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ LOAD CART
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
  }, []);

  // ✅ SAVE CART
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ ADD TO CART with stock validation & min/max limits
  const addToCart = (product) => {
    // ✅ Check if product is in stock
    if (product.stock === 0) {
      toast.error(`${product.name} is out of stock!`);
      return;
    }

    setCart((prev) => {
      const exist = prev.find(
        (item) =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
      );

      const currentQty = exist ? exist.quantity : 0;
      const newQty = currentQty + (product.quantity || 1);

      // ✅ Check max order quantity
      const maxQty = Math.min(product.maxOrderQuantity || 5, product.stock || 0);
      if (newQty > maxQty) {
        toast.error(`Maximum ${maxQty} units allowed for this product`);
        return prev;
      }

      // ✅ Check min order quantity
      const minQty = product.minOrderQuantity || 1;
      if (newQty < minQty && exist) {
        toast.error(`Minimum ${minQty} unit required`);
        return prev;
      }

      if (exist) {
        return prev.map((item) =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: newQty }
            : item
        );
      }

      // ✅ New item - validate min quantity
      const qty = Math.max(product.quantity || 1, minQty);
      if (qty > maxQty) {
        toast.error(`Maximum ${maxQty} units allowed for this product`);
        return prev;
      }

      return [...prev, { ...product, quantity: qty }];
    });
  };

  // ✅ REMOVE FROM CART
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
    toast.success("Item removed from cart");
  };

  // ✅ DECREASE QUANTITY with min limit validation
  const decreaseQty = (product) => {
    setCart((prev) => {
      const item = prev.find(
        (i) =>
          i._id === product._id &&
          i.selectedSize === product.selectedSize &&
          i.selectedColor === product.selectedColor
      );

      if (!item) return prev;

      const minQty = product.minOrderQuantity || 1;
      const newQty = item.quantity - 1;

      // ✅ Don't go below min quantity
      if (newQty < minQty) {
        toast.error(`Minimum ${minQty} unit required`);
        return prev;
      }

      if (newQty === 0) {
        return prev.filter(
          (i) =>
            !(
              i._id === product._id &&
              i.selectedSize === product.selectedSize &&
              i.selectedColor === product.selectedColor
            )
        );
      }

      return prev.map((i) =>
        i._id === product._id &&
        i.selectedSize === product.selectedSize &&
        i.selectedColor === product.selectedColor
          ? { ...i, quantity: newQty }
          : i
      );
    });
  };

  // ✅ INCREASE QUANTITY with stock & max limit validation
  const increaseQty = (product) => {
    setCart((prev) => {
      const item = prev.find(
        (i) =>
          i._id === product._id &&
          i.selectedSize === product.selectedSize &&
          i.selectedColor === product.selectedColor
      );

      if (!item) return prev;

      const maxQty = Math.min(product.maxOrderQuantity || 5, product.stock || 0);
      const newQty = item.quantity + 1;

      if (newQty > maxQty) {
        toast.error(`Maximum ${maxQty} units allowed`);
        return prev;
      }

      return prev.map((i) =>
        i._id === product._id &&
        i.selectedSize === product.selectedSize &&
        i.selectedColor === product.selectedColor
          ? { ...i, quantity: newQty }
          : i
      );
    });
  };

  // ✅ CLEAR CART
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // ✅ GET CART TOTAL
  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // ✅ GET SHIPPING COST - Based on product shipping costs
  const getShippingCost = () => {
    if (!cart || cart.length === 0) return 0;
    
    // Get the highest shipping cost from all items in cart
    const shippingCosts = cart.map(item => Number(item.shippingCost) || 0);
    const maxShipping = Math.max(...shippingCosts, 0);
    
    // Optional: Free shipping above ₹499
    const subtotal = getCartTotal();
    if (subtotal >= 499) return 0;
    
    return maxShipping;
  };

  // ✅ GET GRAND TOTAL (NEW FUNCTION)
  const getGrandTotal = () => {
    return getCartTotal() + getShippingCost();
  };

  // ✅ GET CART ITEMS COUNT
  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decreaseQty,
        increaseQty,
        clearCart,
        getCartTotal,
        getShippingCost,
        getGrandTotal, // ✅ Added this
        getCartCount,
      }}
    >
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