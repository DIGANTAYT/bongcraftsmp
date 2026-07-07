"use client";

import React from "react";
import { Sword, Compass, Sparkles, Shield, Coins, Smartphone, Backpack, Layers } from "lucide-react";

interface FeatureCard {
  title: string;
  category: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
}

export const ServerFeatures: React.FC = () => {
  const features: FeatureCard[] = [
    {
      title: "Grinwood Town RPG Hub",
      category: "Immersive Hub",
      desc: "Adventure starts in Grinwood Town! Meet 14+ custom NPCs with interactive storylines, quests, a Blacksmith for gear upgrades, and rare Merchants.",
      icon: <Compass className="w-6 h-6" />,
      accent: "from-amber-500 to-yellow-500",
    },
    {
      title: "Custom Classes & Skills",
      category: "Player Classes",
      desc: "Choose your unique class path, unlock custom stats, learn active abilities, and complete class quests to evolve your character's combat power.",
      icon: <Sword className="w-6 h-6" />,
      accent: "from-rose-500 to-red-600",
    },
    {
      title: "Skill Trees & Tiered Traits",
      category: "Progression",
      desc: "Unlock permanent passive gameplay enhancements through tiered skill trees (Bronze, Silver, Gold, and Master level traits).",
      icon: <Layers className="w-6 h-6" />,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      title: "Custom 3D Textures & UI",
      category: "Visuals",
      desc: "Play with custom-modeled 3D weapons, unique gear sets, custom resource packs, and custom styled inventory menus. No mods required!",
      icon: <Sparkles className="w-6 h-6" />,
      accent: "from-purple-500 to-indigo-500",
    },
    {
      title: "Dungeons & PvE Bosses",
      category: "Adventure",
      desc: "Embark on instanced dungeons, complete daily bounty hunts, and battle custom-coded monsters and epic bosses with unique attack phases.",
      icon: <Shield className="w-6 h-6" />,
      accent: "from-blue-500 to-cyan-500",
    },
    {
      title: "Balanced Player Economy",
      category: "Economy",
      desc: "Engage in player-run auction houses, rent shops in town, trade items with NPCs, and enjoy a balanced coin economy free of inflation.",
      icon: <Coins className="w-6 h-6" />,
      accent: "from-gold-accent to-amber-600",
    },
    {
      title: "Bedrock & Java Crossplay",
      category: "Connectivity",
      desc: "Join seamlessly from both Java (PC) and Bedrock (Mobile/Console) with full support for custom textures and customized touch menus.",
      icon: <Smartphone className="w-6 h-6" />,
      accent: "from-pink-500 to-rose-500",
    },
    {
      title: "RPG Backpacks & Kits",
      category: "Survival QoL",
      desc: "Carry extra loot in upgrading backpacks, claim daily kits, set secure player homes, and access custom player-created warps.",
      icon: <Backpack className="w-6 h-6" />,
      accent: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section id="features" className="py-24 relative z-10 px-4 md:px-8 border-t border-border-custom/50 bg-[#0c0d12]/40">
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block">
            Server Features
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase leading-tight">
            RPG Survival Setup
          </h2>
          <p className="font-inter text-xs text-secondary-text leading-relaxed">
            BongCraft SMP is powered by the ultimate RPG Survival system. Explore custom features designed to redefine your vanilla Minecraft experience!
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-4" />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="glass-panel p-6 rounded-3xl border border-border-custom hover:border-primary-accent/30 hover:shadow-[0_12px_30px_-5px_rgba(124,58,237,0.15)] transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
            >
              {/* Radial glow background effect on hover */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-primary-accent/10 to-transparent rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="space-y-5">
                {/* Header Metadata */}
                <div className="flex justify-between items-center">
                  <span className="font-inter text-[9px] text-primary-accent font-bold uppercase tracking-widest">
                    {feat.category}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-accent/40 group-hover:bg-primary-accent transition-colors" />
                </div>

                {/* Icon Wrapper */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.accent} p-[1px] shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <div className="w-full h-full rounded-2xl bg-[#0e0f14] flex items-center justify-center text-white-text">
                    {feat.icon}
                  </div>
                </div>

                {/* Text description */}
                <div className="space-y-2">
                  <h3 className="font-cinzel text-base font-bold text-white-text tracking-wide group-hover:text-gold-accent transition-colors duration-300">
                    {feat.title}
                  </h3>
                  <p className="font-inter text-[11px] text-secondary-text leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
