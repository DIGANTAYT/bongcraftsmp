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
      const ease = 0.15; // Smooth delay interpolation factor
      
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
      {/* Outer Eased Glowing Aura */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2 mix-blend-screen bg-rose-500/5 border border-rose-500/30 blur-[1px]"
        style={{
          transform: `translate3d(${trailPosition.x}px, ${trailPosition.y}px, 0) scale(${isHovering ? 1.6 : 1})`,
          borderColor: isHovering ? "rgba(245, 158, 11, 0.6)" : "rgba(244, 63, 94, 0.3)",
          backgroundColor: isHovering ? "rgba(245, 158, 11, 0.08)" : "rgba(244, 63, 94, 0.03)",
          boxShadow: isHovering 
            ? "0 0 15px rgba(245, 158, 11, 0.25)" 
            : "0 0 8px rgba(244, 63, 94, 0.15)"
        }}
      />
      {/* Inner Real-time Core Point */}
      <div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovering ? 0.8 : 1})`,
        }}
      />
    </>
  );
};
