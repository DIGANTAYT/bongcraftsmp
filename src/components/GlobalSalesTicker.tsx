"use client";

import React, { useState, useEffect } from "react";
import { Clock, TrendingUp, Sparkles, Volume2, VolumeX } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Purchase {
  ign: string;
  item: string;
  timeLabel: string;
}

export const GlobalSalesTicker: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 15 });
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  // 1. Ticking countdown timer that resets daily to maintain active urgency
  useEffect(() => {
    // Set countdown to end of current day
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff <= 0) {
        return { hours: 23, minutes: 59, seconds: 59 };
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Fetch recent purchases from database, fallback to realistic mock data if empty
  useEffect(() => {
    const fetchRecentOrders = async () => {
      const mockPurchases: Purchase[] = [
        { ign: "DigantaYT", item: "👑 King Rank", timeLabel: "2m ago" },
        { ign: "Akash_Samanta", item: "💎 12,000 Coins Bundle", timeLabel: "14m ago" },
        { ign: "GamerBong", item: "⚔️ Paladin Rank", timeLabel: "28m ago" },
        { ign: "MinecraftBabu", item: "🔑 5x Epic Keys", timeLabel: "45m ago" },
        { ign: "SamantaFans", item: "🏰 Duke Rank", timeLabel: "1h ago" },
        { ign: "JoyBangla", item: "💰 2,500 Coins Bundle", timeLabel: "2h ago" },
      ];

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("status", "Completed")
            .order("created_at", { ascending: false })
            .limit(6);

          if (!error && data && data.length > 0) {
            const dbPurchases = data.map((o: any) => {
              // Parse items array
              let itemLabel = "Store Item";
              if (Array.isArray(o.items) && o.items.length > 0) {
                const firstItem = o.items[0];
                itemLabel = typeof firstItem === "string" 
                  ? firstItem 
                  : `${firstItem.name} (x${firstItem.quantity})`;
              }
              
              // Calculate relative time
              const mins = Math.floor((new Date().getTime() - new Date(o.created_at).getTime()) / (1000 * 60));
              let relativeTime = `${mins}m ago`;
              if (mins <= 0) relativeTime = "Just now";
              else if (mins >= 60) relativeTime = `${Math.floor(mins / 60)}h ago`;

              return {
                ign: o.ign.split(" ")[0], // strip UTR
                item: itemLabel,
                timeLabel: relativeTime
              };
            });
            setPurchases(dbPurchases);
            return;
          }
        } catch (e) {
          console.error("Failed to load live purchases:", e);
        }
      }

      setPurchases(mockPurchases);
    };

    fetchRecentOrders();
    const interval = setInterval(fetchRecentOrders, 60000); // refresh every 1m
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="w-full flex flex-col relative z-50">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ⚠️ 1. Top Urgency Count-down Sales Banner */}
      <div className="w-full bg-gradient-to-r from-[#7c3aed] via-[#f43f5e] to-[#fbbf24] py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center text-white-text select-none shadow-lg">
        <div className="flex items-center gap-1.5 font-inter text-[10px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-bounce text-yellow-300" />
          <span>🔥 Grand Launch Sale: 25% OFF ALL RANKS & COINS! Use Code: <strong className="underline text-yellow-300">AKASH</strong></span>
        </div>
        
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-extrabold uppercase bg-black/35 px-2.5 py-1 rounded-md border border-white/10 shrink-0">
          <Clock className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
          <span>Ends In:</span>
          <span className="text-yellow-300">
            {formatNumber(timeLeft.hours)}h:{formatNumber(timeLeft.minutes)}m:{formatNumber(timeLeft.seconds)}s
          </span>
        </div>
      </div>

      {/* 🛒 2. Horizontal Scrolling Purchases Ticker */}
      <div className="w-full bg-[#111217]/90 border-b border-border-custom/50 py-2.5 overflow-hidden flex items-center relative">
        {/* Fixed Title Label */}
        <div className="bg-[#111217] px-4 py-1 border-r border-border-custom/60 flex items-center gap-1.5 shrink-0 z-10 text-[9px] font-inter font-black uppercase tracking-wider text-gold-accent">
          <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
          <span>Recent Activity</span>
        </div>

        {/* Scrolling Items */}
        <div className="flex w-full overflow-hidden select-none relative">
          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee-slow">
            {/* Render items twice for seamless loop */}
            {[...purchases, ...purchases].map((p, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 font-inter text-[10px] text-secondary-text bg-[#18181b]/60 border border-border-custom px-3 py-1.5 rounded-full"
              >
                <div className="relative w-4.5 h-4.5 rounded-md overflow-hidden bg-[#09090b] border border-primary-accent/30 shrink-0">
                  <img
                    src={`https://mc-heads.net/avatar/${p.ign}`}
                    alt={p.ign}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white-text font-bold truncate max-w-[80px]">{p.ign}</span>
                <span className="text-secondary-text/60">unlocked</span>
                <span className="text-gold-accent font-semibold text-glow-gold">{p.item}</span>
                <span className="text-[8px] text-secondary-text/40 font-mono ml-1">{p.timeLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
