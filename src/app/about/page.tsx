"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Crown, Check, Copy, Sparkles, Server, Terminal, Shield, Star, Globe, MessageSquare } from "lucide-react";

export default function AboutPage() {
  const [copied, setCopied] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const copyIp = () => {
    navigator.clipboard.writeText("bongcraftsmp.pdhost.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gameModes = [
    {
      title: "Vanilla+ Survival",
      icon: "⚔️",
      desc: "Vanilla-enhanced survival SMP featuring player shops, auction houses, land claiming protections, and economy systems.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Crates & Economy",
      icon: "🔑",
      desc: "Open custom server crates to win resources, netherite armour sets, custom items, and coin packs.",
      color: "from-primary-accent to-fuchsia-500"
    },
    {
      title: "Custom Auctions",
      icon: "🪙",
      desc: "An active player-driven market economy. Rent claims, trade assets, and buy/sell items on the live /ah market.",
      color: "from-amber-500 to-gold-accent"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto space-y-12">
          
          {/* Header Showcase Banner */}
          <div className="glass-panel p-8 md:p-12 rounded-[32px] border border-border-custom relative overflow-hidden shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-accent/5 via-transparent to-transparent pointer-events-none" />
            
            {/* Logo Container */}
            <div className="shrink-0 relative w-32 h-32 md:w-36 md:h-36 rounded-3xl overflow-hidden border-2 border-primary-accent/40 shadow-xl shadow-primary-accent/15 bg-card-bg/60 p-2 flex items-center justify-center">
              <Image src="/images/logo.png" alt="BongCraft Logo" width={128} height={128} className="object-contain" />
            </div>

            {/* Title / Description */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wide uppercase">
                  BongCraft SMP
                </h1>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-500 font-inter text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-accent/10 border border-primary-accent/35 text-primary-accent font-inter text-[10px] font-bold uppercase tracking-wider">
                    Java & Bedrock
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-border-custom text-secondary-text font-inter text-[10px] font-bold uppercase tracking-wider">
                    Est. 2026
                  </span>
                </div>
              </div>

              <p className="font-inter text-sm md:text-base text-secondary-text max-w-2xl leading-relaxed">
                Bengal's Ultimate Survival Experience. Providing a lag-free, fair, and feature-rich multiplayer environment with full Java and Bedrock crossplay. Whether you are a casual builder or an elite combat merchant, you belong here.
              </p>

              {/* Server metrics row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-5 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-secondary-text">
                  <Server className="w-4 h-4 text-primary-accent" />
                  <span className="text-white-text">24/7</span> Active Server Node
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-secondary-text">
                  <Terminal className="w-4 h-4 text-gold-accent" />
                  Version <span className="text-white-text">1.18 — 1.21.x</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-secondary-text">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Region <span className="text-white-text">India (Asia)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-secondary-text">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-white-text">4.9 / 5</span> Community Rating
                </div>
              </div>

              {/* IP Widget & CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                <div className="flex items-center gap-3 bg-[#111217] border border-border-custom px-4 py-2.5 rounded-xl w-full sm:w-auto justify-between">
                  <span className="font-mono text-sm text-white-text tracking-wider select-all">
                    bongcraftsmp.pdhost.in
                  </span>
                  <button
                    onClick={copyIp}
                    className="p-1 text-secondary-text hover:text-primary-accent transition-colors cursor-pointer"
                    title="Copy IP Address"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <a
                  href="https://discord.gg/WzDAzMYwGX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white-text font-inter font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  Join Discord
                </a>
              </div>
            </div>
          </div>

          {/* Main Content Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Detailed Bio block */}
              <section className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-gold-accent text-glow-gold" />
                  <h2 className="font-cinzel text-xl md:text-2xl font-bold text-white-text tracking-wide uppercase">
                    About the Server
                  </h2>
                </div>
                <div className="space-y-4 font-inter text-sm text-secondary-text leading-relaxed">
                  <p>
                    <strong className="text-white-text">BongCraft SMP</strong> was founded with a single mission: to build the most stable, fair, and immersive survival server network available to players across Bengal and South Asia. Frustrated with pay-to-win mechanics, lag spikes, and negligent administrators found on other servers, our team set out to construct a premium survival alternative.
                  </p>
                  <p>
                    Our marketplace is designed strictly around a <strong className="text-white-text">cosmetic and helper-first</strong> philosophy. Ranks offer convenience features (like virtual crafting benches, chest auction caps, coordinate monitors, or laying animations) and cosmetic chat indicators. Ranks will never grant players unfair advantages during survival competition or item trade portals.
                  </p>
                  <p>
                    Every contribution made to our store goes <strong className="text-white-text">100% back into server operations</strong>, supporting premium high-TPS hosting nodes, server listing advertisements, dedicated DDoS firewalls, custom plugin scripts, and community events with in-game reward prizes.
                  </p>
                </div>
              </section>

              {/* Game Modes */}
              <section className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <Crown className="w-5 h-5 text-primary-accent" />
                  <h2 className="font-cinzel text-xl md:text-2xl font-bold text-white-text tracking-wide uppercase">
                    Gameplay Pillars
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {gameModes.map((mode, i) => (
                    <div
                      key={i}
                      className="glass-panel p-6 rounded-2xl border border-border-custom hover:border-primary-accent/20 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-3.5">
                        <span className="text-3xl block">{mode.icon}</span>
                        <h3 className="font-cinzel text-sm font-bold text-white-text tracking-wide uppercase">
                          {mode.title}
                        </h3>
                        <p className="font-inter text-xs text-secondary-text leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Information Column */}
            <div className="space-y-6">
              
              {/* Connection Specs */}
              <div className="glass-panel p-6.5 rounded-3xl border border-border-custom space-y-5">
                <h3 className="font-cinzel text-sm font-bold text-white-text tracking-wider uppercase border-b border-border-custom pb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary-accent rounded-full" />
                  Connection Specs
                </h3>

                <div className="space-y-3.5 font-inter text-xs">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-secondary-text">Java IP Address</span>
                    <span className="font-mono font-bold text-white-text text-right select-all">
                      bongcraftsmp.pdhost.in
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-secondary-text">Bedrock Port</span>
                    <span className="font-mono font-bold text-white-text text-right">
                      25571
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-secondary-text">Compatible Versions</span>
                    <span className="font-mono font-bold text-white-text text-right">
                      1.18 — 1.21.x
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-secondary-text">Languages</span>
                    <span className="font-bold text-white-text text-right">
                      English & Bengali
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-secondary-text">Location</span>
                    <span className="font-bold text-white-text text-right">
                      India / Asia
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="glass-panel p-6.5 rounded-3xl border border-border-custom space-y-5">
                <h3 className="font-cinzel text-sm font-bold text-white-text tracking-wider uppercase border-b border-border-custom pb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gold-accent rounded-full" />
                  Network Stats
                </h3>

                <div className="space-y-3.5 font-inter text-xs">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-secondary-text">Server Status</span>
                    <span className="font-bold text-emerald-500 text-right">Online & Live</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-secondary-text">Inaugurated</span>
                    <span className="font-bold text-white-text text-right">2026</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-secondary-text">Node Uptime</span>
                    <span className="font-bold text-white-text text-right">99.9% Uptime</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-secondary-text">Server TPS Core</span>
                    <span className="font-bold text-white-text text-right">20.0 TPS (Lag-Free)</span>
                  </div>
                </div>
              </div>

              {/* Server Owners */}
              <div className="glass-panel p-6.5 rounded-3xl border border-border-custom space-y-5">
                <h3 className="font-cinzel text-sm font-bold text-white-text tracking-wider uppercase border-b border-border-custom pb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary-accent rounded-full" />
                  Server Owners
                </h3>

                <div className="space-y-4">
                  {/* Neel */}
                  <div className="flex items-center gap-3.5 bg-secondary-bg/30 p-3 rounded-2xl border border-border-custom/50">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gold-accent/30 bg-primary-bg p-0.5 shrink-0">
                      <img
                        src="https://mc-heads.net/avatar/Neel"
                        alt="Neel Avatar"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="font-cinzel text-xs font-bold text-white-text block">
                        Neel
                      </span>
                      <span className="font-inter text-[10px] text-gold-accent font-semibold block uppercase tracking-wider">
                        Owner & Developer
                      </span>
                    </div>
                  </div>

                  {/* Akash */}
                  <div className="flex items-center gap-3.5 bg-secondary-bg/30 p-3 rounded-2xl border border-border-custom/50">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-primary-accent/30 bg-primary-bg p-0.5 shrink-0">
                      <img
                        src="https://mc-heads.net/avatar/Akash"
                        alt="Akash Avatar"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="font-cinzel text-xs font-bold text-white-text block">
                        Akash
                      </span>
                      <span className="font-inter text-[10px] text-primary-accent font-semibold block uppercase tracking-wider">
                        Owner & Administrator
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
