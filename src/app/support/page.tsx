"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { MessageSquare, ShieldQuestion, ExternalLink, CalendarDays } from "lucide-react";

export default function SupportPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const faqs = [
    {
      q: "How long does rank delivery take?",
      a: "Most purchases are delivered in-game within 2 to 5 minutes automatically. If you don't receive it, ensure you are online and type '/claim' in chat.",
    },
    {
      q: "Which payment methods are accepted?",
      a: "We accept all major Indian and international payment gateways, including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and custom Gift Cards.",
    },
    {
      q: "Can I transfer my purchase to another Minecraft account?",
      a: "No. All packages, ranks, and coin bundles are strictly bound to the Minecraft Username (IGN) entered during checkout and cannot be transferred.",
    },
    {
      q: "I entered the wrong username. What should I do?",
      a: "Don't panic! Join our Discord server immediately and open a billing support ticket with your Order ID (starts with BC-). Our staff will manually update it.",
    },
    {
      q: "What is your refund policy?",
      a: "Since server items are digital assets, all purchases are final. Refunds, chargebacks, or disputes will result in a permanent ban from our network.",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
              Get Help
            </span>
            <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
              Support Center
            </h1>
            <p className="font-inter text-sm text-secondary-text mt-3 max-w-xl mx-auto">
              Got billing questions or need server help? Check our FAQs below or contact our dedicated admin team directly on Discord.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
            
            {/* FAQs Grid Left Column */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-cinzel text-lg font-bold text-white-text uppercase tracking-wider mb-6 flex items-center gap-2">
                <ShieldQuestion className="w-5 h-5 text-primary-accent" />
                Frequently Asked Questions
              </h2>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="glass-panel p-5.5 rounded-2xl border border-border-custom hover:border-primary-accent/25 transition-all duration-300"
                >
                  <h3 className="font-inter font-bold text-sm text-white-text mb-2">
                    {faq.q}
                  </h3>
                  <p className="font-inter text-xs text-secondary-text leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Support CTA Cards Right Column */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-cinzel text-lg font-bold text-white-text uppercase tracking-wider mb-6 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-gold-accent" />
                Direct Channels
              </h2>

              {/* Discord support block */}
              <div className="glass-panel p-6.5 rounded-3xl border border-border-custom relative overflow-hidden group hover:border-[#5865F2]/40 hover:shadow-[0_0_20px_rgba(88,101,242,0.15)] transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-[#5865F2]/10 to-transparent blur-xl pointer-events-none" />
                
                <div className="w-12 h-12 bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                
                <h3 className="font-cinzel text-base font-bold text-white-text mb-2">
                  Discord Help Desk
                </h3>
                <p className="font-inter text-xs text-secondary-text leading-relaxed mb-6">
                  Open a billing or support ticket. Our server staff are online 24/7 to resolve issues, process manual transfers, and assist with server connections.
                </p>

                <a
                  href="https://discord.gg/WzDAzMYwGX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white-text font-inter font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer shadow-md"
                >
                  Create Support Ticket
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
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
