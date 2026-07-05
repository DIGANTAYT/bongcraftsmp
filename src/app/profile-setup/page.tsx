"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileSetupPage() {
  const { user, needsProfileSetup, linkMinecraftUsername } = useAuth();
  const router = useRouter();

  const [ign, setIgn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect away if they don't need profile setup
  useEffect(() => {
    if (user && !needsProfileSetup) {
      router.push("/");
    } else if (!user) {
      router.push("/login");
    }
  }, [user, needsProfileSetup, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanIgn = ign.replace(/[^a-zA-Z0-9_]/g, "").trim();
    if (cleanIgn.length < 3) {
      setError("Please enter a valid Minecraft In-Game Name (min 3 characters).");
      setLoading(false);
      return;
    }

    try {
      const { error: linkError } = await linkMinecraftUsername(cleanIgn);
      if (linkError) {
        setError(linkError.message || "Failed to link username. Please try again.");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-32 pb-16 px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md glass-panel p-8 rounded-3xl border border-border-custom shadow-2xl relative overflow-hidden"
        >
          {/* Backlight Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary-accent/15 filter blur-3xl -z-1" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-gold-accent/10 filter blur-3xl -z-1" />

          {/* Heading */}
          <div className="text-center mb-8">
            <span className="font-inter text-[10px] text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
              Step 2: Account Activation
            </span>
            <h1 className="font-cinzel text-2xl md:text-3xl font-black text-white-text tracking-wider uppercase">
              Link Character
            </h1>
            <p className="font-inter text-xs text-secondary-text mt-2 leading-relaxed">
              We detected a first-time Discord sign-in. To enable automatic rank deliveries, please associate your Minecraft Character.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-inter leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Character Preview Avatar */}
            <div className="flex flex-col items-center justify-center py-2.5">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gold-accent bg-primary-bg p-0.5 shadow-xl shadow-gold-accent/15">
                {ign.trim().length >= 3 ? (
                  <img
                    src={`https://mc-heads.net/avatar/${ign.trim()}`}
                    alt="Character Head Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary-text/30 font-cinzel text-3xl font-bold select-none">
                    ?
                  </div>
                )}
              </div>
              <span className="font-inter text-[9px] text-secondary-text/50 uppercase tracking-widest mt-2 block">
                Avatar Preview
              </span>
            </div>

            {/* Minecraft Username Field */}
            <div className="space-y-1.5">
              <label className="font-inter text-[10px] font-bold text-secondary-text uppercase tracking-widest block">
                Minecraft Username (IGN)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text/50">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. ProGamer_99"
                  value={ign}
                  onChange={(e) => setIgn(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                  className="w-full bg-[#111217]/60 border border-border-custom focus:border-primary-accent/65 pl-10 pr-4 py-3 rounded-xl font-inter text-xs text-white-text placeholder-secondary-text/30 outline-none transition-all duration-300"
                />
              </div>
              <span className="font-inter text-[9px] text-secondary-text/60 leading-normal block">
                ⚠️ Make sure this matches your exact in-game spelling and capitalization.
              </span>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading || ign.trim().length < 3}
              className="w-full py-3.5 bg-primary-accent hover:bg-primary-accent/90 text-white-text font-inter font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Linking Character...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-gold-accent" />
                  Link & Complete Sign In
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
