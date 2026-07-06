"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useCart } from "@/context/CartContext";
import { Key, Check, ShoppingCart, Star, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CrateItemType {
  id: string;
  name: string;
  price: number;
  accentColor: string;
  glowClass: string;
  desc: string;
  featured?: boolean;
  rewards: { name: string; count?: string; type: string }[];
}

// Custom Premium Minecraft SVG Icon Renderer
const MinecraftItemIcon: React.FC<{ name: string; type: string }> = ({ name, type }) => {
  const isEnchanted = name.toLowerCase().includes("enchanted") || type === "weapon" || type === "tool" || type === "armor";

  const getIconContent = () => {
    switch (type) {
      case "armor":
        if (name.includes("Helmet")) {
          return (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#3B3A3E]">
              <path d="M12 2C6.48 2 2 6.48 2 12v3c0 2.2 1.8 4 4 4h12c2.2 0 4-1.8 4-4v-3c0-5.52-4.48-10-10-10zm-3 12H7v-2h2v2zm6 0h-2v-2h2v2z" fill="currentColor"/>
              <path d="M12 4v4M8 5v2M16 5v2" stroke="#1A191B" strokeWidth="1"/>
            </svg>
          );
        }
        if (name.includes("Chestplate")) {
          return (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#3B3A3E]">
              <path d="M6 4h3v2H9c0 1.1-.9 2-2 2s-2-.9-2-2h1zm12 0h-3v2h-1c0 1.1.9 2 2 2s2-.9 2-2h-1z" fill="currentColor"/>
              <path d="M5 8v8c0 2.2 1.8 4 4 4h6c2.2 0 4-1.8 4-4V8H5z" fill="currentColor"/>
              <path d="M9 10h6v3H9z" fill="#1A191B"/>
            </svg>
          );
        }
        if (name.includes("Leggings")) {
          return (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#3B3A3E]">
              <path d="M6 3h12v11h-3v6h-2.5v-6h-1v6H9v-6H6V3z" fill="currentColor"/>
              <path d="M9 3v8M15 3v8" stroke="#1A191B" strokeWidth="1"/>
            </svg>
          );
        }
        // Boots
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#3B3A3E]">
            <path d="M5 14h4v4H5v-4zm10 0h4v4h-4v-4zM5 8h4v6H5V8zm10 0h4v6h-4V8z" fill="currentColor"/>
            <path d="M7 8v6M17 8v6" stroke="#1A191B" strokeWidth="1"/>
          </svg>
        );

      case "weapon":
        if (name.includes("Sword")) {
          return (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#3B3A3E] rotate-45">
              <path d="M19 3l-8 8v1.5l-1.5 1.5H8v1.5l-2.5 2.5a1.5 1.5 0 002 2l2.5-2.5h1.5v-1.5l1.5-1.5h1.5l8-8V3z" fill="currentColor"/>
              <path d="M7 17l-3 3M17 7l-3 3" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          );
        }
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#D97706] rotate-45">
            <path d="M19 3l-8 8v1.5l-1.5 1.5H8v1.5l-2.5 2.5a1.5 1.5 0 002 2l2.5-2.5h1.5v-1.5l1.5-1.5h1.5l8-8V3z" fill="currentColor"/>
            <path d="M7 17l-3 3M17 7l-3 3" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        );

      case "tool":
        if (name.includes("Pickaxe")) {
          return (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#3B3A3E] -rotate-45">
              <path d="M19 3c-1.5 0-3 1.5-3 3v2l-11 11a1.5 1.5 0 102 2l11-11h2c1.5 0 3-1.5 3-3V3h-4z" fill="currentColor"/>
              <path d="M5 19l-3 3M15 9l-2-2" stroke="#1A191B" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          );
        }
        if (name.includes("Axe")) {
          return (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#3B3A3E] -rotate-45">
              <path d="M17 3H9v6h3v10l2.5-2.5v-7.5h2.5V3z" fill="currentColor"/>
              <path d="M5 19l-3 3" stroke="#1A191B" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          );
        }
        // Shovel
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#3B3A3E] -rotate-45">
            <path d="M19 3l-13 13v3h3l13-13V3h-3z" fill="currentColor"/>
            <path d="M5 19l-3 3" stroke="#1A191B" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );

      case "defense":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#B45309] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" fill="currentColor"/>
            <path d="M12 4v16" stroke="#451A03" strokeWidth="1.5"/>
          </svg>
        );

      case "food":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#F59E0B] filter drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="currentColor"/>
            <circle cx="12" cy="12" r="1" fill="#EF4444"/>
          </svg>
        );

      case "travel":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#047857] filter drop-shadow-[0_0_6px_rgba(5,150,105,0.6)]">
            <circle cx="12" cy="12" r="7" fill="currentColor"/>
            <circle cx="12" cy="12" r="3.5" fill="#34D399"/>
            <circle cx="11" cy="11" r="1" fill="#A7F3D0"/>
          </svg>
        );

      case "ammo":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-slate-400 rotate-45">
            <path d="M21 3l-18 18M21 3h-6M21 3v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 20l2-2" stroke="#94A3B8" strokeWidth="1.5"/>
          </svg>
        );

      case "xp":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#10B981] filter drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]">
            <path d="M10 4h4v3h-4V4zm-3 6h10v9H7v-9z" fill="currentColor"/>
            <path d="M12 11v5" stroke="#F59E0B" strokeWidth="1.5"/>
          </svg>
        );

      case "resource":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#4A3B32]">
            <path d="M4 6h16v12H4V6zm2 2v2h4V8H6zm6 4v2h6v-2h-6z" fill="currentColor"/>
            <rect x="5" y="7" width="14" height="10" stroke="#2A1B12" strokeWidth="1" fill="none"/>
          </svg>
        );

      case "shulker":
        let boxColor = "#10B981"; // default green
        if (name.includes("Pink")) boxColor = "#EC4899";
        if (name.includes("Purple")) boxColor = "#8B5CF6";
        if (name.includes("Yellow")) boxColor = "#EAB308";
        if (name.includes("Red")) boxColor = "#EF4444";
        
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" style={{ color: boxColor }}>
            {/* Top face */}
            <path d="M12 3L4 7l8 4 8-4-8-4z" fill="currentColor" opacity="0.8"/>
            {/* Left face */}
            <path d="M4 7v10l8 4V11L4 7z" fill="currentColor" opacity="0.9"/>
            {/* Right face */}
            <path d="M12 11v10l8-4V7l-8 4z" fill="currentColor"/>
          </svg>
        );

      case "block":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#78716C] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5L18.5 7 12 9.5 5.5 7 12 4.5zm-7 4.5l6.5 3.5v7l-6.5-3.5V9z" fill="currentColor"/>
            <circle cx="12" cy="12" r="1" fill="#EF4444"/>
          </svg>
        );

      default:
        return <span className="font-mono text-[9px] font-bold text-slate-800">{name.charAt(0)}</span>;
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Animated Glowing Purple Overlay for Enchanted items */}
      {isEnchanted && (
        <div className="absolute inset-0 bg-purple-500/20 filter blur-sm rounded-lg animate-pulse pointer-events-none mix-blend-screen" />
      )}
      <div className="relative z-10">
        {getIconContent()}
      </div>
    </div>
  );
};

