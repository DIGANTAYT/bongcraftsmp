"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Gift, ArrowRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const CommunityGoal: React.FC = () => {
  const [currentAmount, setCurrentAmount] = useState(0);
  const goalAmount = 10000;

  useEffect(() => {
    const fetchProgress = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select("total")
            .eq("status", "Completed");

          if (!error && data) {
            const sum = data.reduce((acc: number, curr: any) => acc + (Number(curr.total) || 0), 0);
            setCurrentAmount(sum);
          }
        } catch (e) {
          console.error("Failed to load community goal progress:", e);
        }
      }
    };

    fetchProgress();
  }, []);

  const percentage = Math.min(100, Math.round((currentAmount / goalAmount) * 100));

  return (
    <section className="py-16 relative z-10 px-4 md:px-8 border-t border-border-custom/50 bg-[#0c0d12]/20">
      <div className="max-w-4xl mx-auto glass-panel p-6 md:p-10 rounded-3xl border border-border-custom relative overflow-hidden">
        
        {/* Subtle radial glow inside card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-accent/5 rounded-full filter blur-3xl" />

        <div className="relative z-1 space-y-8">
          
          {/* Header Metadata */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] text-gold-accent font-inter font-black uppercase tracking-widest">
                <Trophy className="w-4 h-4 text-glow-gold" />
                Community Goal
              </span>
              <h3 className="font-cinzel text-xl md:text-2xl font-black text-white-text uppercase tracking-wide">
                Server Upgrades Goal
              </h3>
            </div>
            
            <div className="bg-[#09090B] border border-border-custom px-4 py-2 rounded-2xl flex items-center gap-3">
              <div className="text-right">
                <span className="text-[9px] text-secondary-text block font-medium uppercase tracking-wider">Progress</span>
                <span className="font-mono text-sm font-bold text-white-text">₹{currentAmount} / ₹{goalAmount}</span>
              </div>
              <div className="h-6 w-px bg-border-custom" />
              <div className="text-left font-mono text-lg font-black text-primary-accent">
                {percentage}%
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="font-inter text-xs text-secondary-text leading-relaxed">
            Every store purchase goes directly towards funding high-performance hardware, server expansions, and plugin development. 
            Once the community goal reaches <strong>100%</strong>, a server-wide <strong className="text-gold-accent">Global Key Party booster</strong> will trigger automatically in-game for all online players!
          </p>

          {/* Progress Bar Track */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-[#09090B] rounded-full border border-border-custom p-0.5 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary-accent to-pink-500 relative transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                style={{ width: `${percentage}%` }}
              >
                {/* Stripe reflection effect */}
                <div className="absolute inset-0 bg-stripe-pattern bg-[length:20px_20px] opacity-15 animate-progress-stripes" />
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-secondary-text/60 font-mono">
              <span>0% (Vanilla Baseline)</span>
              <span>100% (Key Party Activated!)</span>
            </div>
          </div>

          {/* Milestones / Rewards info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 bg-[#09090B]/50 border border-border-custom p-4 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-primary-accent/10 border border-primary-accent/20 flex items-center justify-center text-primary-accent shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-inter text-[10px] text-white-text font-bold uppercase tracking-wider block">Level 1 Reward (Unlocks at 100%)</span>
                <span className="font-inter text-[11px] text-secondary-text leading-relaxed block">
                  All active players online during target completion will receive <strong>1x Mythic Key</strong> & <strong>1x Key Party Crate</strong>!
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#09090B]/50 border border-border-custom p-4 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-inter text-[10px] text-white-text font-bold uppercase tracking-wider block">Server Perks</span>
                <span className="font-inter text-[11px] text-secondary-text leading-relaxed block">
                  Hardware upgrade to full 23-core enterprise gaming nodes, guaranteeing 20 TPS across all custom survival dungeons.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
