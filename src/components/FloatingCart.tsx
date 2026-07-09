"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingCart: React.FC = () => {
  const { cartCount, cartTotal, isCartOpen, setIsCartOpen } = useCart();

  // Do not display if cart is empty or the drawer is already open
  if (cartCount === 0 || isCartOpen) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 left-6 md:left-auto md:right-8 z-40 pointer-events-auto flex items-center gap-3 px-5 py-3.5 bg-[#09090B]/95 hover:bg-[#111217]/95 border border-gold-accent/40 hover:border-gold-accent rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(212,163,89,0.15)] hover:shadow-[0_0_30px_rgba(212,163,89,0.35)] cursor-pointer group transition-all duration-300 active:scale-95"
      >
        {/* Shopping Icon */}
        <div className="relative">
          <ShoppingCart className="w-4.5 h-4.5 text-gold-accent group-hover:rotate-12 transition-transform duration-300" />
          {/* Badge count */}
          <span className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#09090B]">
            {cartCount}
          </span>
        </div>

        {/* Info Column */}
        <div className="flex flex-col items-start leading-none gap-0.5">
          <span className="text-[8px] uppercase tracking-wider text-secondary-text font-bold">Your Cart</span>
          <span className="font-cinzel text-xs text-white-text font-black">₹{cartTotal}</span>
        </div>
      </motion.button>
    </AnimatePresence>
  );
};
