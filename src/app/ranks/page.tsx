"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { FeaturedRank } from "@/components/FeaturedRank";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, ShoppingCart, Star, X, Info, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";

interface RankType {
  id: string;
  name: string;
  price: number;
  accentColor: string;
  glowClass: string;
  desc: string;
  perks: string[];
  chatPrefix: string;
  chatColor: string;
  detailedPerks: {
    commands: { cmd: string; desc: string }[];
    economy: string[];
    bonuses: string[];
  };
  featured?: boolean;
}

const kitItemsMap: Record<string, { name: string; qty: number; rarity: 'common' | 'rare' | 'epic' | 'legendary' }[]> = {
  'rank-knight': [
    { name: "Diamond Sword", qty: 1, rarity: "rare" },
    { name: "Diamond Pickaxe", qty: 1, rarity: "rare" },
    { name: "Diamond Axe", qty: 1, rarity: "rare" },
    { name: "Diamond Shovel", qty: 1, rarity: "rare" },
    { name: "Iron Helmet", qty: 1, rarity: "common" },
    { name: "Iron Chestplate", qty: 1, rarity: "common" },
    { name: "Iron Leggings", qty: 1, rarity: "common" },
    { name: "Iron Boots", qty: 1, rarity: "common" },
    { name: "Cooked Beef", qty: 16, rarity: "common" },
    { name: "Oak Log", qty: 64, rarity: "common" },
    { name: "Iron Ingot", qty: 32, rarity: "common" },
    { name: "Gold Ingot", qty: 16, rarity: "common" },
    { name: "Diamond", qty: 4, rarity: "rare" },
    { name: "Netherite Ingot", qty: 1, rarity: "epic" }
  ],
  'rank-lord': [
    { name: "Diamond Sword", qty: 1, rarity: "rare" },
    { name: "Diamond Pickaxe", qty: 1, rarity: "rare" },
    { name: "Diamond Axe", qty: 1, rarity: "rare" },
    { name: "Diamond Shovel", qty: 1, rarity: "rare" },
    { name: "Diamond Helmet", qty: 1, rarity: "rare" },
    { name: "Iron Chestplate", qty: 1, rarity: "common" },
    { name: "Iron Leggings", qty: 1, rarity: "common" },
    { name: "Diamond Boots", qty: 1, rarity: "rare" },
    { name: "Cooked Beef", qty: 32, rarity: "common" },
    { name: "Oak Log", qty: 64, rarity: "common" },
    { name: "Gold Ingot", qty: 32, rarity: "common" },
    { name: "Diamond", qty: 6, rarity: "rare" }
  ],
  'rank-paladin': [
    { name: "Netherite Sword", qty: 1, rarity: "epic" },
    { name: "Netherite Pickaxe", qty: 1, rarity: "epic" },
    { name: "Diamond Axe", qty: 1, rarity: "rare" },
    { name: "Diamond Shovel", qty: 1, rarity: "rare" },
    { name: "Diamond Helmet", qty: 1, rarity: "rare" },
    { name: "Diamond Chestplate", qty: 1, rarity: "rare" },
    { name: "Diamond Leggings", qty: 1, rarity: "rare" },
    { name: "Diamond Boots", qty: 1, rarity: "rare" },
    { name: "Cooked Beef", qty: 48, rarity: "common" },
    { name: "Golden Apple", qty: 4, rarity: "epic" },
    { name: "Oak Log", qty: 64, rarity: "common" },
    { name: "Oak Log", qty: 64, rarity: "common" },
    { name: "Gold Ingot", qty: 64, rarity: "common" },
    { name: "Diamond", qty: 8, rarity: "rare" },
    { name: "Shulker Box", qty: 4, rarity: "epic" }
  ],
  'rank-duke': [
    { name: "Netherite Sword", qty: 1, rarity: "epic" },
    { name: "Netherite Pickaxe", qty: 1, rarity: "epic" },
    { name: "Netherite Axe", qty: 1, rarity: "epic" },
    { name: "Diamond Shovel", qty: 1, rarity: "rare" },
    { name: "Netherite Helmet", qty: 1, rarity: "epic" },
    { name: "Diamond Chestplate", qty: 1, rarity: "rare" },
    { name: "Diamond Leggings", qty: 1, rarity: "rare" },
    { name: "Netherite Boots", qty: 1, rarity: "epic" },
    { name: "Cooked Beef", qty: 48, rarity: "common" },
    { name: "Golden Apple", qty: 8, rarity: "epic" },
    { name: "Gold Ingot", qty: 64, rarity: "common" },
    { name: "Diamond", qty: 12, rarity: "rare" },
    { name: "Netherite Ingot", qty: 2, rarity: "epic" },
    { name: "Shulker Box", qty: 4, rarity: "epic" }
  ],
  'rank-king': [
    { name: "Netherite Sword", qty: 1, rarity: "epic" },
    { name: "Netherite Pickaxe", qty: 1, rarity: "epic" },
    { name: "Netherite Axe", qty: 1, rarity: "epic" },
    { name: "Netherite Shovel", qty: 1, rarity: "epic" },
    { name: "Netherite Helmet", qty: 1, rarity: "epic" },
    { name: "Netherite Chestplate", qty: 1, rarity: "epic" },
    { name: "Netherite Leggings", qty: 1, rarity: "epic" },
    { name: "Netherite Boots", qty: 1, rarity: "epic" },
    { name: "Cooked Beef", qty: 48, rarity: "common" },
    { name: "Golden Apple", qty: 1, rarity: "epic" },
    { name: "Gold Ingot", qty: 64, rarity: "common" },
    { name: "Diamond", qty: 16, rarity: "rare" },
    { name: "Netherite Ingot", qty: 3, rarity: "epic" },
    { name: "Shulker Box", qty: 4, rarity: "epic" },
    { name: "Nether Star", qty: 1, rarity: "legendary" }
  ]
};

