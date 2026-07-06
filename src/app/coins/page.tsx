"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useCart } from "@/context/CartContext";
import { Coins, Check, ShoppingCart, Star } from "lucide-react";

interface CoinItemType {
  id: string;
  name: string;
  price: number;
  accentColor: string;
  glowClass: string;
  desc: string;
  perks: string[];
  featured?: boolean;
}

export default function CoinsPage() {
  const { addToCart, cart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [coins, setCoins] = useState<CoinItemType[]>([]);

  const [customPrices, setCustomPrices] = useState({
    coins500: 49,
    coins1200: 99,
    coins2500: 199,
    coins6000: 399,
    coins12000: 699
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/config/public");
        const config = await res.json();
        if (config && config.prices) {
          setCustomPrices({
            coins500: config.prices.coins500 ?? 49,
            coins1200: config.prices.coins1200 ?? 99,
            coins2500: config.prices.coins2500 ?? 199,
            coins6000: config.prices.coins6000 ?? 399,
            coins12000: config.prices.coins12000 ?? 699
          });
        }
      } catch (e) {
        console.error("Failed to load prices from public API:", e);
        const savedPricesStr = localStorage.getItem("bongcraft_prices");
        if (savedPricesStr) {
          try {
            const savedPrices = JSON.parse(savedPricesStr);
            setCustomPrices({
              coins500: savedPrices.coins500 ?? 49,
              coins1200: savedPrices.coins1200 ?? 99,
              coins2500: savedPrices.coins2500 ?? 199,
              coins6000: savedPrices.coins6000 ?? 399,
              coins12000: savedPrices.coins12000 ?? 699
            });
          } catch (err) {
            console.error(err);
          }
        }
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    const defaultCoins = [
      {
        id: "coins-500",
        name: "500 Coins Pack",
        price: customPrices.coins500,
        accentColor: "#D1D5DB",
        glowClass: "hover:border-slate-400/40 hover:shadow-[0_0_20px_-5px_rgba(209,213,219,0.3)]",
        desc: "Handy pocket currency pack",
        perks: ["Buy basic shop items", "Rent claims", "Trade in player markets"],
      },
      {
        id: "coins-1200",
        name: "1,200 Coins Pack",
        price: customPrices.coins1200,
        accentColor: "#F59E0B",
        glowClass: "hover:border-amber-500/40 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]",
        desc: "A solid wallet balance boost",
        perks: ["Buy claims & boosters", "Unlock custom prefixes", "Purchase spawners"],
      },
      {
        id: "coins-2500",
        name: "2,500 Coins Pack",
        price: customPrices.coins2500,
        accentColor: "#10B981",
        glowClass: "hover:border-emerald-500/40 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]",
        desc: "Popular Value Pack",
        perks: ["Buy premium shop enchants", "Unlock custom pets", "Dominate server auctions"],
        featured: true,
      },
      {
        id: "coins-6000",
        name: "6,000 Coins Pack",
        price: customPrices.coins6000,
        accentColor: "#06B6D4",
        glowClass: "hover:border-cyan-500/40 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]",
        desc: "The Wealthy Lord Treasury",
        perks: ["Unlimited claims expansion", "Buy top-tier gear sets", "Unlock elite server items"],
      },
      {
        id: "coins-12000",
        name: "12,000 Coins Pack",
        price: customPrices.coins12000,
        accentColor: "#EC4899",
        glowClass: "hover:border-pink-500/40 hover:shadow-[0_0_20px_-5px_rgba(236,72,153,0.3)]",
        desc: "The Sovereign King Vault",
        perks: ["Perfect for claim scaling", "Buy multiple elite spawner cores", "Bypass auction bid wars"],
      }
    ];

    setCoins(defaultCoins);
  }, [customPrices]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
              BongCraft SMP Shop
            </span>
            <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
              Server Coins
            </h1>
            <p className="font-inter text-sm text-secondary-text mt-3 max-w-xl mx-auto">
              Unlock server economic superiority. Use coins in-game to upgrade your claims size, purchase specialized blocks/spawners, rent properties, and participate in auctions.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-5" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {coins.map((item) => {
              const isItemInCart = cart.some((cartItem) => cartItem.id === item.id);

              return (
                <div
                  key={item.id}
                  className={`glass-panel p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden border border-border-custom transition-all duration-400 group cursor-default ${
                    item.glowClass
                  } ${item.featured ? "border-gold-accent/35" : ""}`}
                >
                  {item.featured && (
                    <div className="absolute top-0 right-0 bg-gold-accent text-primary-bg px-3.5 py-1.5 rounded-bl-xl font-inter text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-0.5 shadow-sm">
                      <Star className="w-3 h-3 fill-current" />
                      Popular
                    </div>
                  )}

                  <div>
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-cinzel font-black text-xl border mb-5 transition-all duration-300 relative group-hover:scale-105"
                      style={{
                        borderColor: `${item.accentColor}30`,
                        background: `${item.accentColor}10`,
                        color: item.accentColor,
                      }}
                    >
                      <Coins className="w-5 h-5" />
                    </div>

                    <h3 className="font-cinzel text-lg font-bold text-white-text tracking-wide mb-1">
                      {item.name}
                    </h3>
                    <p className="font-inter text-xs text-secondary-text leading-relaxed mb-5">
                      {item.desc}
                    </p>

                    <div className="h-px bg-border-custom mb-5" />

                    {/* Perks */}
                    <div className="space-y-2 mb-6">
                      <span className="font-cinzel text-[9px] font-bold text-secondary-text uppercase tracking-widest block">
                        Usage Privileges
                      </span>
                      <div className="space-y-1.5">
                        {item.perks.map((perk, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-secondary-text">
                            <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
                            <span className="font-inter text-white-text/85">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="font-inter text-[10px] text-secondary-text font-semibold uppercase tracking-wider">
                        Price:
                      </span>
                      <span className="font-cinzel text-2xl font-extrabold text-gold-accent">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          category: "Coins",
                          accentColor: item.accentColor,
                        })
                      }
                      className={`w-full py-3.5 rounded-xl font-inter font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                        isItemInCart
                          ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-500"
                          : "bg-primary-accent hover:bg-primary-accent/90 text-white-text hover:shadow-[0_0_15px_rgba(124,58,237,0.35)]"
                      }`}
                    >
                      {isItemInCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
