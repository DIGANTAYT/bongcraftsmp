"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Key, Coins, Gift, ShoppingCart, Check, Star, Footprints } from "lucide-react";

type Category = "ranks" | "keys" | "coins" | "bundles" | "cosmetics";

export const StoreSection: React.FC = () => {
  const { addToCart, cart } = useCart();
  const [activeCategory, setActiveCategory] = useState<Category>("ranks");
  
  const [customPrices, setCustomPrices] = useState({
    knight: 99,
    lord: 399,
    paladin: 699,
    duke: 999,
    king: 1499,
    common_crate: 20,
    rare_crate: 30,
    epic_crate: 50,
    superior_crate: 75,
    coins500: 49,
    coins1200: 99,
    coins2500: 199,
    coins6000: 399,
    coins12000: 699
  });

  useEffect(() => {
    const savedPricesStr = localStorage.getItem("bongcraft_prices");
    if (savedPricesStr) {
      try {
        setCustomPrices(prev => ({ ...prev, ...JSON.parse(savedPricesStr) }));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const categories = [
    { id: "ranks", label: "Premium Ranks", icon: <Crown className="w-4 h-4" /> },
    { id: "keys", label: "Crate Keys", icon: <Key className="w-4 h-4" /> },
    { id: "coins", label: "Coins", icon: <Coins className="w-4 h-4" /> },
    { id: "bundles", label: "Bundles", icon: <Gift className="w-4 h-4" /> },
    { id: "cosmetics", label: "Cosmetics & Pets", icon: <Footprints className="w-4 h-4" /> },
  ];

  // Actual Server Ranks Data
  const ranks = [
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
        "100 Coins & 1 Key"
      ],
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
        "250 Coins & 2 Keys"
      ],
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
        "Paladin Kit & Prefix"
      ],
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
      featured: true,
    },
  ];

  // Keys Data
  const keys = [
    {
      id: "crate-common",
      name: "Common Crate Key",
      price: customPrices.common_crate,
      desc: "Unlock the Common Crate. Access starter diamond gear, ingots, and boosters!",
      perks: ["Unlocks Common Crate", "Diamond Weapons & Tools", "64x Coal Blocks", "Ingots, Coins & EXP Boosters"],
    },
    {
      id: "crate-rare",
      name: "Rare Crate Key",
      price: customPrices.rare_crate,
      desc: "Unlock the Rare Crate. Contains netherite tools, stackable blocks, and key sets!",
      perks: ["Unlocks Rare Crate", "Netherite Weapons & Tools", "8x Iron Blocks", "Gold Keys & EXP Boosters"],
    },
    {
      id: "crate-epic",
      name: "Epic Crate Key",
      price: customPrices.epic_crate,
      desc: "Unlock the Epic Crate. Features high-tier weapons, blocks, elytra, and runes!",
      perks: ["Unlocks Epic Crate", "Netherite Tools & Weapons", "8x Gold Blocks", "Elytra, Rune Items & Keys"],
    },
    {
      id: "crate-superior",
      name: "Superior Crate Key",
      price: customPrices.superior_crate,
      desc: "The ultimate premium crate! Offers max netherite gear, blocks, double keys, and elytra!",
      perks: ["Unlocks Superior Crate", "Netherite Tools & Weapons", "16x Gold Blocks", "3x Diamond Blocks & Elytra"],
      featured: true,
    },
  ];

  // Coins Data
  const coins = [
    {
      id: "coins-500",
      name: "500 Coins Pack",
      price: customPrices.coins500,
      desc: "Handy pocket currency pack",
      perks: ["Buy basic shop items", "Rent claims", "Trade in player markets"],
    },
    {
      id: "coins-1200",
      name: "1,200 Coins Pack",
      price: customPrices.coins1200,
      desc: "A solid wallet balance boost",
      perks: ["Buy claims & boosters", "Unlock custom prefixes", "Purchase spawners"],
    },
    {
      id: "coins-2500",
      name: "2,500 Coins Pack",
      price: customPrices.coins2500,
      desc: "Popular Value Pack",
      perks: ["Buy premium shop enchants", "Unlock custom pets", "Dominate server auctions"],
      featured: true,
    },
    {
      id: "coins-6000",
      name: "6,000 Coins Pack",
      price: customPrices.coins6000,
      desc: "The Wealthy Lord Treasury",
      perks: ["Unlimited claims expansion", "Buy top-tier gear sets", "Unlock elite server items"],
    },
    {
      id: "coins-12000",
      name: "12,000 Coins Pack",
      price: customPrices.coins12000,
      desc: "The Sovereign King Vault",
      perks: ["Perfect for claim scaling", "Buy multiple elite spawner cores", "Bypass auction bid wars"],
    },
  ];

  // Bundles Data
  const bundles = [
    {
      id: "bundle-starter",
      name: "Bengal Starter Pack",
      price: 499,
      desc: "Excellent value for new survivalists",
      perks: ["Full diamond gear set", "32 golden apples", "100 Server Coins", "2 Common Crate Keys", "/feed kit bonus"],
    },
    {
      id: "bundle-royal",
      name: "Royal Conqueror Pack",
      price: 1999,
      desc: "Mid-game mastery kit setup",
      perks: ["Full netherite gear set", "64 golden apples", "800 Server Coins", "5 Rare Crate Keys", "Custom 'Royal' Chat Prefix"],
      featured: true,
    },
    {
      id: "bundle-overlord",
      name: "Ultimate Overlord Chest",
      price: 3499,
      desc: "Bengal's ultimate sovereign bundle",
      perks: ["Custom level 100 netherite gear", "Custom elytra with firework trails", "2,000 Server Coins", "5 BongCraft Crate Keys", "Custom 'Overlord' Tag"],
    },
  ];

  // Cosmetics Data
  const cosmetics = [
    {
      id: "cos-wings",
      name: "Ender Dragon Wings",
      price: 299,
      desc: "Stunning animated dark dragon wings",
      perks: ["Fully animated wings", "Custom particles when running", "Visual only (no flying attributes)"],
    },
    {
      id: "cos-tiger-pet",
      name: "Pet Bengal Tiger",
      price: 499,
      desc: "A loyal mini Royal Bengal Tiger companion",
      perks: ["Follows you everywhere in spawn & claims", "Performs tricks on command", "Exclusive golden tiger particles"],
      featured: true,
    },
    {
      id: "cos-trails",
      name: "Magical Aura Trails",
      price: 199,
      desc: "Drifting magic particle trail pack",
      perks: ["Includes: Helix, Fire, Portal, Nebula", "Equip/unequip via /cosmetics menu", "Visible to all players"],
    },
  ];

  const getActiveItems = () => {
    switch (activeCategory) {
      case "ranks":
        return ranks;
      case "keys":
        return keys;
      case "coins":
        return coins;
      case "bundles":
        return bundles;
      case "cosmetics":
        return cosmetics;
      default:
        return [];
    }
  };

  const currentItems = getActiveItems();

  return (
    <section id="store" className="py-20 relative z-10 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
            BongCraft Marketplace
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
            Imperial Store
          </h2>
          <p className="font-inter text-sm text-secondary-text mt-3 max-w-xl mx-auto">
            Upgrade your survival experience. Secure checkouts, instant in-game item delivery, and dedicated community support.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-5" />
        </div>

        {/* Categories Selector Tabs */}
        <div className="flex overflow-x-auto gap-3 pb-4 justify-start md:justify-center no-scrollbar mask-gradient mb-12">
          <div className="flex gap-2.5 p-1.5 bg-[#111217]/80 border border-border-custom rounded-2xl backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as Category)}
                className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "text-white-text"
                    : "text-secondary-text hover:text-white-text"
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.span
                    layoutId="activeStoreCategory"
                    className="absolute inset-0 bg-primary-accent rounded-xl -z-1 shadow-lg shadow-primary-accent/25"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  {cat.icon}
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {currentItems.map((item) => {
              const accentColor = (item as any).accentColor || "var(--color-primary-accent)";
              const glowClass = (item as any).glowClass || "hover:border-primary-accent/40 hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.25)]";
              const isItemInCart = cart.some((cartItem) => cartItem.id === item.id);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  className={`glass-panel p-6.5 rounded-3xl flex flex-col justify-between relative overflow-hidden border border-border-custom transition-all duration-400 group cursor-default ${glowClass} ${
                    (item as any).featured ? "border-gold-accent/30" : ""
                  }`}
                >
                  {/* Featured Highlight Glow / Ribbon */}
                  {(item as any).featured && (
                    <div className="absolute top-0 right-0 bg-gold-accent text-primary-bg px-4 py-1.5 rounded-bl-2xl font-inter text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current" />
                      Popular
                    </div>
                  )}

                  {/* Core Info */}
                  <div>
                    {/* Visual Icon Box */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-cinzel font-black text-xl border mb-5 transition-all duration-300 relative group-hover:scale-105"
                      style={{
                        borderColor: `${accentColor}30`,
                        background: `${accentColor}10`,
                        color: accentColor,
                      }}
                    >
                      <div className="absolute inset-0 filter blur-md opacity-25 rounded-2xl" style={{ backgroundColor: accentColor }} />
                      <span className="relative z-10">{item.name.charAt(0)}</span>
                    </div>

                    <h3 className="font-cinzel text-lg md:text-xl font-extrabold text-white-text tracking-wide mb-1 flex items-center gap-1.5">
                      {item.name}
                    </h3>
                    <p className="font-inter text-xs text-secondary-text leading-relaxed mb-5">
                      {item.desc}
                    </p>

                    <div className="h-px bg-border-custom mb-5" />

                    {/* Perks List */}
                    <div className="space-y-2 mb-6">
                      <span className="font-cinzel text-[9px] font-bold text-secondary-text uppercase tracking-widest block">
                        Included Perks
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

                  {/* Pricing and Action */}
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1.5 mb-4.5">
                      <span className="font-inter text-[10px] text-secondary-text font-semibold uppercase tracking-wider">
                        Price:
                      </span>
                      <span className="font-cinzel text-2xl font-extrabold text-gold-accent text-glow-gold">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          category: activeCategory === "ranks" ? "Premium Ranks" : activeCategory === "keys" ? "Crate Keys" : activeCategory === "coins" ? "Coins" : activeCategory === "bundles" ? "Bundles" : "Cosmetics",
                          accentColor,
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

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
