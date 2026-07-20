"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { 
  Calendar, Tag, MessageSquare, ArrowRight, ShieldAlert, Sparkles, X 
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
  content: React.ReactNode;
}

export default function NewsPage() {
  const [discordUrl, setDiscordUrl] = useState("https://discord.gg/WzDAzMYwGX");

  React.useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/config/public");
        if (res.ok) {
          const config = await res.json();
          setDiscordUrl(config.discordInvite ?? "https://discord.gg/WzDAzMYwGX");
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadConfig();
  }, []);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const categories = [
    { id: "all", label: "All News" },
    { id: "update", label: "Update" },
    { id: "event", label: "Event" },
    { id: "notice", label: "Notice" },
    { id: "patch", label: "Patch Notes" },
    { id: "community", label: "Community" },
    { id: "status", label: "Server Status" },
  ];

  // Professional announcements populate array
  const articles: NewsArticle[] = [
    {
      id: "rank-prices-revised-notice",
      title: "Official Store Update: Rank Prices Revised",
      excerpt: "To make BongCraft SMP more accessible for everyone while continuing to support the server's growth, we have officially revised the prices of all premium ranks available in our store.",
      category: "notice",
      date: "Jul 20, 2026",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      tagLabel: "Notice",
      tagColor: "#fbbf24",
      content: (
        <div className="space-y-5 text-secondary-text leading-relaxed text-sm">
          <p className="font-semibold text-white-text">
            Jul 20, 2026
          </p>

          <p>
            To make BongCraft SMP more accessible for everyone while continuing to support the server's growth, we have officially revised the prices of all premium ranks available in our store.
          </p>

          <p>
            After reviewing community feedback and our long-term plans, we've introduced a new pricing structure that offers better value without compromising the premium experience our players enjoy.
          </p>

          <div className="bg-primary-bg/50 border border-gold-accent/30 rounded-2xl p-5 space-y-3 my-4">
            <h4 className="font-cinzel text-xs font-bold text-gold-accent uppercase tracking-wider flex items-center gap-2">
              ✨ What's Changed?
            </h4>
            <ul className="space-y-2 text-xs text-secondary-text">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">💎</span>
                <span><strong>Updated pricing</strong> for all premium ranks (Lord ₹249, Paladin ₹449, Duke ₹749, King ₹999).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">📉</span>
                <span><strong>More affordable options</strong> for new and returning players.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">⚖️</span>
                <span><strong>Better value</strong> across every single rank tier.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✅</span>
                <span><strong>Existing rank perks and benefits</strong> remain 100% unchanged.</span>
              </li>
            </ul>
          </div>

          <p>
            If you've been thinking about purchasing or upgrading your rank, now is the perfect time to take advantage of the new pricing.
          </p>

          <p>
            Every purchase directly supports the development of BongCraft SMP, helping us deliver new features, exciting events, regular updates, and a better gameplay experience for the entire community.
          </p>

          <p>
            Thank you for being part of our journey and for continuing to support BongCraft SMP.
          </p>

          <p className="font-extrabold text-gold-accent text-sm pt-2">
            Visit the Store today and check out the updated rank prices!
          </p>

          <p className="font-bold text-secondary-text text-xs italic">
            — BongCraft SMP Management Team
          </p>
        </div>
      )
    },
    {
      id: "major-community-event-announced",
      title: "Major Community Event Announced for BongCraft SMP",
      excerpt: "The BongCraft SMP team is excited to announce that preparations are underway for one of the largest community events ever hosted on the server.",
      category: "event",
      date: "Jul 20, 2026",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
      tagLabel: "Event",
      tagColor: "#3b82f6",
      content: (
        <div className="space-y-5 text-secondary-text leading-relaxed text-sm">
          <p className="font-semibold text-white-text">
            Jul 20, 2026
          </p>

          <p>
            The BongCraft SMP team is excited to announce that preparations are underway for one of the <strong>largest community events</strong> ever hosted on the server.
          </p>

          <p>
            While full details are still under wraps, players can expect a unique experience featuring exclusive activities, limited-time rewards, and exciting challenges for the entire community. This upcoming event has been in development for several weeks and is designed to bring players together like never before.
          </p>

          <p>
            Although the official event date has not yet been revealed, the announcement, schedule, and participation details will be shared soon.
          </p>

          <p>
            Players are encouraged to stay active, prepare their gear, and keep an eye on our announcements so they don't miss what's coming next.
          </p>

          <p>
            More information will be released in the coming days.
          </p>

          <p className="font-bold text-gold-accent pt-2">
            — BongCraft SMP Team
          </p>
        </div>
      )
    },
    {
      id: "sponsorship-announcement",
      title: "BongCraft SMP Official Launch — Sponsored by Akash Samanta!",
      excerpt: "We are thrilled to announce that BongCraft SMP has partnered with Akash Samanta as our official sponsor! This collaboration secures the server nodes for a 100% lag-free experience.",
      category: "notice",
      date: "Jul 7, 2026",
      image: "/images/news_sponsor.jpg", 
      tagLabel: "Sponsorship",
      tagColor: "#fbbf24",
      content: (
        <div className="space-y-5 text-secondary-text leading-relaxed text-sm">
          <p>
            BongCraft SMP is proud to announce its official partnership and sponsorship by <strong>Akash Samanta</strong>! 
            This collaboration marks a massive milestone for our server, providing the resources needed to keep BongCraft online, 
            stable, and expanding for years to come.
          </p>

          <div className="bg-primary-bg/50 border border-border-custom rounded-2xl p-4.5 space-y-2">
            <h4 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider">
              🎮 Connection Information:
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-secondary-text pl-1">
              <li><strong>Java Server IP:</strong> <code className="text-primary-accent">play.bongcraftssmp.in</code></li>
              <li><strong>Bedrock Server IP:</strong> <code className="text-primary-accent">play.bongcraftssmp.in</code> (Port: <code className="text-primary-accent">19132</code>)</li>
              <li className="text-[10px] text-amber-500/70 list-none mt-1">💡 Note: You can also connect via <code className="text-secondary-text/80">play.bongcraftsmp.in</code></li>
            </ul>
          </div>

          <h4 className="font-cinzel text-white-text font-bold uppercase tracking-wider text-xs mt-6">
            🚀 Hardware Upgrades & Uptime
          </h4>
          <p>
            With this sponsorship, we have migrated our databases and game nodes to enterprise-grade server hardware 
            featuring dedicated Ryzen CPUs and ultra-fast NVMe storage. Players can now explore, mine, and battle in the RPG 
            world with a rock-solid 20 TPS.
          </p>

          <p>
            We want to give a massive shoutout and thank you to <strong>Akash Samanta</strong> for believing in the project 
            and making this community possible. See you in-game!
          </p>
        </div>
      )
    },
    {
      id: "season-genesis-launch",
      title: "Season: Genesis — The Ultimate RPG Survival is Live!",
      excerpt: "The Nether dimension is officially unlocked! Evolve your class, unlock tiered trait skill trees, explore custom dungeons, and conquer boss fights today.",
      category: "update",
      date: "Jun 13, 2026",
      image: "https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?q=80&w=600&auto=format&fit=crop",
      tagLabel: "Update",
      tagColor: "#f43f5e",
      content: (
        <div className="space-y-5 text-secondary-text leading-relaxed text-sm">
          <p>
            The wait is finally over! <strong>Season: Genesis</strong> is officially live on BongCraft SMP. 
            We have integrated our ultimate RPG survival setups, featuring massive progression pathways and custom visual textures.
          </p>

          <h4 className="font-cinzel text-white-text font-bold uppercase tracking-wider text-xs mt-6">
            ⚔️ Key RPG Launch Features:
          </h4>
          <ul className="list-disc list-inside space-y-2 text-xs text-secondary-text pl-1">
            <li><strong>Grinwood Town RPG Hub:</strong> Speak with 14+ interactive NPCs, blacksmiths, and merchants for custom trade deals and storylines.</li>
            <li><strong>Player Classes & Skills:</strong> Choose warrior, archer, or mage to unlock stat boards and combat skills.</li>
            <li><strong>Dungeons & PvE Bounties:</strong> Battle instanced dungeons containing customized boss mechanics.</li>
            <li><strong>Skill Trees:</strong> Progress through Bronze, Silver, Gold, and Master level passive trait enhancements.</li>
          </ul>

          <p>
            Grab your gear, select your class, and head into the wild today. Check out our ranks and coin pages to support the server!
          </p>
        </div>
      )
    }
  ];

  // Automatic Discord Webhook Trigger when a new news article is added
  React.useEffect(() => {
    const autoBroadcastLatestNews = async () => {
      if (!articles || articles.length === 0) return;
      const latestArticle = articles[0];
      const lastSentId = localStorage.getItem("bongcraft_last_sent_discord_news_id");

      if (!lastSentId) {
        localStorage.setItem("bongcraft_last_sent_discord_news_id", latestArticle.id);
        return;
      }

      if (lastSentId !== latestArticle.id) {
        try {
          const res = await fetch("/api/admin/news", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: latestArticle.title,
              excerpt: latestArticle.excerpt,
              category: latestArticle.category,
              date: latestArticle.date,
              siteUrl: window.location.origin
            })
          });
          if (res.ok) {
            localStorage.setItem("bongcraft_last_sent_discord_news_id", latestArticle.id);
          }
        } catch (e) {
          console.error("Auto Discord news trigger error:", e);
        }
      }
    };

    autoBroadcastLatestNews();
  }, []);

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
              Your central source for announcements, patch notes, events, and chronicles from the heart of the BongCraft SMP community.
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
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white-text font-bold uppercase text-[10px] tracking-wider rounded-xl transition-colors cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  Follow Live Discord Feeds
                </a>
              </div>
            </div>
          ) : (
            /* Layout structure grid if articles exist */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="glass-panel overflow-hidden rounded-3xl border border-border-custom hover:border-primary-accent/30 hover:shadow-[0_10px_25px_-5px_rgba(244,63,94,0.1)] transition-all duration-300 flex flex-col group cursor-pointer"
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

      {/* Pop-up Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop with animation */}
          <div 
            className="fixed inset-0 bg-[#09090B]/85 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedArticle(null)}
          />

          {/* Modal Container */}
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-border-custom shadow-2xl relative z-10 overflow-hidden my-8 animate-scale">
            {/* Image Banner */}
            <div className="relative h-60 bg-primary-bg">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111217] via-[#111217]/50 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 bg-[#09090B]/60 hover:bg-[#09090B]/90 border border-border-custom text-secondary-text hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-5 bg-[#111217]">
              {/* Metadata */}
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-secondary-text">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-primary-accent" />
                  <span style={{ color: selectedArticle.tagColor }}>{selectedArticle.tagLabel}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedArticle.date}</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="font-cinzel text-xl md:text-2xl font-black text-white-text tracking-wide leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="h-px bg-border-custom/50" />

              {/* Detailed Article Contents */}
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
