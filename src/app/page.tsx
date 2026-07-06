"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { FeaturedRank } from "@/components/FeaturedRank";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";

export default function Home() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Background Particles & Castle Silhouette Overlay */}
      <BackgroundParticles />

      {/* Main Navigation */}
      <Navbar />

      {/* Main Web Content Layout */}
      <main className="flex-1 w-full relative z-10">
        {/* Hero Banner Grid */}
        <Hero />

        {/* Dynamic Counter Statistics */}
        <Stats />

        {/* Signature Featured Rank Container */}
        <FeaturedRank />

        {/* Feature Highlights Grid */}
        <WhyChooseUs />
      </main>

      {/* Footer Details */}
      <Footer />

      {/* Persistent Loot Shopping Cart Sidebar Drawer */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Simulated Checkout secure Modal Portal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
