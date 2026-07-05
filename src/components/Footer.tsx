"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check, MessageSquare, ShieldAlert } from "lucide-react";

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyIp = () => {
    navigator.clipboard.writeText("bongcraftsmp.pdhost.in:25571");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const footerLinks = [
    {
      title: "Store Categories",
      links: [
        { name: "Premium Ranks", href: "/ranks" },
        { name: "Crate Keys", href: "/crates" },
        { name: "Server Coins", href: "/coins" },
      ],
    },
    {
      title: "Help & Rules",
      links: [
        { name: "Server Rules", href: "/rules" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Support Ticket", href: "https://discord.gg/WzDAzMYwGX" },
      ],
    },
    {
      title: "Vote & Connect",
      links: [
        { name: "Vote for Server (Coming Soon)", href: "#" },
        { name: "Official Discord", href: "https://discord.gg/WzDAzMYwGX" },
        { name: "Staff Application (Coming Soon)", href: "#" },
        { name: "About Us", href: "/about" },
      ],
    },
  ];

  return (
    <footer className="relative z-10 border-t border-border-custom bg-[#09090B] py-16 px-4 md:px-8">
      {/* Background Top Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-border-custom to-transparent" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 mb-12">
        {/* Brand details col */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-gold-accent/20 bg-card-bg/60 p-0.5">
              <Image
                src="/images/logo.png"
                alt="BongCraft SMP Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel font-black text-lg md:text-xl tracking-wider text-white-text">
                BONGCRAFT
              </span>
              <span className="font-inter text-[10px] text-primary-accent tracking-widest font-extrabold uppercase leading-none mt-0.5">
                SMP
              </span>
            </div>
          </div>

          <p className="font-inter text-xs text-secondary-text leading-relaxed max-w-sm">
            Bengal's Ultimate Survival Experience. Connect with thousands of Bengali players, unlock original features, trade in the markets, and dominate the leaderboards.
          </p>

          {/* IP Copy Widget */}
          <div className="inline-flex items-center gap-3 bg-[#111217] border border-border-custom p-1.5 px-3.5 rounded-xl">
            <span className="font-mono text-[10px] text-secondary-text">bongcraftsmp.pdhost.in:25571</span>
            <button
              onClick={copyIp}
              className="p-1.5 hover:bg-card-bg text-secondary-text hover:text-gold-accent rounded-lg cursor-pointer transition-colors duration-300"
              title="Copy IP Address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-gold-accent" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Links lists cols */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {footerLinks.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="font-cinzel text-xs font-black text-white-text uppercase tracking-widest">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="font-inter text-xs text-secondary-text hover:text-white-text transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto border-t border-border-custom/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Disclaimers & Copyright */}
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <span className="font-inter text-xs text-secondary-text/80">
            © 2026 BongCraft SMP. All rights reserved.
          </span>
          {/* Mojang Disclaimer */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] text-secondary-text/50">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.</span>
          </div>
        </div>

        {/* Social CTAs */}
        <div className="flex items-center gap-4">
          <a
            href="https://discord.gg/WzDAzMYwGX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2.5 bg-card-bg hover:bg-[#5865F2] border border-border-custom hover:border-[#5865F2] text-secondary-text hover:text-white transition-all duration-300 rounded-xl"
            title="Join Discord Server"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
          </a>
        </div>
      </div>
    </footer>
  );
};
