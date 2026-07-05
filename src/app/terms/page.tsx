"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { ShieldCheck, Info } from "lucide-react";

export default function TermsPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const sections = [
    {
      title: "1. Virtual Item Purchases",
      paragraphs: [
        "BongCraft SMP offers virtual digital rewards, including Premium Ranks, Crate Keys, Coins, and packages. These items are entirely digital and hold no real-world monetary value.",
        "Virtual products are delivered automatically to your Minecraft character in-game. Ensure you enter your exact Minecraft Username (IGN) during checkout to prevent delivery errors."
      ]
    },
    {
      title: "2. Strict No-Refund Policy",
      paragraphs: [
        "All purchases made on the BongCraft SMP Store are final and non-refundable. Due to the digital nature of virtual items, refunds, chargebacks, or transaction reversals will not be granted under any circumstances.",
        "Attempting a chargeback or opening a payment dispute will result in an immediate, permanent ban across our entire Minecraft server network, Discord server, and Tebex portal."
      ]
    },
    {
      title: "3. Delivery Times & Support",
      paragraphs: [
        "Store purchases are processed immediately. Items are typically delivered in-game within 5 to 15 minutes of payment clearance.",
        "If you do not receive your purchase within 20 minutes, log into the server and type `/claim` in chat. If the issue persists, open a billing ticket on our Official Discord server for staff support."
      ]
    },
    {
      title: "4. Account Security & Bans",
      paragraphs: [
        "You are solely responsible for the security of your Minecraft account. If your account is banned for violating server rules, virtual items and ranks will not be refunded or transferred.",
        "Ranks and store permissions do not exempt you from server guidelines. All rules apply equally to all players."
      ]
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-[800px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
              BongCraft SMP Store Agreement
            </span>
            <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
              Terms of Service
            </h1>
            <p className="font-inter text-sm text-secondary-text mt-3">
              Please read our store terms and conditions before making a purchase. Completing a payment signifies your agreement to these policies.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-5" />
          </div>

          {/* Terms Content */}
          <div className="glass-panel p-8 rounded-3xl border border-border-custom space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="font-cinzel text-base font-bold text-white-text tracking-wide uppercase">
                  {section.title}
                </h3>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="font-inter text-sm text-secondary-text leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Safe Shopping Banner */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 mt-8 flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">
                Secure Transactions
              </h4>
              <p className="font-inter text-xs text-secondary-text leading-relaxed">
                Payments are securely processed through SSL encrypted gateways. We do not store or collect your banking credentials or credit card numbers.
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
