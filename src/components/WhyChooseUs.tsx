"use client";

import React from "react";
import { Cpu, ShieldCheck, Heart, Zap, Layers, Sparkles, HelpCircle, DollarSign } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      title: "Lag-Free Experience",
      desc: "Powered by enterprise AMD Ryzen / Intel i9 CPUs, dedicated NVMe storage, and optimized networks. Maintain a rock-solid 20 TPS at all times.",
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      title: "24/7 Server Uptime",
      desc: "Never lose connection. Our server stays online around the clock, with automatic backups running daily to secure your progress.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Friendly Community",
      desc: "Join a mature, inclusive community of Bengali and global gamers. Form alliances, open shops, and participate in weekly events.",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      title: "Custom Features",
      desc: "Play with exclusive survival enhancements. Custom dungeons, balanced job skills, daily quests, and original content updates.",
      icon: <Layers className="w-6 h-6" />,
    },
    {
      title: "Balanced Economy",
      desc: "No pay-to-win. Our coins and rank packages are balanced carefully to prevent inflation and keep competition fair for all players.",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: "Dedicated Support",
      desc: "Have a question or encounter a bug? Our ticket system on Discord is answered within minutes by mature, responsive staff.",
      icon: <HelpCircle className="w-6 h-6" />,
    },
    {
      title: "Secure Payments",
      desc: "Purchase with confidence. Our checkout system utilizes industry-standard 128-bit SSL encryptions with UPI and Cards support.",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
      title: "Bengal's Pride Server",
      desc: "The largest Minecraft survival server dedicated to providing Bengali players and communities with their ultimate home.",
      icon: <Sparkles className="w-6 h-6" />,
    },
  ];

  return (
    <section id="why-us" className="py-24 relative z-10 px-4 md:px-8 bg-secondary-bg/20">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
            Server Quality
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
            Why Choose BongCraft
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-4" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="glass-panel p-6.5 rounded-3xl border border-border-custom hover:border-primary-accent/30 hover:shadow-[0_10px_25px_-5px_rgba(124,58,237,0.15)] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Icon Wrapper */}
                <div className="w-12 h-12 rounded-2xl bg-primary-bg border border-border-custom text-primary-accent group-hover:text-gold-accent flex items-center justify-center mb-5 transition-colors duration-300">
                  {feat.icon}
                </div>
                <h3 className="font-cinzel text-base md:text-lg font-bold text-white-text tracking-wide mb-2">
                  {feat.title}
                </h3>
                <p className="font-inter text-xs text-secondary-text leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
