"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Crown, Sparkles, Check, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export const FeaturedRank: React.FC = () => {
  const { addToCart } = useCart();
  const [price, setPrice] = React.useState(1499);

  React.useEffect(() => {
    const loadPrice = async () => {
      try {
        const res = await fetch("/api/config/public");
        const config = await res.json();
        if (config && config.prices && config.prices.king) {
          setPrice(config.prices.king);
        } else {
          // Fallback to local storage
          const saved = localStorage.getItem("bongcraft_prices");
          if (saved) {
            const pricesObj = JSON.parse(saved);
            if (pricesObj.king) setPrice(pricesObj.king);
          }
        }
      } catch (e) {
        console.error("Failed to load king price from API:", e);
        const saved = localStorage.getItem("bongcraft_prices");
        if (saved) {
          try {
            const pricesObj = JSON.parse(saved);
            if (pricesObj.king) setPrice(pricesObj.king);
          } catch (err) {
            console.error(err);
          }
        }
      }
    };
    loadPrice();
  }, []);

  const handlePurchase = () => {
    addToCart({
      id: "rank-king",
      name: "King Rank",
      price: price,
      category: "Premium Ranks",
      accentColor: "#EF4444",
    });
  };

  const perks = [
    "6 Auction Slots (+6)",
    "12 Homes (+12)",
    "3 Player Warps (+3)",
    "10 Claim Blocks (+10)",
    "Access to /disposal & /craft",
    "Access to /nick & /back",
    "Access to /feed & /enderchest",
    "King Kit Access & Prefix",
  ];

  return (
    <section className="py-20 relative z-10 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="font-inter text-xs text-[#EF4444] font-extrabold uppercase tracking-widest block mb-2">
            Showcase Collection
          </span>
          <h2 className="font-cinzel text-3xl md:text-4xl font-extrabold text-white-text tracking-wider uppercase">
            Signature Premium Rank
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#EF4444] to-gold-accent mx-auto mt-4" />
        </div>

        {/* Featured Rank Box */}
        <div className="glass-panel relative rounded-[32px] overflow-hidden border border-border-custom max-w-5xl mx-auto shadow-2xl">
          {/* Ambient Red Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-[#EF4444]/15 via-transparent to-transparent pointer-events-none -z-1" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 items-center">
            
            {/* Rank Artwork Left Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              {/* Outer Red Aura */}
              <div className="absolute w-64 h-64 rounded-full bg-radial from-[#EF4444]/30 to-transparent blur-2xl -z-1 animate-pulse" />
              
              {/* Voxel particles background simulation */}
              <div className="absolute inset-0 pointer-events-none select-none -z-1 opacity-20">
                <span className="absolute top-10 left-10 w-2 h-2 bg-[#EF4444] animate-ping" style={{ animationDuration: "3s" }} />
                <span className="absolute bottom-12 right-12 w-3 h-3 bg-gold-accent animate-ping" style={{ animationDuration: "4s" }} />
                <span className="absolute top-1/2 right-10 w-2 h-2 bg-white-text animate-ping" style={{ animationDuration: "5s" }} />
              </div>

              {/* Floating Rank Image */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-64 h-64 md:w-80 md:h-80"
              >
                <Image
                  src="/images/king.png"
                  alt="King Rank Crest"
                  fill
                  className="object-contain filter drop-shadow-[0_10px_25px_rgba(239,68,68,0.4)]"
                />
              </motion.div>

              <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/35 text-[#EF4444] font-inter text-[10px] font-bold uppercase tracking-widest">
                <Crown className="w-3.5 h-3.5" />
                Featured Tier
              </div>
            </div>

            {/* Rank Details Right Column */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-accent text-glow-gold" />
                  <span className="font-inter text-xs text-gold-accent font-extrabold uppercase tracking-widest">
                    Best Seller • Level 5 Sovereign Rank
                  </span>
                </div>
                <h3 className="font-cinzel text-3xl md:text-5xl font-black tracking-wider text-white-text uppercase">
                  KING
                </h3>
                <p className="font-inter text-sm text-secondary-text leading-relaxed">
                  Claim ultimate rule on BongCraft SMP. The King tier grants you 15 auction listings, 12 homes, fly privilege in your claims, `/feed`, and access to the exclusive King kit.
                </p>
              </div>

              {/* Perks Grid */}
              <div className="space-y-3">
                <h4 className="font-cinzel text-xs font-bold uppercase tracking-widest text-white-text">
                  RANK PRIVILEGES & PERKS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-secondary-text">
                      <div className="w-5 h-5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] flex-shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-inter font-medium text-white-text/95">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border-custom" />

              {/* Price & Purchase Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-secondary-text font-inter text-xs font-semibold uppercase tracking-wider">
                    Price
                  </span>
                  <div className="flex flex-col">
                    <span className="font-cinzel text-3xl md:text-4xl font-extrabold text-gold-accent text-glow-gold">
                      ₹{price.toLocaleString()}
                    </span>
                    <span className="font-inter text-[10px] text-secondary-text line-through">
                      ₹{Math.floor(price * 1.6).toLocaleString()}
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-inter text-[10px] font-bold uppercase tracking-wider">
                    Save 37%
                  </span>
                </div>

                <button
                  onClick={handlePurchase}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4.5 bg-[#EF4444] hover:bg-[#DC2626] text-white-text font-inter font-bold text-sm tracking-wider uppercase rounded-2xl hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-300 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Claim Rank
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
