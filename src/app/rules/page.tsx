"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { ShieldAlert, BookOpen, UserX, Landmark, LifeBuoy } from "lucide-react";

export default function RulesPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const ruleCategories = [
    {
      title: "General Behavior",
      icon: <UserX className="w-5 h-5 text-red-400" />,
      rules: [
        "No cheating, hacking, X-Ray packs, or hacked clients of any kind. Play fair.",
        "Respect all players. Do not engage in toxic chat, harassment, racism, or hate speech.",
        "Do not spam the chat, use excessive caps, or advertise other Minecraft servers.",
        "Alt account abuse to bypass bans or exploit server mechanics is strictly prohibited."
      ]
    },
    {
      title: "Claims & Building",
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      rules: [
        "Griefing, stealing, or defacing claimed areas is bannable. Respect player property.",
        "Do not build offensive structures or pixel art in public areas or near spawn.",
        "Lava casting or constructing active lag-machines is strictly forbidden.",
        "Claim blocks must be used responsibly. Do not claim areas solely to block other players."
      ]
    },
    {
      title: "Economy & Trading",
      icon: <Landmark className="w-5 h-5 text-gold-accent" />,
      rules: [
        "Trading items for real-world money (outside the official store) is bannable.",
        "Scamming players in player markets, auctions, or direct trades is prohibited.",
        "Report any economy glitches, duplication bugs, or exploits to staff immediately.",
        "Do not engage in price-fixing or auction house manipulation to crash market prices."
      ]
    },
    {
      title: "Staff & Support",
      icon: <LifeBuoy className="w-5 h-5 text-cyan-400" />,
      rules: [
        "Staff decisions are final. If you feel a decision was unjust, appeal on Discord.",
        "Do not impersonate staff members, moderators, or server administrators.",
        "Do not waste staff time with fake reports or coordinate spam alerts.",
        "Help keep BongCraft SMP safe: report hackers and bugs to open tickets."
      ]
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-[900px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
              BongCraft SMP Guidelines
            </span>
            <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
              Server Rules
            </h1>
            <p className="font-inter text-sm text-secondary-text mt-3">
              Read and understand our community guidelines. Maintaining a fun, fair, and competitive environment is our highest priority.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-5" />
          </div>

          {/* Rules Layout */}
          <div className="space-y-6">
            {ruleCategories.map((category, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 md:p-8 rounded-3xl border border-border-custom hover:border-primary-accent/25 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h2 className="font-cinzel text-lg font-bold text-white-text tracking-wide uppercase">
                    {category.title}
                  </h2>
                </div>

                <ul className="space-y-3.5 pl-1.5">
                  {category.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-sm text-secondary-text">
                      <div className="w-5 h-5 rounded-full bg-white/5 border border-border-custom flex items-center justify-center font-inter text-[10px] font-bold text-white-text flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="font-inter leading-relaxed text-white-text/85">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Disclaimer Alert */}
          <div className="glass-panel p-5 rounded-2xl border border-red-500/20 bg-red-500/5 mt-8 flex items-start gap-3.5">
            <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
                Notice of Enforcement
              </h4>
              <p className="font-inter text-xs text-secondary-text leading-relaxed">
                Rules apply to all players, regardless of purchased ranks or playtime. Server staff reserve the right to ban, mute, or reset claims of players violating these regulations without warning.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
