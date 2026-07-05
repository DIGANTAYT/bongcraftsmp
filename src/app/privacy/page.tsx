"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Lock, Eye } from "lucide-react";

export default function PrivacyPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const points = [
    {
      title: "1. Information We Collect",
      paragraphs: [
        "We collect minimal data required to deliver store items. This includes your Minecraft Username (IGN) and email address (for payment notifications and order receipts).",
        "We do NOT collect, store, or view credit card numbers, bank credentials, or any financial details. All transactions are securely handled by official payment processors."
      ]
    },
    {
      title: "2. How We Use Your Data",
      paragraphs: [
        "Your Minecraft Username is utilized strictly to credit the purchased packages, ranks, or coins to your character in-game via console commands.",
        "Your email is used solely to dispatch payment verification logs, Tebex receipts, and transaction updates."
      ]
    },
    {
      title: "3. Cookies & Session Storage",
      paragraphs: [
        "We utilize local browser storage (localStorage) and session cookies exclusively to manage your shopping cart state, username logs, and interface preferences.",
        "No trackers, advertisement cookies, or third-party tracking scripts are deployed on this store website."
      ]
    },
    {
      title: "4. Third-Party Sharing",
      paragraphs: [
        "BongCraft SMP does not sell, rent, or trade player information with advertisers or third parties.",
        "Data is only shared with Tebex and payment processors to complete secure checkouts."
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
              BongCraft SMP Data Privacy
            </span>
            <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
              Privacy Policy
            </h1>
            <p className="font-inter text-sm text-secondary-text mt-3">
              We value your privacy. Read our policy to understand what minimal information we collect and how we secure it during checkouts.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-5" />
          </div>

          {/* Privacy Content */}
          <div className="glass-panel p-8 rounded-3xl border border-border-custom space-y-8">
            {points.map((point, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="font-cinzel text-base font-bold text-white-text tracking-wide uppercase">
                  {point.title}
                </h3>
                {point.paragraphs.map((p, i) => (
                  <p key={i} className="font-inter text-sm text-secondary-text leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Privacy Lock Banner */}
          <div className="glass-panel p-5 rounded-2xl border border-primary-accent/20 bg-primary-accent/5 mt-8 flex items-start gap-3.5">
            <Lock className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-primary-accent mb-1">
                Data Protection Guaranteed
              </h4>
              <p className="font-inter text-xs text-secondary-text leading-relaxed">
                Your connection to our store servers is secured via standard SSL encryption. Ranks, transactions, and user logs are protected using database safeguards.
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
