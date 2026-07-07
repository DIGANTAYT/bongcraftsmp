"use client";

import React, { useState, useEffect } from "react";
import { Clock, Sparkles } from "lucide-react";

export const GlobalSalesTicker: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 15 });
  const [salesActive, setSalesActive] = useState(false);
  const [salesText, setSalesText] = useState("");

  // Load public sale configs from server
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/config/public");
        const data = await res.json();
        if (data) {
          setSalesActive(data.salesActive ?? false);
          setSalesText(data.salesText ?? "");
        }
      } catch (e) {
        console.error("Failed to load global sales config:", e);
      }
    };
    loadConfig();
  }, []);

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

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="w-full flex flex-col relative z-50">
      {/* ⚠️ 1. Top Urgency Count-down Sales Banner */}
      {salesActive && (
        <div className="w-full bg-gradient-to-r from-[#7c3aed] via-[#f43f5e] to-[#fbbf24] py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center text-white-text select-none shadow-lg">
          <div className="flex items-center gap-1.5 font-inter text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-bounce text-yellow-300" />
            <span>{salesText}</span>
          </div>
          
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-extrabold uppercase bg-black/35 px-2.5 py-1 rounded-md border border-white/10 shrink-0">
            <Clock className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
            <span>Ends In:</span>
            <span className="text-yellow-300">
              {formatNumber(timeLeft.hours)}h:{formatNumber(timeLeft.minutes)}m:{formatNumber(timeLeft.seconds)}s
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