export default function RanksPage() {
  const { addToCart, cart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState<RankType | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"perks" | "kit">("perks");

  const [ranks, setRanks] = useState<RankType[]>([]);

  const [customPrices, setCustomPrices] = useState({
    knight: 99,
    lord: 399,
    paladin: 699,
    duke: 999,
    king: 1499
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/config/public");
        const config = await res.json();
        if (config && config.prices) {
          setCustomPrices(prev => ({ ...prev, ...config.prices }));
        }
      } catch (e) {
        console.error("Failed to load prices from public API:", e);
        const savedPricesStr = localStorage.getItem("bongcraft_prices");
        if (savedPricesStr) {
          try {
            setCustomPrices(prev => ({ ...prev, ...JSON.parse(savedPricesStr) }));
          } catch (err) {
            console.error(err);
          }
        }
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    if (selectedRank) {
      setActiveModalTab("perks");
    }
  }, [selectedRank]);

  useEffect(() => {
    const defaultRanks: RankType[] = [
      {
        id: "rank-knight",
        name: "Knight",
        price: customPrices.knight,
        accentColor: "#94A3B8",
        glowClass: "hover:border-[#94A3B8]/40 hover:shadow-[0_0_30px_-5px_rgba(148,163,184,0.3)]",
        desc: "Level 1 Starter RPG Rank",
        perks: [
          "3 Auction Listings",
          "2 Order Listings",
          "2 Homes",
          "Access to /kit knight",
          "Knight Prefix Badge",
          "100 Coins & 1 Crate Key"
        ],
        chatPrefix: "&7&lKNIGHT",
        chatColor: "text-slate-400",
        detailedPerks: {
          commands: [
            { cmd: "/kit knight", desc: "Claim the standard Knight starter equipment kit." }
          ],
          economy: [
            "3 Auction Listings (Sell 3 items simultaneously on /ah)",
            "2 Order Listings (Request 2 items in player markets)",
            "Set up to 2 homes (/sethome)"
          ],
          bonuses: [
            "100 Server Coins instantly credited",
            "1x Crate Key bonus",
            "Exclusive [Knight] chat prefix badge"
          ]
        }
      },
      {
        id: "rank-lord",
        name: "Lord",
        price: customPrices.lord,
        accentColor: "#3B82F6",
        glowClass: "hover:border-[#3B82F6]/40 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
        desc: "Level 2 Premium RPG Rank",
        perks: [
          "5 Auction Listings",
          "3 Order Listings",
          "4 Homes",
          "Access to /sit & /hat",
          "Lord Kit & Prefix",
          "250 Coins & 2 Crate Keys"
        ],
        chatPrefix: "&9&lLORD",
        chatColor: "text-blue-400",
        detailedPerks: {
          commands: [
            { cmd: "/sit", desc: "Allows you to sit down anywhere on the ground." },
            { cmd: "/hat", desc: "Wear any block or item on your head." }
          ],
          economy: [
            "5 Auction Listings (Sell 5 items simultaneously on /ah)",
            "3 Order Listings (Request 3 items in player markets)",
            "Set up to 4 homes (/sethome)"
          ],
          bonuses: [
            "250 Server Coins instantly credited",
            "2x Crate Keys bonus",
            "Exclusive [Lord] chat prefix & kit access"
          ]
        }
      },
      {
        id: "rank-paladin",
        name: "Paladin",
        price: customPrices.paladin,
        accentColor: "#FBBF24",
        glowClass: "hover:border-[#FBBF24]/40 hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]",
        desc: "Level 3 Guardian RPG Rank",
        perks: [
          "7 Auction Listings",
          "5 Order Listings",
          "6 Homes",
          "Access to /workbench",
          "Access to /condense",
          "Paladin Kit & Prefix",
          "500 Coins & 3 Crate Keys"
        ],
        chatPrefix: "&e&lPALADIN",
        chatColor: "text-yellow-400",
        detailedPerks: {
          commands: [
            { cmd: "/workbench", desc: "Open a virtual crafting table anywhere." },
            { cmd: "/condense", desc: "Instantly compact blocks and ingots in your inventory." }
          ],
          economy: [
            "7 Auction Listings (Sell 7 items simultaneously on /ah)",
            "5 Order Listings (Request 5 items in player markets)",
            "Set up to 6 homes (/sethome)"
          ],
          bonuses: [
            "500 Server Coins instantly credited",
            "3x Crate Keys bonus",
            "Exclusive [Paladin] chat prefix & kit access"
          ]
        }
      },
      {
        id: "rank-duke",
        name: "Duke",
        price: customPrices.duke,
        accentColor: "#A855F7",
        glowClass: "hover:border-[#A855F7]/40 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]",
        desc: "Level 4 Sovereign RPG Rank",
        perks: [
          "5 Auction Slots (+5)",
          "10 Homes (+10)",
          "3 Player Warps (+3)",
          "8 Claim Blocks (+8)",
          "Access to /disposal & /craft",
          "Access to /nick & /back",
          "Access to /feed",
          "Duke Kit & Prefix"
        ],
        chatPrefix: "&d&lDUKE",
        chatColor: "text-purple-400",
        detailedPerks: {
          commands: [
            { cmd: "/disposal", desc: "Open a remote disposal menu." },
            { cmd: "/nick", desc: "Change your display name in tag and chat." },
            { cmd: "/back", desc: "Return to your previous location." },
            { cmd: "/craft", desc: "Open a remote crafting table." },
            { cmd: "/feed", desc: "Restore your saturation fully." }
          ],
          economy: [
            "5 Auction Slots (+5 simultaneous listings on /ah)",
            "10 Homes slots (+10 /sethome)",
            "3 Player Warps (pwarp slots)",
            "8 Claims slots (+8 claim blocks)"
          ],
          bonuses: [
            "Exclusive [Duke] prefix in TAB and Chat",
            "Claim weekly kit via /kits"
          ]
        }
      },
      {
        id: "rank-king",
        name: "King",
        price: customPrices.king,
        accentColor: "#EF4444",
        glowClass: "hover:border-[#EF4444]/40 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]",
        desc: "Tier 5 Premium Rank",
        perks: [
          "6 Auction Slots (+6)",
          "12 Homes (+12)",
          "3 Player Warps (+3)",
          "10 Claim Blocks (+10)",
          "Access to /disposal & /craft",
          "Access to /nick & /back",
          "Access to /feed & /enderchest",
          "King Kit & Prefix"
        ],
        chatPrefix: "&c&lKING",
        chatColor: "text-rose-500",
        featured: true,
        detailedPerks: {
          commands: [
            { cmd: "/disposal", desc: "Open a remote disposal menu." },
            { cmd: "/nick", desc: "Change your display name in tag and chat." },
            { cmd: "/back", desc: "Return to your previous location." },
            { cmd: "/craft", desc: "Open a remote crafting table." },
            { cmd: "/feed", desc: "Restore your saturation fully." },
            { cmd: "/enderchest", desc: "Open your enderchest anywhere." }
          ],
          economy: [
            "6 Auction Slots (+6 simultaneous listings on /ah)",
            "12 Homes slots (+12 /sethome)",
            "3 Player Warps (pwarp slots)",
            "10 Claims slots (+10 claim blocks)"
          ],
          bonuses: [
            "Exclusive [King] prefix in TAB and Chat",
            "Claim weekly kit via /kits"
          ]
        }
      }
    ];

    setRanks(defaultRanks);
  }, [customPrices]);

  const isItemInCart = (id: string) => cart.some((cartItem) => cartItem.id === id);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
              BongCraft SMP Shop
            </span>
            <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
              Server Ranks
            </h1>
            <p className="font-inter text-sm text-secondary-text mt-3 max-w-xl mx-auto">
              Choose your rank tier. Gain exclusive abilities, prefix badges, coin boosts, and unique server commands.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-5" />
          </div>

          {/* Featured Showcase */}
          <FeaturedRank />

          {/* Catalog Ranks List */}
          <div className="py-10">
            <h2 className="font-cinzel text-xl md:text-2xl font-bold text-white-text tracking-wider uppercase text-center mb-12">
              All Available Tiers
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {ranks.map((item) => {
                const accentColor = item.accentColor;
                const glowClass = item.glowClass;
                const itemInCart = isItemInCart(item.id);

                return (
                  <div
                    key={item.id}
                    className={`glass-panel p-5 rounded-2xl border border-border-custom transition-all duration-400 group flex flex-col justify-between cursor-default ${glowClass} ${
                      item.featured ? "border-gold-accent/35" : ""
                    }`}
                  >
                    {item.featured && (
                      <div className="absolute top-0 right-0 bg-gold-accent text-primary-bg px-2.5 py-0.5 rounded-bl-lg font-inter text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-0.5 shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Best
                      </div>
                    )}

                    <div>
                      {/* Icon */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-cinzel font-black text-lg border mb-3 transition-all duration-300 relative group-hover:scale-105"
                        style={{
                          borderColor: `${accentColor}30`,
                          background: `${accentColor}10`,
                          color: accentColor,
                        }}
                      >
                        <Crown className="w-4 h-4" />
                      </div>

                      <h3 className="font-cinzel text-sm font-bold text-white-text tracking-wide mb-0.5 truncate">
                        {item.name}
                      </h3>
                      <p className="font-inter text-[9px] text-secondary-text leading-tight mb-3">
                        {item.desc}
                      </p>

                      <div className="h-px bg-border-custom mb-3" />

                      {/* Perks Summary */}
                      <div className="space-y-1.5 mb-4">
                        {item.perks.slice(0, 4).map((perk, i) => (
                          <div key={i} className="flex items-start gap-1 text-[11px] text-secondary-text">
                            <Check className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-emerald-500" />
                            <span className="font-inter text-white-text/80 text-[10px] leading-tight truncate">{perk}</span>
                          </div>
                        ))}
                        {item.perks.length > 4 && (
                          <button
                            onClick={() => setSelectedRank(item)}
                            className="font-inter text-[9px] text-primary-accent hover:text-gold-accent font-bold uppercase tracking-wider block pt-1.5 cursor-pointer"
                          >
                            + {item.perks.length - 4} More Perks
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-2">
                      <div className="flex items-baseline justify-between gap-1 mb-2.5">
                        <div className="flex items-baseline gap-0.5">
                          <span className="font-inter text-[8px] text-secondary-text font-semibold uppercase tracking-wider">
                            Price:
                          </span>
                          <span className="font-cinzel text-base font-bold text-gold-accent">
                            ₹{item.price}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedRank(item)}
                          className="flex items-center gap-0.5 font-inter text-[9px] text-secondary-text hover:text-white-text font-bold cursor-pointer"
                          title="Preview full rank benefits"
                        >
                          <Info className="w-3.5 h-3.5" />
                          Details
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: `${item.name} Rank`,
                            price: item.price,
                            category: "Premium Ranks",
                            accentColor,
                          })
                        }
                        className={`w-full py-2.5 rounded-lg font-inter font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 ${
                          itemInCart
                            ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-500"
                            : "bg-primary-accent hover:bg-primary-accent/90 text-white-text hover:shadow-[0_0_12px_rgba(124,58,237,0.35)]"
                        }`}
                      >
                        {itemInCart ? (
                          <>
                            <Check className="w-2.5 h-2.5" />
                            In Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-2.5 h-2.5" />
                            Add
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Rank Detailed Preview Modal Overlay */}
      <AnimatePresence>
        {selectedRank && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#09090B]/90 backdrop-blur-md"
              onClick={() => setSelectedRank(null)}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-border-custom shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-border-custom flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-cinzel font-black text-sm border"
                    style={{
                      borderColor: `${selectedRank.accentColor}30`,
                      background: `${selectedRank.accentColor}10`,
                      color: selectedRank.accentColor,
                    }}
                  >
                    <Crown className="w-4 h-4" />
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-white-text tracking-wider uppercase">
                    {selectedRank.name} TIER PREVIEW
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRank(null)}
                  className="p-2 text-secondary-text hover:text-white-text hover:bg-card-bg/60 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-border-custom px-6 bg-secondary-bg/10 select-none shrink-0 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveModalTab("perks")}
                  className={`relative px-4 py-3.5 font-cinzel text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                    activeModalTab === "perks"
                      ? "text-white-text"
                      : "text-secondary-text hover:text-white-text"
                  }`}
                >
                  <span className="relative z-10">✨ Perks & Commands</span>
                  {activeModalTab === "perks" && (
                    <motion.div
                      layoutId="activeRankTabBorder"
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-primary-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("kit")}
                  className={`relative px-4 py-3.5 font-cinzel text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                    activeModalTab === "kit"
                      ? "text-white-text"
                      : "text-secondary-text hover:text-white-text"
                  }`}
                >
                  <span className="relative z-10">🎒 Kit Preview</span>
                  {activeModalTab === "kit" && (
                    <motion.div
                      layoutId="activeRankTabBorder"
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-primary-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </div>

              {/* Body */}
              {activeModalTab === "perks" ? (
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                  {/* Visual Chat prefix preview simulator */}
                  <div className="space-y-2.5">
                    <span className="font-cinzel text-[10px] font-bold text-secondary-text uppercase tracking-widest block">
                      In-Game Chat Prefix Simulation
                    </span>
                    <div className="bg-primary-bg/70 border border-border-custom rounded-2xl p-4 font-mono text-xs space-y-2 select-none">
                      <div className="flex items-start gap-1">
                        <span className="text-secondary-text/50">[21:45:08]</span>
                        <div className="flex-1 flex flex-wrap gap-1 leading-normal">
                          <span
                            className={`font-extrabold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${selectedRank.chatColor}`}
                          >
                            {selectedRank.name.toUpperCase()}
                          </span>
                          <span className="text-slate-300 font-bold">Neeeeeel:</span>
                          <span className="text-white">Bengal's Ultimate Survival Experience! 🔥</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabbed Perks Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Commands */}
                    <div className="space-y-3">
                      <span className="font-cinzel text-[10px] font-bold text-primary-accent uppercase tracking-widest block border-b border-primary-accent/20 pb-1.5">
                        🛡️ Commands Unlocked
                      </span>
                      <div className="space-y-2.5">
                        {selectedRank.detailedPerks.commands.length > 0 ? (
                          selectedRank.detailedPerks.commands.map((cmd, i) => (
                            <div key={i} className="space-y-0.5">
                              <span className="font-mono text-xs font-bold text-gold-accent">{cmd.cmd}</span>
                              <p className="font-inter text-xs text-secondary-text leading-tight">{cmd.desc}</p>
                            </div>
                          ))
                        ) : (
                          <span className="font-inter text-xs text-secondary-text italic block">
                            No specialized commands unlocked for this basic starter tier.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Economy & Storage */}
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <span className="font-cinzel text-[10px] font-bold text-primary-accent uppercase tracking-widest block border-b border-primary-accent/20 pb-1.5">
                          📦 Storage & Economy
                        </span>
                        <div className="space-y-1.5">
                          {selectedRank.detailedPerks.economy.map((eco, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-secondary-text">
                              <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                              <span className="font-inter leading-tight">{eco}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Keys & Bonuses */}
                      <div className="space-y-3">
                        <span className="font-cinzel text-[10px] font-bold text-primary-accent uppercase tracking-widest block border-b border-primary-accent/20 pb-1.5">
                          🪙 Crate & Coin Bonuses
                        </span>
                        <div className="space-y-1.5">
                          {selectedRank.detailedPerks.bonuses.map((bonus, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-secondary-text">
                              <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                              <span className="font-inter leading-tight">{bonus}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel text-[10px] font-bold text-secondary-text uppercase tracking-widest block">
                        Kit {selectedRank.name} Showcase
                      </span>
                      <span className="font-inter text-[10px] text-gold-accent font-bold uppercase tracking-wider">
                        Available Weekly in-game
                      </span>
                    </div>

                    {/* Screenshot image (if available) */}
                    {["rank-knight", "rank-lord", "rank-paladin", "rank-king"].includes(selectedRank.id) ? (
                      <div className="relative border border-border-custom/80 rounded-2xl overflow-hidden bg-primary-bg/40 p-2 group/kit-img shadow-inner shadow-black flex items-center justify-center min-h-[150px]">
                        <img
                          src={`/images/kits/${selectedRank.id.replace("rank-", "")}_kit.png`}
                          alt={`${selectedRank.name} Kit Preview`}
                          className="w-full max-h-[300px] object-contain rounded-xl group-hover/kit-img:scale-[1.01] transition-transform duration-500 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                        />
                      </div>
                    ) : (
                      <div className="bg-primary-bg/30 border border-border-custom/50 rounded-2xl p-8 text-center space-y-2">
                        <Crown className="w-8 h-8 mx-auto text-secondary-text/40 animate-pulse" />
                        <p className="font-inter text-xs text-secondary-text">
                          No screenshot preview available for this rank's kit. Please review the item grid below.
                        </p>
                      </div>
                    )}

                    {/* Item Grid */}
                    <div className="space-y-3">
                      <span className="font-cinzel text-[10px] font-bold text-primary-accent uppercase tracking-widest block border-b border-primary-accent/20 pb-1.5">
                        📦 Included Kit Items
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {kitItemsMap[selectedRank.id]?.map((item, i) => (
                          <div 
                            key={i} 
                            className="flex items-center justify-between px-3 py-2 bg-secondary-bg/40 border border-border-custom/60 rounded-xl text-xs hover:border-primary-accent/40 transition-colors"
                          >
                            <span className="text-white-text font-inter truncate max-w-[120px]" title={item.name}>
                              {item.name}
                            </span>
                            <span 
                              className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                                item.rarity === "legendary" 
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : item.rarity === "epic"
                                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                  : item.rarity === "rare"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                              }`}
                            >
                              x{item.qty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Checkout Actions */}
              <div className="px-6 py-5 border-t border-border-custom bg-secondary-bg/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-inter text-xs text-secondary-text font-semibold uppercase tracking-wider">
                    Price:
                  </span>
                  <span className="font-cinzel text-2xl font-extrabold text-gold-accent text-glow-gold">
                    ₹{selectedRank.price}
                  </span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedRank(null)}
                    className="flex-1 sm:flex-initial px-5 py-3 border border-border-custom text-secondary-text hover:text-white-text hover:bg-card-bg rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      addToCart({
                        id: selectedRank.id,
                        name: `${selectedRank.name} Rank`,
                        price: selectedRank.price,
                        category: "Premium Ranks",
                        accentColor: selectedRank.accentColor,
                      });
                      setSelectedRank(null);
                    }}
                    className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-inter font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                      isItemInCart(selectedRank.id)
                        ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-500"
                        : "bg-primary-accent hover:bg-primary-accent/90 text-white-text hover:shadow-[0_0_15px_rgba(124,58,237,0.35)]"
                    }`}
                  >
                    {isItemInCart(selectedRank.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Claim Rank
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
