"use client";

import React, { useEffect, useRef } from "react";

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      decay: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create initial particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000));
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(true));
      }
    };

    const createParticle = (randomY = false) => {
      const colors = [
        "rgba(124, 58, 237, ", // purple
        "rgba(139, 92, 246, ", // lighter purple
        "rgba(236, 72, 153, ", // pink/magenta
        "rgba(167, 139, 250, ", // violet
      ];
      const colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + 10,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -(Math.random() * 0.6 + 0.2),
        color: colorPrefix,
        opacity: Math.random() * 0.5 + 0.2,
        decay: Math.random() * 0.002 + 0.001,
      };
    };

    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        // Update particle
        p.y += p.speedY;
        p.x += p.speedX;
        
        // Float and fade
        if (p.y < 0 || p.opacity <= 0) {
          particles[index] = createParticle(false);
          return;
        }

        // Draw particle (glowing square to mimic Minecraft's voxel look but softened)
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = "rgba(124, 58, 237, 0.5)";
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background Dark Overlay */}
      <div className="absolute inset-0 bg-[#09090B]" />

      {/* Purple Nebula Ambient Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-radial from-[rgba(124,58,237,0.15)] to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-radial from-[rgba(124,58,237,0.12)] to-transparent blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[50%] h-[50%] rounded-full bg-radial from-[rgba(236,72,153,0.06)] to-transparent blur-[130px] pointer-events-none" />

      {/* Floating Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle Animated Fog Layer */}
      <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-[#09090B] via-[rgba(17,18,23,0.4)] to-transparent pointer-events-none z-1">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary-accent/40 via-transparent to-transparent animate-pulse-slow" />
      </div>

      {/* Minecraft Castle Silhouette (SVG for sharpness and modern luxury look) */}
      <div className="absolute inset-x-0 bottom-[-2px] h-[30vh] md:h-[40vh] flex items-end justify-center opacity-25 select-none pointer-events-none z-0">
        <svg
          className="w-full max-w-[1400px] h-full text-[#111217]"
          viewBox="0 0 1440 400"
          fill="currentColor"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Distant Hills */}
          <path
            d="M0 320 L180 290 L320 310 L500 270 L680 300 L890 260 L1100 290 L1250 280 L1440 310 L1440 400 L0 400 Z"
            opacity="0.5"
          />
          {/* Castle Silhouette */}
          <path d="
            M 0 350 
            L 250 350 
            L 250 330 L 260 330 L 260 350
            L 400 350
            L 400 280 L 415 280 L 415 310 L 430 310 L 430 250 L 450 250 L 450 310 L 465 310 L 465 280 L 480 280 L 480 350
            L 520 350
            L 520 180 L 530 180 L 530 150 L 540 150 L 540 120 L 550 120 L 550 150 L 560 150 L 560 180 L 570 180 L 570 350
            L 590 350
            L 590 220 L 610 220 L 610 200 L 620 200 L 620 160 L 635 160 L 635 200 L 645 200 L 645 220 L 665 220 L 665 350
            L 680 350
            L 680 140 L 700 140 L 700 100 L 710 100 L 710 60 Q 720 30 730 60 L 730 100 L 740 100 L 740 140 L 760 140 L 760 350
            L 780 350
            L 780 220 L 800 220 L 800 200 L 810 200 L 810 160 L 825 160 L 825 200 L 835 200 L 835 220 L 855 220 L 855 350
            L 870 350
            L 870 180 L 880 180 L 880 150 L 890 150 L 890 120 L 900 120 L 900 150 L 910 150 L 910 180 L 920 180 L 920 350
            L 960 350
            L 960 280 L 975 280 L 975 310 L 990 310 L 990 250 L 1010 250 L 1010 310 L 1025 310 L 1025 280 L 1040 280 L 1040 350
            L 1150 350
            L 1150 330 L 1160 330 L 1160 350
            L 1440 350
            L 1440 400 L 0 400 Z" 
          />
        </svg>
      </div>
    </div>
  );
};
