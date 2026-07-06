"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Vote, Copy, Check, ExternalLink, Gift, User, Sparkles } from "lucide-react";

export default function VotePage() {
  const { user, profile } = useAuth();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [inputIgn, setInputIgn] = useState("");
  const [copied, setCopied] = useState(false);

  // If user has a linked character, set it by default
  useEffect(() => {
    if (profile?.minecraft_username) {
      setInputIgn(profile.minecraft_username);
    }
  }, [profile]);

  const getActiveIgn = () => {
    return profile?.minecraft_username || inputIgn.trim() || "YourUsername";
  };

  const copyIgn = () => {
    const textToCopy = getActiveIgn();
    if (textToCopy === "YourUsername") return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const voteSites = [
    {
      name: "MinecraftServers.org",
      url: "https://minecraftservers.org/vote/689703",
      color: "border-primary-accent/30 hover:border-primary-accent/70",
      btnBg: "bg-primary-accent/15 hover:bg-primary-accent text-primary-accent hover:text-white-text",
      rewards: [
        "🔑 1x Common Crate Key",
        "🪙 500 Coins balance",
        "🗺️ +50 Claim Blocks"
      ]
    },
    {
      name: "MinecraftIPList.com",
      url: "https://www.minecraftiplist.com/server/TheBongCraftSMP-43167",
      color: "border-gold-accent/30 hover:border-gold-accent/70",
      btnBg: "bg-gold-accent/15 hover:bg-gold-accent text-gold-accent hover:text-[#09090B]",
      rewards: [
        "🔑 1x Common Crate Key",
        "🪙 500 Coins balance",
        "🗺️ +50 Claim Blocks"
      ]
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-[850px] mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
              Support the Server
            </span>
            <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
              Vote Rewards
            </h1>
            <p className="font-inter text-sm text-secondary-text mt-3 max-w-xl mx-auto leading-relaxed">
              Help BongCraft SMP rank higher! Vote on the server lists below daily to earn exclusive crate keys, extra coins, and bonus claim blocks.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-5" />
          </div>

          {/* Minecraft IGN Copy Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 md:p-8 rounded-3xl border border-border-custom relative overflow-hidden"
          >
            {/* Ambient Backlight Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary-accent/10 filter blur-3xl -z-1" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-gold-accent/5 filter blur-3xl -z-1" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Character Avatar */}
              <div className="md:col-span-3 flex flex-col items-center text-center">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gold-accent bg-primary-bg p-0.5 shadow-xl shadow-gold-accent/10">
                  <img
                    src={`https://mc-heads.net/avatar/${getActiveIgn()}`}
                    alt="Minecraft Skin Avatar"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <span className="font-inter text-[9px] text-secondary-text/50 uppercase tracking-widest mt-2 block">
                  Character Preview
                </span>
              </div>

              {/* Right Column: Interactive Copy field */}
              <div className="md:col-span-9 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-cinzel text-sm font-bold text-white-text tracking-wider uppercase flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gold-accent" />
                    Enter In-Game Name (IGN)
                  </h3>
                  <p className="font-inter text-xs text-secondary-text">
                    Type your username exactly as it is spelled in-game to receive rewards on the server when you vote.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Enter Minecraft IGN..."
                      value={inputIgn}
                      onChange={(e) => setInputIgn(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                      disabled={!!profile?.minecraft_username}
                      className="w-full bg-[#111217]/60 border border-border-custom focus:border-primary-accent/65 px-4 py-3.5 rounded-xl font-inter text-xs text-white-text placeholder-secondary-text/30 outline-none transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                    {profile?.minecraft_username && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 font-mono text-[8px] font-bold uppercase tracking-wider text-emerald-500">
                        Linked
                      </span>
                    )}
                  </div>

                  <button
                    onClick={copyIgn}
                    disabled={!inputIgn.trim() && !profile?.minecraft_username}
                    className="px-6 py-3.5 bg-gold-accent hover:bg-gold-accent/90 disabled:bg-gold-accent/30 text-[#09090B] font-inter font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-gold-accent/10"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy IGN
                      </>
                    )}
                  </button>
                </div>
                
                <span className="font-inter text-[9px] text-amber-400 font-semibold block">
                  ⚠️ Note: Make sure to copy your IGN first, then paste it into the username field on the voting pages!
                </span>
              </div>

            </div>
          </motion.div>

          {/* Voting Sites list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {voteSites.map((site, index) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`glass-panel p-6.5 rounded-3xl border ${site.color} flex flex-col justify-between relative overflow-hidden group transition-all duration-300`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-border-custom/50 pb-3">
                    <span className="font-cinzel text-xs font-bold text-white-text tracking-wider uppercase">
                      🗳️ Vote Link #{index + 1}
                    </span>
                    <span className="font-inter text-[10px] text-secondary-text font-bold bg-[#111217] border border-border-custom/50 px-2 py-0.5 rounded">
                      Daily
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-cinzel text-lg font-black text-white-text tracking-wide">
                      {site.name}
                    </h3>
                    <p className="font-inter text-xs text-secondary-text leading-normal">
                      Click below to visit the list, enter your copied Minecraft username, and submit your vote.
                    </p>
                  </div>

                  {/* Rewards List */}
                  <div className="bg-[#111217]/50 border border-border-custom p-4 rounded-2xl space-y-2">
                    <span className="font-cinzel text-[9px] text-gold-accent font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      Vote Rewards:
                    </span>
                    <ul className="space-y-1.5">
                      {site.rewards.map((reward) => (
                        <li key={reward} className="font-inter text-xs text-white-text/85 font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-gold-accent shrink-0" />
                          {reward}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (copied === false) copyIgn();
                  }}
                  className={`mt-6 w-full py-3.5 rounded-xl font-inter font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${site.btnBg}`}
                >
                  Go to Vote Site
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
