"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews = [
    {
      username: "ProGamer_99",
      rank: "King",
      text: "Hands down the best survival server in India! The community is extremely helpful, and the gameplay is lag-free even with 300+ players. The Custom Dungeons are crazy fun!",
      rating: 5,
    },
    {
      username: "Sourav_Das",
      rank: "Knight",
      text: "The server performance is amazing. Uptime is perfect, and the balanced economy means everyone has a fair chance to grow. The events on Discord keep the server super active.",
      rating: 5,
    },
    {
      username: "Sneha_Roy",
      rank: "Duke",
      text: "Bought the Duke rank last month, and delivery was instant. The custom wings and particle effects look beautiful in-game. Supporting the devs was totally worth it!",
      rating: 5,
    },
    {
      username: "RohanMinecraft",
      rank: "Paladin",
      text: "A truly unique experience. The Royal Bengal themed spawn and castle silhouette are stunning. Love the custom job skills system and balanced auction houses.",
      rating: 5,
    },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const currentReview = reviews[activeIndex];

  return (
    <section id="testimonials" className="py-24 relative z-10 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
            Community Voices
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
            Player Testimonials
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-4" />
        </div>

        {/* Testimonial Box */}
        <div className="max-w-3xl mx-auto glass-panel border border-border-custom rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-primary-accent/10 to-transparent blur-2xl pointer-events-none -z-1" />
          
          <Quote className="absolute top-6 left-6 w-16 h-16 text-white-text/5 pointer-events-none" />

          <div className="min-h-[220px] flex flex-col justify-between">
            
            {/* Rating & Review Text */}
            <div className="space-y-6">
              {/* Star Rating */}
              <div className="flex gap-1">
                {[...Array(currentReview.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-accent text-gold-accent text-glow-gold" />
                ))}
              </div>

              {/* Review Text */}
              <p className="font-inter text-base md:text-lg text-white-text/90 italic leading-relaxed">
                "{currentReview.text}"
              </p>
            </div>

            {/* Profile Detail */}
            <div className="flex items-center justify-between border-t border-border-custom pt-6 mt-8">
              <div className="flex items-center gap-4">
                {/* Minecraft Avatar */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-primary-bg border border-border-custom p-0.5">
                  <img
                    src={`https://mc-heads.net/avatar/${currentReview.username}`}
                    alt={currentReview.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-inter text-base font-bold text-white-text">
                    {currentReview.username}
                  </h4>
                  <span className="font-inter text-[10px] text-primary-accent font-extrabold uppercase tracking-widest block mt-0.5">
                    Rank purchased: {currentReview.rank}
                  </span>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 bg-card-bg hover:bg-secondary-bg/60 border border-border-custom hover:border-primary-accent/40 text-secondary-text hover:text-white-text transition-colors duration-300 rounded-xl cursor-pointer"
                  title="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 bg-card-bg hover:bg-secondary-bg/60 border border-border-custom hover:border-primary-accent/40 text-secondary-text hover:text-white-text transition-colors duration-300 rounded-xl cursor-pointer"
                  title="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
