"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { 
  Calendar, Tag, MessageSquare, ArrowRight, ShieldAlert, Sparkles 
} from "lucide-react";

type Category = "all" | "update" | "event" | "notice" | "patch" | "community" | "status";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: Category;
  date: string;
  image: string;
  tagLabel: string;
  tagColor: string;
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const categories = [
    { id: "all", label: "All News" },
    { id: "update", label: "Update" },
    { id: "event", label: "Event" },
    { id: "notice", label: "Notice" },
    { id: "patch", label: "Patch Notes" },
    { id: "community", label: "Community" },
    { id: "status", label: "Server Status" },
  ];

  // We define an empty array for the "blank" professional state
  // If the admin or user wants to add news, they can populate this array
  const articles: NewsArticle[] = [];

  const filteredArticles = articles.filter(
    (art) => activeCategory === "all" || art.category === activeCategory
  );

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-accent/10 border border-primary-accent/30 rounded-full text-[10px] text-primary-accent font-inter font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-gold-accent animate-pulse" />
              Official Blog
            </span>
            <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
              News & Updates
            </h1>
            <p className="font-inter text-xs md:text-sm text-secondary-text leading-relaxed">
              Everything you need to know about what's happening on play.bongcraftsmp.in.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mx-auto mt-4" />
          </div>

          {/* Category Filter Navigation Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pb-4 border-b border-border-custom/30 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as Category)}
                className={`px-4.5 py-2.5 rounded-full font-inter text-xs tracking-wider uppercase font-bold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-rose-500 text-white-text shadow-lg shadow-rose-500/20"
                    : "bg-[#09090B]/60 border border-border-custom text-secondary-text hover:text-white-text hover:border-secondary-text/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Articles Section */}
          {filteredArticles.length === 0 ? (
            /* Professional Blank/Placeholder layout when news list is empty */
            <div className="space-y-10">
              
              {/* Central empty state warning */}
              <div className="glass-panel p-8 md:p-12 rounded-3xl border border-border-custom max-w-xl mx-auto text-center space-y-6">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500 mx-auto">
                  <ShieldAlert className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-cinzel text-lg font-bold text-white-text uppercase tracking-wider">
                    Announcements Drafting
                  </h3>
                  <p className="font-inter text-xs text-secondary-text leading-relaxed">
                    We are currently preparing some massive announcements, patch notes, and community updates. The blog catalog is temporarily blank.
                  </p>
                </div>
                <a
                  href="https://discord.gg/WzDAzMYwGX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white-text font-bold uppercase text-[10px] tracking-wider rounded-xl transition-colors cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  Follow Live Discord Feeds
                </a>
              </div>

              {/* Styled dashed templates to show layout professional structures */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-35 max-w-5xl mx-auto">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item}
                    className="glass-panel p-6 rounded-3xl border border-dashed border-border-custom/80 flex flex-col justify-between h-[360px]"
                  >
                    <div className="space-y-4">
                      {/* Image placeholder */}
                      <div className="w-full h-40 bg-secondary-bg/25 border border-dashed border-border-custom/50 rounded-2xl flex items-center justify-center text-secondary-text/20">
                        <Tag className="w-10 h-10" />
                      </div>
                      
                      {/* Text placeholders */}
                      <div className="space-y-3.5">
                        <div className="flex gap-2">
                          <span className="w-12 h-4 bg-secondary-bg/40 rounded-full" />
                          <span className="w-16 h-4 bg-secondary-bg/40 rounded-full" />
                        </div>
                        <div className="h-4 bg-secondary-bg/40 rounded-xl w-3/4" />
                        <div className="space-y-2">
                          <div className="h-2.5 bg-secondary-bg/30 rounded-xl w-full" />
                          <div className="h-2.5 bg-secondary-bg/30 rounded-xl w-5/6" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-secondary-text font-bold uppercase tracking-wider">
                      <span>Preview Draft Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            /* Layout structure grid if articles exist */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="glass-panel overflow-hidden rounded-3xl border border-border-custom hover:border-primary-accent/30 hover:shadow-[0_10px_25px_-5px_rgba(244,63,94,0.1)] transition-all duration-300 flex flex-col group"
                >
                  {/* Article Banner image */}
                  <div className="relative h-48 bg-primary-bg overflow-hidden">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/90 via-transparent to-transparent" />
                  </div>

                  {/* Info details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Badges metadata */}
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-secondary-text">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-primary-accent" />
                          <span style={{ color: art.tagColor }}>{art.tagLabel}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{art.date}</span>
                        </span>
                      </div>

                      {/* Header title */}
                      <h3 className="font-cinzel text-base md:text-lg font-bold text-white-text tracking-wide leading-snug group-hover:text-gold-accent transition-colors duration-300">
                        {art.title}
                      </h3>

                      {/* Snippet text */}
                      <p className="font-inter text-xs text-secondary-text leading-relaxed line-clamp-3">
                        {art.excerpt}
                      </p>
                    </div>

                    {/* Footer read button */}
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-500 group-hover:text-rose-400 font-bold uppercase tracking-wider transition-colors duration-300">
                        Read Article
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
