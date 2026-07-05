"use client";

import React, { useEffect, useState, useRef } from "react";
import { Users, Shield, Award, Calendar } from "lucide-react";

interface StatItemProps {
  label: string;
  targetValue: number;
  suffix?: string;
  icon: React.ReactNode;
  delay?: number;
}

const StatCounter: React.FC<StatItemProps> = ({ label, targetValue, suffix = "", icon, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const duration = 2000; // 2 seconds animation
    const steps = 50;
    const stepTime = duration / steps;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, targetValue]);

  return (
    <div
      ref={elementRef}
      className="glass-panel border border-border-custom px-6 py-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group hover:border-primary-accent/30 transition-all duration-300"
    >
      {/* Ambient hover glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon Wrapper */}
      <div className="w-14 h-14 bg-primary-bg border border-border-custom group-hover:border-primary-accent/30 text-primary-accent group-hover:text-gold-accent rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 shadow-md">
        {icon}
      </div>

      {/* Number */}
      <span className="font-cinzel text-3xl md:text-4xl font-extrabold text-white-text tracking-wide mb-1 select-none">
        {count.toLocaleString()}
        {suffix}
      </span>

      {/* Label */}
      <span className="font-inter text-xs text-secondary-text font-bold uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
};

export const Stats: React.FC = () => {
  return (
    <section className="py-12 relative z-10 px-4 md:px-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <StatCounter
            label="Server Core TPS"
            targetValue={20}
            suffix=" / 20"
            icon={<Shield className="w-6 h-6" />}
          />
          <StatCounter
            label="Node Uptime"
            targetValue={99}
            suffix="%"
            icon={<Calendar className="w-6 h-6" />}
          />
          <StatCounter
            label="Claimable Kits"
            targetValue={18}
            suffix=" kits"
            icon={<Award className="w-6 h-6" />}
          />
        </div>
      </div>
    </section>
  );
};
