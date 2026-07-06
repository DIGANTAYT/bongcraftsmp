"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    minecraftUsername,
    setMinecraftUsername,
  } = useCart();

  const { user, profile } = useAuth();
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState(minecraftUsername);
  const [isUsernameValid, setIsUsernameValid] = useState(minecraftUsername.length >= 3);

  // Sync inputs dynamically on auth changes
  useEffect(() => {
    if (isSupabaseConfigured && user && profile?.minecraft_username) {
      setUsernameInput(profile.minecraft_username);
      setMinecraftUsername(profile.minecraft_username);
      setIsUsernameValid(true);
    } else {
      setUsernameInput(minecraftUsername);
      setIsUsernameValid(minecraftUsername.length >= 3);
    }
  }, [minecraftUsername, profile, user]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSupabaseConfigured && user) return; // Read-only if logged in
    const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, ""); // Minecraft username limits
    setUsernameInput(value);
    setMinecraftUsername(value);
    setIsUsernameValid(value.length >= 3);
  };

  const handleCheckoutClick = () => {
    if (!isUsernameValid) return;
    setIsCartOpen(false);
    router.push("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay with fade-in animation */}
      <div
        className="absolute inset-0 bg-[#09090B]/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md glass-panel border-l border-border-custom flex flex-col justify-between shadow-2xl h-full animate-slide">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border-custom flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-accent" />
              <h2 className="font-cinzel text-lg font-bold uppercase tracking-wider text-white-text">
                Your Loot Cart
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-secondary-text hover:text-white-text hover:bg-card-bg/60 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Minecraft Username Input Section */}
          <div className="px-6 py-4 bg-secondary-bg/50 border-b border-border-custom">
            <div className="flex justify-between items-center mb-2">
              <label className="block font-inter text-xs text-secondary-text font-bold uppercase tracking-wider">
                Minecraft Username
              </label>
              {isSupabaseConfigured && user && (
                <span className="flex items-center gap-0.5 text-[9px] text-emerald-500 font-inter font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  Synced Account
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-border-custom bg-primary-bg flex-shrink-0">
                {usernameInput.length >= 3 ? (
                  <img
                    src={`https://mc-heads.net/avatar/${usernameInput}`}
                    alt={`${usernameInput}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary-text text-lg font-bold">
                    ?
                  </div>
                )}
              </div>
              <input
                type="text"
                value={usernameInput}
                onChange={handleUsernameChange}
                disabled={!!(isSupabaseConfigured && user)}
                placeholder="Enter Minecraft IGN..."
                className={`flex-1 px-3 py-2 border rounded-xl font-inter text-sm outline-none transition-colors duration-300 ${
                  isSupabaseConfigured && user
                    ? "bg-secondary-bg/80 border-border-custom text-secondary-text/80 cursor-not-allowed"
                    : "bg-primary-bg/75 border-border-custom hover:border-primary-accent/40 focus:border-primary-accent text-white-text"
                }`}
              />
            </div>
            {!isUsernameValid && (
              <p className="text-[10px] text-red-400 mt-1">
                * Please enter a valid Minecraft username to continue.
              </p>
            )}
            {isSupabaseConfigured && !user && (
              <p className="text-[9px] text-amber-500/70 mt-1.5 leading-tight">
                💡 Tip: **[Sign In](/login)** to automatically link your characters and view order history.
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-16 h-16 text-secondary-text/25 mb-4 animate-bounce" />
                <p className="font-cinzel text-base font-medium text-white-text uppercase tracking-wider">
                  Your cart is empty
                </p>
                <p className="font-inter text-xs text-secondary-text mt-1 max-w-[200px]">
                  Explore our ranks, keys, and bundles to fuel your survival!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-5 py-2.5 bg-primary-accent hover:bg-primary-accent/90 text-white-text font-inter text-xs font-semibold rounded-xl transition-colors duration-300 cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-card-bg/40 border border-border-custom p-3.5 rounded-2xl relative group"
                >
                  {/* Category Indicator Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg border relative overflow-hidden"
                    style={{
                      borderColor: item.accentColor ? `${item.accentColor}30` : "var(--color-border-custom)",
                      background: item.accentColor ? `${item.accentColor}10` : "rgba(255,255,255,0.03)",
                      color: item.accentColor || "var(--color-primary-accent)",
                    }}
                  >
                    <span className="relative z-10 font-cinzel">
                      {item.name.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-inter text-sm font-bold text-white-text truncate">
                      {item.name}
                    </h4>
                    <p className="font-inter text-xs text-secondary-text mt-0.5">
                      {item.category}
                    </p>
                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border-custom rounded-lg bg-primary-bg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-card-bg text-secondary-text hover:text-white-text transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 font-inter text-xs font-bold text-white-text min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-card-bg text-secondary-text hover:text-white-text transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="font-cinzel text-sm font-bold text-gold-accent">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 p-1.5 text-secondary-text/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Billing & Actions */}
          {cart.length > 0 && (
            <div className="px-6 py-6 border-t border-border-custom bg-secondary-bg/25">
              <div className="space-y-2.5 mb-5">
                <div className="flex items-center justify-between font-inter text-sm text-secondary-text">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between font-inter text-sm text-secondary-text">
                  <span>Taxes & Gateway Fees</span>
                  <span className="text-emerald-500 font-semibold">FREE</span>
                </div>
                <div className="h-px bg-border-custom my-2" />
                <div className="flex items-center justify-between font-cinzel text-base font-bold text-white-text">
                  <span>TOTAL AMOUNT</span>
                  <span className="text-gold-accent text-glow-gold text-lg">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                disabled={!isUsernameValid}
                className={`w-full flex items-center justify-center gap-2 py-4 font-inter font-bold text-sm tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer ${
                  isUsernameValid
                    ? "bg-primary-accent hover:bg-primary-accent/90 text-white-text hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                    : "bg-card-bg border border-border-custom text-secondary-text/40 cursor-not-allowed"
                }`}
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