export default function CratesPage() {
  const { addToCart, cart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCrate, setSelectedCrate] = useState<CrateItemType | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"drops" | "screenshot">("drops");

  const [crates, setCrates] = useState<CrateItemType[]>([]);

  useEffect(() => {
    if (selectedCrate) {
      setActiveModalTab("drops");
    }
  }, [selectedCrate]);

  useEffect(() => {
    // Get custom prices if set in localStorage
    const savedPricesStr = localStorage.getItem("bongcraft_prices");
    let customPrices = {
      common: 20,
      rare: 30,
      epic: 50,
      superior: 75
    };
    if (savedPricesStr) {
      try {
        customPrices = { ...customPrices, ...JSON.parse(savedPricesStr) };
      } catch (e) {
        console.error(e);
      }
    }

    const defaultCrates: CrateItemType[] = [
      {
        id: "crate-common",
        name: "Common Crate Key",
        price: customPrices.common,
        accentColor: "#10B981",
        glowClass: "hover:border-emerald-500/40 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]",
        desc: "Unlock the Common Crate. Access starter diamond gear, ingots, and boosters!",
        rewards: [
          { name: "Diamond Sword", type: "weapon" },
          { name: "Diamond Pickaxe", type: "tool" },
          { name: "Diamond Axe", type: "tool" },
          { name: "Coal Block", count: "64x", type: "block" },
          { name: "Iron Ingot", count: "32x", type: "resource" },
          { name: "Gold Ingot", count: "24x", type: "resource" },
          { name: "Emerald", count: "6x", type: "resource" },
          { name: "Diamond", count: "4x", type: "resource" },
          { name: "Netherite Ingot", count: "1x", type: "resource" },
          { name: "Money Roll", count: "2x", type: "resource" },
          { name: "Coin Stack", count: "2x", type: "resource" },
          { name: "EXP Bottle", count: "2x", type: "xp" },
          { name: "Premium Pickaxe", type: "tool" },
          { name: "Blue Key", type: "travel" },
          { name: "Purple Key", type: "travel" },
          { name: "Shulker Box", type: "shulker" },
          { name: "Totem of Undying", type: "defense" },
          { name: "Trident", type: "weapon" },
          { name: "Nether Star", type: "resource" },
          { name: "Shield Upgrade", type: "defense" },
          { name: "Hourglass", type: "travel" },
        ],
      },
      {
        id: "crate-rare",
        name: "Rare Crate Key",
        price: customPrices.rare,
        accentColor: "#3B82F6",
        glowClass: "hover:border-blue-500/40 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]",
        desc: "Unlock the Rare Crate. Contains netherite tools, stackable blocks, and key sets!",
        rewards: [
          { name: "Netherite Sword", type: "weapon" },
          { name: "Netherite Pickaxe", type: "tool" },
          { name: "Netherite Axe", type: "tool" },
          { name: "Coal Block", count: "16x", type: "block" },
          { name: "Iron Block", count: "8x", type: "block" },
          { name: "Gold Ingot", count: "48x", type: "resource" },
          { name: "Emerald", count: "16x", type: "resource" },
          { name: "Diamond", count: "8x", type: "resource" },
          { name: "Netherite Ingot", count: "2x", type: "resource" },
          { name: "Blue Rune Item", type: "resource" },
          { name: "Money Roll", count: "2x", type: "resource" },
          { name: "Coin Stack", count: "2x", type: "resource" },
          { name: "EXP Bottle", count: "2x", type: "xp" },
          { name: "Premium Pickaxe", type: "tool" },
          { name: "Purple Key", type: "travel" },
          { name: "Gold Key", type: "travel" },
          { name: "Totem of Undying", type: "defense" },
          { name: "Trident", type: "weapon" },
          { name: "Nether Star", type: "resource" },
          { name: "Shield Upgrade", type: "defense" },
          { name: "Hourglass", type: "travel" },
        ],
      },
      {
        id: "crate-epic",
        name: "Epic Crate Key",
        price: customPrices.epic,
        accentColor: "#A855F7",
        glowClass: "hover:border-purple-500/40 hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]",
        desc: "Unlock the Epic Crate. Features high-tier weapons, blocks, elytra, and runes!",
        rewards: [
          { name: "Netherite Sword", type: "weapon" },
          { name: "Netherite Pickaxe", type: "tool" },
          { name: "Netherite Axe", type: "tool" },
          { name: "Coal Block", count: "32x", type: "block" },
          { name: "Iron Block", count: "16x", type: "block" },
          { name: "Gold Block", count: "8x", type: "block" },
          { name: "Emerald", count: "32x", type: "resource" },
          { name: "Diamond", count: "12x", type: "resource" },
          { name: "Netherite Ingot", count: "3x", type: "resource" },
          { name: "Blue Rune Item", type: "resource" },
          { name: "Copper Ingot", type: "resource" },
          { name: "Money Roll", count: "2x", type: "resource" },
          { name: "Coin Stack", count: "2x", type: "resource" },
          { name: "EXP Bottle", count: "2x", type: "xp" },
          { name: "Premium Pickaxe", type: "tool" },
          { name: "Gold Key", type: "travel" },
          { name: "Trident", type: "weapon" },
          { name: "Nether Star", type: "resource" },
          { name: "Elytra", type: "travel" },
          { name: "Shield Upgrade", type: "defense" },
          { name: "Hourglass", type: "travel" },
        ],
      },
      {
        id: "crate-superior",
        name: "Superior Crate Key",
        price: customPrices.superior,
        accentColor: "#FBBF24",
        glowClass: "hover:border-amber-500/40 hover:shadow-[0_0_20px_-5px_rgba(251,191,36,0.3)]",
        desc: "The ultimate premium crate! Offers max netherite gear, blocks, double keys, and elytra!",
        rewards: [
          { name: "Netherite Sword", type: "weapon" },
          { name: "Netherite Pickaxe", type: "tool" },
          { name: "Netherite Axe", type: "tool" },
          { name: "Coal Block", count: "64x", type: "block" },
          { name: "Iron Block", count: "32x", type: "block" },
          { name: "Gold Block", count: "16x", type: "block" },
          { name: "Emerald Block", count: "8x", type: "block" },
          { name: "Diamond Block", count: "3x", type: "block" },
          { name: "Netherite Ingot", count: "4x", type: "resource" },
          { name: "Blue Rune Item", type: "resource" },
          { name: "Copper Ingot", type: "resource" },
          { name: "Money Roll", count: "2x", type: "resource" },
          { name: "Coin Stack", count: "2x", type: "resource" },
          { name: "EXP Bottle", count: "2x", type: "xp" },
          { name: "Premium Pickaxe", type: "tool" },
          { name: "Gold Key", count: "2x", type: "travel" },
          { name: "Trident", type: "weapon" },
          { name: "Nether Star", type: "resource" },
          { name: "Elytra", type: "travel" },
          { name: "Shield Upgrade", type: "defense" },
          { name: "Hourglass", type: "travel" },
        ],
        featured: true,
      }
    ];

    setCrates(defaultCrates);
  }, []);

  const isItemInCart = (id: string) => cart.some((cartItem) => cartItem.id === id);

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
              Crate Keys
            </h1>
            <p className="font-inter text-sm text-secondary-text mt-3 max-w-xl mx-auto">
              Test your luck with our custom server crates. Open specific crates to acquire maximum netherite gear sets, scrap stacks, custom spawners, or storage shulker boxes!
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-5" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {crates.map((item) => {
              const itemInCart = isItemInCart(item.id);

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
                      <Key className="w-5 h-5" />
                    </div>

                    <h3 className="font-cinzel text-lg font-bold text-white-text tracking-wide mb-1">
                      {item.name}
                    </h3>
                    <p className="font-inter text-xs text-secondary-text leading-relaxed mb-5">
                      {item.desc}
                    </p>

                    <div className="h-px bg-border-custom mb-5" />

                    {/* Preview Trigger */}
                    <div className="mb-6">
                      <button
                        onClick={() => setSelectedCrate(item)}
                        className="inline-flex items-center gap-1.5 font-inter text-xs text-primary-accent hover:text-gold-accent font-bold uppercase tracking-wider cursor-pointer transition-colors duration-300"
                      >
                        <Info className="w-4 h-4" />
                        Preview Crate Drops
                      </button>
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
                          category: "Crate Keys",
                          accentColor: item.accentColor,
                        })
                      }
                      className={`w-full py-3.5 rounded-xl font-inter font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                        itemInCart
                          ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-500"
                          : "bg-primary-accent hover:bg-primary-accent/90 text-white-text hover:shadow-[0_0_15px_rgba(124,58,237,0.35)]"
                      }`}
                    >
                      {itemInCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add Key
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

      {/* Crate Drops Preview Modal */}
      <AnimatePresence>
        {selectedCrate && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#09090B]/90 backdrop-blur-md"
              onClick={() => setSelectedCrate(null)}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-border-custom shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-border-custom flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-cinzel font-black text-sm border"
                    style={{
                      borderColor: `${selectedCrate.accentColor}30`,
                      background: `${selectedCrate.accentColor}10`,
                      color: selectedCrate.accentColor,
                    }}
                  >
                    <Key className="w-4 h-4" />
                  </div>
                  <h3 className="font-cinzel text-base md:text-lg font-bold text-white-text tracking-wider uppercase">
                    {selectedCrate.name} Drops
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCrate(null)}
                  className="p-2 text-secondary-text hover:text-white-text hover:bg-card-bg/60 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-border-custom px-6 bg-secondary-bg/10 select-none shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveModalTab("drops")}
                  className={`px-4 py-3.5 font-cinzel text-xs font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeModalTab === "drops"
                      ? "border-primary-accent text-white-text"
                      : "border-transparent text-secondary-text hover:text-white-text"
                  }`}
                >
                  ✨ Drops Grid
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("screenshot")}
                  className={`px-4 py-3.5 font-cinzel text-xs font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeModalTab === "screenshot"
                      ? "border-primary-accent text-white-text"
                      : "border-transparent text-secondary-text hover:text-white-text"
                  }`}
                >
                  📸 GUI Screenshot
                </button>
              </div>

              {/* Body */}
              {activeModalTab === "drops" ? (
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                  <div className="space-y-3">
                    <span className="font-cinzel text-[10px] font-bold text-secondary-text uppercase tracking-widest block">
                      Crate Loot Chest contents
                    </span>

                    {/* Minecraft Chest GUI Mockup */}
                    <div className="bg-[#2D2D2D]/95 border-[4px] border-t-[#5E5E5E] border-l-[#5E5E5E] border-r-[#1B1B1B] border-b-[#1B1B1B] rounded-lg p-4.5 shadow-inner">
                      {/* Chest Label */}
                      <div className="font-mono text-xs font-bold text-[#D1D5DB] mb-3.5 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        {selectedCrate.name.split(" ")[0]} Loot Chest
                      </div>
                      
                      {/* Slots Grid (9 columns) */}
                      <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
                        {/* Render Crate Drops in slots */}
                        {selectedCrate.rewards.map((reward, i) => (
                          <div
                            key={i}
                            className="relative aspect-square w-full bg-[#8B8B8B] border-[3px] border-t-[#373737] border-l-[#373737] border-r-[#FFFFFF] border-b-[#FFFFFF] flex items-center justify-center group/slot cursor-help hover:bg-[#9E9E9E] transition-colors rounded"
                          >
                            {/* Proper Graphic SVG Item Icon */}
                            <div className="w-8 h-8 flex items-center justify-center p-1">
                              <MinecraftItemIcon name={reward.name} type={reward.type} />
                            </div>

                            {/* Item count badge (if exists) */}
                            {reward.count && (
                              <span className="absolute bottom-0.5 right-1 font-mono text-[10px] font-black text-white text-shadow-sm select-none z-15">
                                {reward.count.replace("x", "")}
                              </span>
                            )}

                            {/* Interactive Hover Tooltip */}
                            <div className="absolute bottom-[115%] left-1/2 -translate-x-1/2 bg-[#09090B]/95 border border-border-custom px-3 py-1.5 rounded-lg pointer-events-none opacity-0 group-hover/slot:opacity-100 transition-opacity duration-200 whitespace-nowrap z-25 shadow-xl">
                              <span className="font-mono text-xs font-bold text-gold-accent">{reward.name}</span>
                              {reward.count && <span className="font-mono text-[10px] text-secondary-text ml-1.5">x{reward.count.replace("x", "")}</span>}
                            </div>
                          </div>
                        ))}

                        {/* Fill remaining slots to make 9 slots minimal grid */}
                        {[...Array(Math.max(0, 9 - selectedCrate.rewards.length))].map((_, i) => (
                          <div
                            key={`empty-${i}`}
                            className="aspect-square w-full bg-[#8B8B8B] border-[3px] border-t-[#373737] border-l-[#373737] border-r-[#FFFFFF] border-b-[#FFFFFF] opacity-20 rounded"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel text-[10px] font-bold text-secondary-text uppercase tracking-widest block">
                        In-Game Crate GUI Preview
                      </span>
                      <span className="font-inter text-[10px] text-gold-accent font-bold uppercase tracking-wider">
                        Real-time Server drops
                      </span>
                    </div>

                    <div className="relative border border-border-custom/80 rounded-2xl overflow-hidden bg-primary-bg/40 p-2 group/crate-img shadow-inner shadow-black flex items-center justify-center min-h-[150px]">
                      <img
                        src={`/images/crates/${selectedCrate.id.replace("crate-", "")}_crate.png`}
                        alt={`${selectedCrate.name} Screenshot`}
                        className="w-full max-h-[300px] object-contain rounded-xl group-hover/crate-img:scale-[1.01] transition-transform duration-500 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-5 border-t border-border-custom bg-secondary-bg/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-inter text-xs text-secondary-text font-semibold uppercase tracking-wider">
                    Price:
                  </span>
                  <span className="font-cinzel text-2xl font-extrabold text-gold-accent text-glow-gold">
                    ₹{selectedCrate.price}
                  </span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedCrate(null)}
                    className="flex-1 sm:flex-initial px-5 py-3 border border-border-custom text-secondary-text hover:text-white-text hover:bg-card-bg rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      addToCart({
                        id: selectedCrate.id,
                        name: selectedCrate.name,
                        price: selectedCrate.price,
                        category: "Crate Keys",
                        accentColor: selectedCrate.accentColor,
                      });
                      setSelectedCrate(null);
                    }}
                    className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-inter font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                      isItemInCart(selectedCrate.id)
                        ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-500"
                        : "bg-primary-accent hover:bg-primary-accent/90 text-white-text hover:shadow-[0_0_15px_rgba(124,58,237,0.35)]"
                    }`}
                  >
                    {isItemInCart(selectedCrate.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add Key
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
