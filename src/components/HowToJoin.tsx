"use client";

import React, { useState } from "react";
import { Copy, Check, Gamepad2, Plus, Sword } from "lucide-react";

export const HowToJoin: React.FC = () => {
  const [copiedJava, setCopiedJava] = useState(false);
  const [copiedBedrock, setCopiedBedrock] = useState(false);

  const javaIP = "play.bongcraftsmp.in";
  const bedrockIP = "play.bongcraftsmp.in";
  const bedrockPort = "19132";

  const handleCopyJava = () => {
    navigator.clipboard.writeText(javaIP);
    setCopiedJava(true);
    setTimeout(() => setCopiedJava(false), 2000);
  };

  const handleCopyBedrock = () => {
    navigator.clipboard.writeText(`${bedrockIP}:${bedrockPort}`);
    setCopiedBedrock(true);
    setTimeout(() => setCopiedBedrock(false), 2000);
  };

  return (
    <section id="how-to-join" className="py-24 relative z-10 px-4 md:px-8 bg-[#09090B]/30 border-t border-border-custom/50">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
            Quick Start Guide
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
            How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-primary-accent text-glow-red">Join</span>
          </h2>
          <p className="font-inter text-sm text-secondary-text mt-3 max-w-md mx-auto">
            Connect to our server in just a few simple steps and start your adventure.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-4" />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Connector Lines (Desktop only) */}
          <div className="hidden md:block absolute top-[44px] left-[12%] right-[12%] h-[1.5px] bg-gradient-to-r from-rose-500/20 via-gold-accent/20 to-emerald-500/20 z-0 animate-pulse" />

          {/* Step 1 */}
          <div className="glass-panel p-6 rounded-3xl border border-border-custom hover:border-rose-500/35 hover:shadow-[0_10px_30px_-5px_rgba(244,63,94,0.12)] transition-all duration-300 relative z-1 flex flex-col justify-between group">
            <div>
              {/* Step number badge */}
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 font-cinzel font-bold text-base flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                1
              </div>
              <h3 className="font-cinzel text-base md:text-lg font-bold text-white-text tracking-wide mb-2">
                Copy Server IP
              </h3>
              <p className="font-inter text-xs text-secondary-text leading-relaxed mb-4">
                Click a button below to copy the address for your platform.
              </p>
            </div>
            
            <div className="space-y-2 mt-2">
              <button
                onClick={handleCopyJava}
                className="w-full py-2 px-3 bg-[#09090B] hover:bg-secondary-bg border border-border-custom hover:border-rose-500/40 text-white-text rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all duration-200"
              >
                <span>Java Edition</span>
                <span className="flex items-center gap-1 text-rose-400 font-mono text-[9px] lowercase">
                  {copiedJava ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 text-secondary-text" />}
                  {copiedJava ? "copied" : "copy"}
                </span>
              </button>
              <button
                onClick={handleCopyBedrock}
                className="w-full py-2 px-3 bg-[#09090B] hover:bg-secondary-bg border border-border-custom hover:border-rose-500/40 text-white-text rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all duration-200"
              >
                <span>Bedrock Edition</span>
                <span className="flex items-center gap-1 text-gold-accent font-mono text-[9px] lowercase">
                  {copiedBedrock ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 text-secondary-text" />}
                  {copiedBedrock ? "copied" : "copy"}
                </span>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 rounded-3xl border border-border-custom hover:border-amber-500/35 hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.12)] transition-all duration-300 relative z-1 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-cinzel font-bold text-base flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                2
              </div>
              <h3 className="font-cinzel text-base md:text-lg font-bold text-white-text tracking-wide mb-2">
                Launch Minecraft
              </h3>
              <p className="font-inter text-xs text-secondary-text leading-relaxed">
                Open Minecraft on your PC, Console, or Mobile. We support all game client versions from 1.20 up to the latest release.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-secondary-text/80 text-[10px] uppercase font-bold tracking-wider mt-2">
              <Gamepad2 className="w-4 h-4 text-amber-500" />
              <span>Crossplay Enabled</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 rounded-3xl border border-border-custom hover:border-gold-accent/35 hover:shadow-[0_10px_30px_-5px_rgba(251,191,36,0.12)] transition-all duration-300 relative z-1 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gold-accent/10 border border-gold-accent/30 text-gold-accent font-cinzel font-bold text-base flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                3
              </div>
              <h3 className="font-cinzel text-base md:text-lg font-bold text-white-text tracking-wide mb-2">
                Add Server
              </h3>
              <p className="font-inter text-xs text-secondary-text leading-relaxed">
                Go to <strong className="text-white-text font-medium">Multiplayer</strong> ➔ <strong className="text-white-text font-medium">Add Server</strong>, then paste the server IP address. For Bedrock edition, use port <strong className="text-gold-accent">19132</strong>.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-secondary-text/80 text-[10px] uppercase font-bold tracking-wider mt-2">
              <Plus className="w-4 h-4 text-gold-accent" />
              <span>Port: 19132</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-6 rounded-3xl border border-border-custom hover:border-emerald-500/35 hover:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.12)] transition-all duration-300 relative z-1 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-cinzel font-bold text-base flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                4
              </div>
              <h3 className="font-cinzel text-base md:text-lg font-bold text-white-text tracking-wide mb-2">
                Join & Play!
              </h3>
              <p className="font-inter text-xs text-secondary-text leading-relaxed">
                Connect and log into our custom survival RPG world. Form alliances, claim land, open shop, and forge your legacy.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-secondary-text/80 text-[10px] uppercase font-bold tracking-wider mt-2">
              <Sword className="w-4 h-4 text-emerald-500 group-hover:animate-bounce" />
              <span>Start Adventure</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
