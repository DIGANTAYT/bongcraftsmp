"use client";

import React, { useEffect, useState, useRef } from "react";

export const CursorFollower: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const trailRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  // Check mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(hasTouch || mobileUA);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isMobile]);

  // Dynamic hover listener using MutationObserver
  useEffect(() => {
    if (isMobile) return;

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    const updateListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .cursor-pointer, [onClick]'
      );
      
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });

      return clickables;
    };

    let clickables = updateListeners();

    const observer = new MutationObserver(() => {
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
      clickables = updateListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
      observer.disconnect();
    };
  }, [isMobile]);

  // Eased trail animation loop
  useEffect(() => {
    if (isMobile) return;

    const animateTrail = () => {
      const ease = 0.07; // Much smoother delay factor (wavier flow)
      
      const dx = position.x - trailRef.current.x;
      const dy = position.y - trailRef.current.y;
      
      trailRef.current.x += dx * ease;
      trailRef.current.y += dy * ease;
      
      setTrailPosition({ x: trailRef.current.x, y: trailRef.current.y });
      
      requestRef.current = requestAnimationFrame(animateTrail);
    };

    requestRef.current = requestAnimationFrame(animateTrail);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position, isMobile]);

  if (isMobile || isHidden) return null;

  return (
    <>
      <style>{`
        @keyframes wavy-aura-pulse {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate3d(0, 0, 0) scale(1.2);
            opacity: 0.45;
          }
        }
        .cursor-wavy-aura {
          animation: wavy-aura-pulse 2.2s infinite ease-in-out;
        }
      `}</style>

      {/* Outer Eased Glowing Aura (Small, Wavy/Pulsing) */}
      <div
        className="fixed top-0 left-0 w-5.5 h-5.5 rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 mix-blend-screen bg-rose-500/5 border border-rose-500/25 blur-[0.5px]"
        style={{
          transform: `translate3d(${trailPosition.x}px, ${trailPosition.y}px, 0) scale(${isHovering ? 1.45 : 1})`,
          borderColor: isHovering ? "rgba(245, 158, 11, 0.55)" : "rgba(244, 63, 94, 0.28)",
          backgroundColor: isHovering ? "rgba(245, 158, 11, 0.06)" : "rgba(244, 63, 94, 0.02)",
          boxShadow: isHovering 
            ? "0 0 12px rgba(245, 158, 11, 0.22)" 
            : "0 0 6px rgba(244, 63, 94, 0.12)"
        }}
      >
        <div className="w-full h-full rounded-full cursor-wavy-aura border border-dashed border-rose-500/20" />
      </div>

      {/* Inner Real-time Core Point (Small & Sharp) */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_6px_rgba(244,63,94,0.75)]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovering ? 0.8 : 1})`,
        }}
      />
    </>
  );
};
