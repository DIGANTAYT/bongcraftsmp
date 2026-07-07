"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, ShoppingCart, MessageSquare, Copy, Check } from "lucide-react";

export const Hero: React.FC = () => {
  const [copiedJava, setCopiedJava] = useState(false);
  const [copiedBedrock, setCopiedBedrock] = useState(false);
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [isServerOnline, setIsServerOnline] = useState(true);

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const res = await fetch("https://api.mcsrvstat.us/3/play.bongcraftssmp.in");
        if (res.ok) {
          const data = await res.json();
          if (data.online) {
            setPlayerCount(data.players?.online ?? 0);
            setIsServerOnline(true);
          } else {
            setPlayerCount(0);
            setIsServerOnline(false);
          }
        }
      } catch (err) {
        console.error("Failed to query Minecraft server status in Hero:", err);
      }
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000); // query every 30s
    return () => clearInterval(interval);
  }, []);

  const copyIpText = (text: string, type: "java" | "bedrock") => {
    navigator.clipboard.writeText(text);
    if (type === "java") {
      setCopiedJava(true);
      setTimeout(() => setCopiedJava(false), 2000);
    } else {
      setCopiedBedrock(true);
      setTimeout(() => setCopiedBedrock(false), 2000);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 md:px-8 overflow-hidden z-10"
    >
      {/* Ambient center glows - Indian flag colors (Saffron & Green) */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-radial from-[#FF9933]/8 to-transparent blur-3xl -z-1 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-radial from-[#138808]/8 to-transparent blur-3xl -z-1 pointer-events-none" />

      <div className="max-w-[850px] w-full mx-auto flex flex-col items-center text-center space-y-8 md:space-y-10">
        
        {/* Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-md"
        >
          {/* Indian flag color indicators */}
          <span className="flex items-center gap-1 select-none">
            <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full" />
            <span className="w-1.5 h-1.5 bg-[#FFFFFF] rounded-full" />
            <span className="w-1.5 h-1.5 bg-[#138808] rounded-full" />
          </span>
          <span className="font-inter text-xs text-white-text font-bold uppercase tracking-widest">
            Bangalir Nijer Survival Server
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="font-cinzel text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider leading-[1.05] text-white-text">
            BONGCRAFT <br />
            <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent drop-shadow-sm select-none">
              SMP
            </span>
          </h1>
          <p className="font-cinzel text-lg sm:text-xl md:text-2xl text-secondary-text font-semibold tracking-wider max-w-xl mx-auto">
            Bengal's Ultimate Survival Experience
          </p>
        </motion.div>

        {/* Server Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-bg/50 border border-border-custom backdrop-blur-md relative"
        >
          {isServerOnline ? (
            <>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute" />
              <span className="font-inter text-[10px] text-white-text font-bold ml-1.5 tracking-wider uppercase">
                {playerCount !== null ? `${playerCount} Players Online` : "Checking server..."} • Server Active
              </span>
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
              <span className="font-inter text-[10px] text-red-400 font-bold ml-1.5 tracking-wider uppercase">
                Server Offline • In-game delivery paused
              </span>
            </>
          )}
        </motion.div>

        {/* Connection Details Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl mx-auto"
        >
          {/* Java Edition */}
          <div className="glass-panel p-6.5 rounded-3xl border border-border-custom relative overflow-hidden flex flex-col items-center justify-between text-center group hover:border-primary-accent/30 transition-all duration-300">
            <div className="space-y-2">
              <span className="font-cinzel text-xs text-primary-accent font-extrabold uppercase tracking-widest block">
                ☕ Java Edition
              </span>
              <div className="space-y-1">
                <div className="font-mono text-sm md:text-base text-white-text font-bold select-all tracking-wider">
                  play.bongcraftssmp.in
                </div>
                <div className="font-inter text-[10px] text-secondary-text/60 font-semibold uppercase tracking-wider">
                  Default Port: 25565
                </div>
              </div>
            </div>
            <button
              onClick={() => copyIpText("play.bongcraftssmp.in", "java")}
              className="mt-5 flex items-center gap-1.5 px-4.5 py-2.5 bg-primary-accent/15 hover:bg-primary-accent border border-primary-accent/30 hover:border-primary-accent text-primary-accent hover:text-white-text rounded-xl font-inter text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer w-full justify-center"
            >
              {copiedJava ? (
                <>
                  Copied IP
                  <Check className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Copy Java IP
                  <Copy className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Bedrock Edition */}
          <div className="glass-panel p-6.5 rounded-3xl border border-border-custom relative overflow-hidden flex flex-col items-center justify-between text-center group hover:border-gold-accent/30 transition-all duration-300">
            <div className="space-y-2">
              <span className="font-cinzel text-xs text-gold-accent font-extrabold uppercase tracking-widest block">
                📱 Bedrock Edition
              </span>
              <div className="space-y-1">
                <div className="font-mono text-sm md:text-base text-white-text font-bold select-all tracking-wider">
                  play.bongcraftssmp.in
                </div>
                <div className="font-inter text-[10px] text-secondary-text/80">
                  Port: <span className="font-mono text-xs text-white-text font-bold select-all">19138</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => copyIpText("play.bongcraftssmp.in:19138", "bedrock")}
              className="mt-5 flex items-center gap-1.5 px-4.5 py-2.5 bg-gold-accent/15 hover:bg-gold-accent border border-gold-accent/30 hover:border-gold-accent text-gold-accent hover:text-[#09090B] rounded-xl font-inter text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer w-full justify-center"
            >
              {copiedBedrock ? (
                <>
                  Copied Bedrock Info
                  <Check className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Copy Bedrock Info
                  <Copy className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Action CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center pt-2"
        >
          {/* Visit Store */}
          <a
            href="/ranks"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4.5 bg-gradient-to-r from-primary-accent to-[#9333EA] hover:from-[#8B5CF6] hover:to-[#A855F7] text-white-text font-inter font-bold text-sm tracking-wider uppercase rounded-2xl hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all duration-300 group cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            Visit Store
          </a>

          {/* Join Discord */}
          <a
            href="https://discord.gg/WzDAzMYwGX"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4.5 bg-card-bg hover:bg-secondary-bg/60 border border-border-custom hover:border-gold-accent/40 text-white-text font-inter font-bold text-sm tracking-wider uppercase rounded-2xl transition-all duration-300 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            Join Discord
          </a>
        </motion.div>

      </div>
    </section>
  );
};
