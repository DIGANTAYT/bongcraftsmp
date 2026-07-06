"use client";

import React, { useEffect, useState, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rot: number;
  color: string;
  size: number;
}

export const CursorFollower: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);

  const lastSpawnRef = useRef({ x: 0, y: 0 });
  const particleIdRef = useRef(0);

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
      // Spawn Minecraft-style villager particles on movement
      const dx = e.clientX - lastSpawnRef.current.x;
      const dy = e.clientY - lastSpawnRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 15) {
        const id = particleIdRef.current++;
        const randomDx = (Math.random() - 0.5) * 45; 
        const randomDy = (Math.random() - 0.5) * 45 - 25; // Drift upwards slightly
        const randomRot = (Math.random() - 0.5) * 180;
        const size = Math.random() * 4 + 3.5; // Minecraft square particles size

        // Green-Yellow happy villager particle palette matching the reference image
        const colors = ["#a3e635", "#84cc16", "#eab308", "#facc15", "#bef264", "#22c55e"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newParticle: Particle = {
          id,
          x: e.clientX,
          y: e.clientY,
          dx: randomDx,
          dy: randomDy,
          rot: randomRot,
          color: randomColor,
          size
        };

        setParticles((prev) => [...prev.slice(-15), newParticle]); // Limit to max 15 active particles for performance
        lastSpawnRef.current = { x: e.clientX, y: e.clientY };

        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== id));
        }, 750);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <style>{`
        @keyframes particle-drift {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--dx), var(--dy), 0) scale(0.1) rotate(var(--rot));
            opacity: 0;
          }
        }
        .cursor-particle {
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          animation: particle-drift 0.75s forwards cubic-bezier(0.1, 0.8, 0.25, 1);
        }
      `}</style>

      {/* Dynamic Minecraft Sparkle Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="cursor-particle mix-blend-screen"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 5px ${p.color}`,
            borderRadius: "1px", // Minecraft square particles style
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            "--rot": `${p.rot}deg`,
          } as any}
        />
      ))}
    </>
  );
};
