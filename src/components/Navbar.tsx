"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X, Copy, Check, LogOut, User, LogIn, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GlobalSalesTicker } from "./GlobalSalesTicker";

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [serverOnline, setServerOnline] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkMaint = () => {
      const mode = localStorage.getItem("bongcraft_maintenance_mode") === "true";
      setMaintenance(mode);
    };
    checkMaint();
    window.addEventListener("storage", checkMaint);
    const interval = setInterval(checkMaint, 4000);
    return () => {
      window.removeEventListener("storage", checkMaint);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const res = await fetch("https://api.mcsrvstat.us/3/play.bongcraftsmp.in");
        if (res.ok) {
          const data = await res.json();
          if (data.online) {
            setPlayerCount(data.players?.online || 0);
            setServerOnline(true);
          } else {
            setPlayerCount(0);
            setServerOnline(false);
          }
        }
      } catch (err) {
        console.error("Failed to query Minecraft server status:", err);
      }
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 45000); // query every 45s
    return () => clearInterval(interval);
  }, []);

  const copyIp = () => {
    navigator.clipboard.writeText("play.bongcraftsmp.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Ranks", href: "/ranks" },
    { name: "Crates", href: "/crates" },
    { name: "Coins", href: "/coins" },
    { name: "News", href: "/news" },
    { name: "Vote", href: "/vote" },
    { name: "About", href: "/about" },
    { name: "Support", href: "/support" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-55 flex flex-col w-full pointer-events-none">
      {/* 1. Global Sales Countdown & Recent Purchases Ticker */}
      <div className="w-full pointer-events-auto">
        <GlobalSalesTicker />
      </div>

      {/* 2. Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 flex flex-col pointer-events-auto ${
          scrolled
            ? "bg-[#09090B]/90 backdrop-blur-md border-b border-border-custom py-3"
            : "bg-[#09090B]/40 backdrop-blur-sm py-4 border-b border-border-custom/20"
        }`}
      >
        {maintenance && (
          <div className="w-full bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 flex items-center justify-center gap-2 text-center text-amber-500 font-inter text-[10px] font-bold uppercase tracking-wider select-none mb-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
            <span>Server Under Maintenance - In-Game Deliveries May Have Short Delays</span>
          </div>
        )}
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl border border-gold-accent/20 bg-card-bg/60 p-0.5 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="BongCraft SMP Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel font-bold text-lg md:text-xl tracking-wider text-white-text group-hover:text-gold-accent transition-colors duration-300">
              BONGCRAFT
            </span>
            <span className="font-inter text-[10px] text-primary-accent tracking-widest font-semibold uppercase leading-none mt-0.5">
              SMP
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-inter text-xs uppercase tracking-wider transition-colors duration-300 relative py-1 ${
                  isActive
                    ? "text-gold-accent font-bold"
                    : "text-secondary-text hover:text-white-text"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-gold-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* IP Copy Button & Online Counter */}
        <div className="hidden xl:flex items-center gap-3 bg-[#171923]/60 border border-border-custom px-4 py-2 rounded-full backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${serverOnline ? 'bg-emerald-500 animate-ping' : 'bg-rose-500 animate-pulse'}`} />
            <span className={`w-2.5 h-2.5 rounded-full absolute ${serverOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="font-inter text-xs text-white-text font-medium ml-1">
              {serverOnline ? `${playerCount} Players` : 'Offline'}
            </span>
          </div>
          <span className="text-secondary-text/30">|</span>
          <button
            onClick={copyIp}
            className="flex items-center gap-1.5 font-inter text-[10px] text-secondary-text hover:text-gold-accent transition-colors duration-300 font-semibold uppercase tracking-wider cursor-pointer"
          >
            play.bongcraftsmp.in
            {copied ? (
              <Check className="w-3.5 h-3.5 text-gold-accent" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        
        {/* Right side CTA actions (Cart, Auth & Discord) */}
        <div className="flex items-center gap-3">
          {/* Discord CTA */}
          <a
            href="https://discord.gg/WzDAzMYwGX"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center p-2.5 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 hover:border-[#5865F2]/50 text-[#5865F2] hover:text-white transition-all duration-300 rounded-xl"
            title="Join Discord Server"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.54,6.83,77.19,77.19,0,0,0,49.24,0,105.15,105.15,0,0,0,18.8,8.07C-3.41,40.83-1,72.9,9.58,88.42A105.65,105.65,0,0,0,41,96.36a77.7,77.7,0,0,0,8.66-14A68.69,68.69,0,0,1,38,76.58c1.1-.81,2.16-1.67,3.17-2.56a75.76,75.76,0,0,0,9.91,5.12c5.84,2.5,12.06,4.24,18.52,5.12a81.76,81.76,0,0,0,32-.14,75.46,75.46,0,0,0,18.28-5.1A72,72,0,0,0,119.82,74c1,1,2.06,1.86,3.17,2.56a68.69,68.69,0,0,1-11.64,5.78,77.7,77.7,0,0,0,8.66,14,105.65,105.65,0,0,0,31.42-7.94C128.84,72.9,131.25,40.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.88,46,53.88,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.12,46,96.12,53,91,65.69,84.69,65.69Z" />
            </svg>
          </a>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2.5 bg-primary-accent/10 hover:bg-primary-accent/20 border border-primary-accent/30 hover:border-primary-accent/50 text-primary-accent hover:text-white transition-all duration-300 rounded-xl cursor-pointer"
            title="Open Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 flex items-center justify-center bg-gold-accent text-primary-bg font-inter font-bold text-[10px] rounded-full px-1.5 animate-scale border border-primary-bg">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Sign In / Profile dropdown */}
          <div className="relative hidden lg:block">
            {user ? (
              <>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#171923]/60 border border-border-custom hover:border-primary-accent/40 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-6 h-6 rounded-md overflow-hidden bg-primary-bg border border-primary-accent/30">
                    <img
                      src={`https://mc-heads.net/avatar/${profile?.minecraft_username || "Steve"}`}
                      alt={profile?.minecraft_username || "player"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-inter text-xs text-white-text font-bold truncate max-w-[90px]">
                    {profile?.minecraft_username}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#09090B] border border-border-custom rounded-2xl shadow-xl p-2.5 z-55 flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-border-custom/50">
                      <div className="text-[10px] text-secondary-text/60 font-inter font-bold uppercase tracking-wider">
                        Active IGN
                      </div>
                      <div className="text-xs text-white-text font-inter font-bold truncate">
                        {profile?.minecraft_username}
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-inter text-secondary-text hover:text-white-text hover:bg-card-bg/60 rounded-xl transition-colors cursor-pointer w-full text-left"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    {user?.email === "sarkardiganta04@gmail.com" && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-inter text-gold-accent hover:text-white-text hover:bg-gold-accent/10 rounded-xl transition-colors cursor-pointer w-full text-left font-bold"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-inter text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer w-full text-left border-t border-border-custom/30 mt-1 pt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-primary-accent hover:bg-primary-accent/90 text-white-text font-inter font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 hover:shadow-[0_0_12px_rgba(124,58,237,0.3)]"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 text-secondary-text hover:text-white-text hover:bg-card-bg/55 rounded-xl border border-border-custom cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[73px] inset-x-0 glass-panel border-b border-border-custom py-6 px-4 flex flex-col gap-5 animate-slide">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-inter text-base py-2 border-b border-border-custom/50 ${
                  pathname === link.href ? "text-gold-accent font-bold" : "text-secondary-text"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile User Auth Section */}
          <div className="flex flex-col gap-2.5 pb-2 border-b border-border-custom/50">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5 px-2">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-primary-bg border border-primary-accent/30 shrink-0">
                    <img
                      src={`https://mc-heads.net/avatar/${profile?.minecraft_username || "Steve"}`}
                      alt={profile?.minecraft_username || "player"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-inter text-[9px] text-secondary-text/60 font-bold uppercase tracking-wider block">
                      Active Profile (IGN)
                    </span>
                    <span className="font-inter text-sm text-white-text font-bold leading-tight block">
                      {profile?.minecraft_username}
                    </span>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-secondary-bg hover:bg-card-bg/60 border border-border-custom text-white-text font-inter font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                {user?.email === "sarkardiganta04@gmail.com" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-gold-accent/10 hover:bg-gold-accent/20 border border-gold-accent/40 text-gold-accent font-inter font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/35 text-red-400 font-inter font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 bg-primary-accent hover:bg-primary-accent/90 text-white-text font-inter font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:shadow-[0_0_12px_rgba(124,58,237,0.3)]"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Server Status & IP Copy */}
          <div className="flex items-center justify-between bg-[#09090B]/60 border border-border-custom px-4 py-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${serverOnline ? 'bg-emerald-500 animate-ping' : 'bg-rose-500 animate-pulse'}`} />
              <span className={`w-2.5 h-2.5 rounded-full absolute ${serverOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="font-inter text-xs text-white-text font-medium ml-1">
                {serverOnline ? `${playerCount} Players Online` : 'Server Offline'}
              </span>
            </div>
            <button
              onClick={copyIp}
              className="flex items-center gap-1.5 font-inter text-[10px] text-gold-accent font-semibold uppercase tracking-wider cursor-pointer max-w-[170px] truncate"
            >
              play.bongcraftsmp.in
              {copied ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 flex-shrink-0" />}
            </button>
          </div>

          {/* Mobile Discord CTA */}
          <a
            href="https://discord.gg/WzDAzMYwGX"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 py-3 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white font-inter font-semibold rounded-2xl transition-colors duration-300"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.54,6.83,77.19,77.19,0,0,0,49.24,0,105.15,105.15,0,0,0,18.8,8.07C-3.41,40.83-1,72.9,9.58,88.42A105.65,105.65,0,0,0,41,96.36a77.7,77.7,0,0,0,8.66-14A68.69,68.69,0,0,1,38,76.58c1.1-.81,2.16-1.67,3.17-2.56a75.76,75.76,0,0,0,9.91,5.12c5.84,2.5,12.06,4.24,18.52,5.12a81.76,81.76,0,0,0,32-.14,75.46,75.46,0,0,0,18.28-5.1A72,72,0,0,0,119.82,74c1,1,2.06,1.86,3.17,2.56a68.69,68.69,0,0,1-11.64,5.78,77.7,77.7,0,0,0,8.66,14,105.65,105.65,0,0,0,31.42-7.94C128.84,72.9,131.25,40.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.88,46,53.88,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.12,46,96.12,53,91,65.69,84.69,65.69Z" />
            </svg>
            Join Community Discord
          </a>
        </div>
      )}
      </div>
    </header>
  );
};
