"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { audioSynth } from "@/lib/audio";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  accentColor?: string;
  icon?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  minecraftUsername: string;
  setMinecraftUsername: (username: string) => void;
  cartTotal: number;
  cartCount: number;
  couponCode: string;
  discountPercentage: number;
  discountAmount: number;
  rawTotal: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [minecraftUsername, setMinecraftUsername] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("bongcraft_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data", e);
      }
    }
    const savedUsername = localStorage.getItem("bongcraft_username");
    if (savedUsername) {
      setMinecraftUsername(savedUsername);
    }
    const savedCoupon = localStorage.getItem("bongcraft_coupon");
    if (savedCoupon) {
      setCouponCode(savedCoupon);
      setDiscountPercentage(25);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("bongcraft_cart", JSON.stringify(cart));
  }, [cart]);

  // Save username to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("bongcraft_username", minecraftUsername);
  }, [minecraftUsername]);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    audioSynth.playClick();
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true); // Open cart automatically when an item is added
  };

  const removeFromCart = (id: string) => {
    audioSynth.playClick();
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    audioSynth.playClick();
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const applyCoupon = (code: string): boolean => {
    const formatted = code.toUpperCase().trim();
    if (formatted === "AKASH" || formatted === "BONGCRAFT") {
      setCouponCode(formatted);
      setDiscountPercentage(25); // 25% Off
      localStorage.setItem("bongcraft_coupon", formatted);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscountPercentage(0);
    localStorage.removeItem("bongcraft_coupon");
  };

  const clearCart = () => {
    setCart([]);
    removeCoupon();
  };

  const rawTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = Math.round((rawTotal * discountPercentage) / 100);
  const cartTotal = rawTotal - discountAmount;
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        minecraftUsername,
        setMinecraftUsername,
        cartTotal,
        cartCount,
        couponCode,
        discountPercentage,
        discountAmount,
        rawTotal,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
