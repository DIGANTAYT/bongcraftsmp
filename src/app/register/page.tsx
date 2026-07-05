"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { Mail, Lock, User, Loader2, UserPlus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { signUp, signInWithDiscord, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ign, setIgn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !user.needsProfileSetup) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (ign.trim().length === 0) {
      setError("Minecraft Username is required.");
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(email, password, ign.trim());
      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscordSignIn = async () => {
    setError(null);
    try {
      const { error: err } = await signInWithDiscord();
      if (err) setError(err.message);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 120, damping: 15 } 
    },
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
            <h1 className="font-cinzel text-2xl md:text-3xl font-black text-white-text tracking-wider uppercase">
              Register Account
            </h1>
            <p className="font-inter text-xs text-secondary-text mt-2">
              Create an account to keep track of your order logs, coins wallet, and server profiles.
            </p>
          </div>

          {/* Social Logins */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4 mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleDiscordSignIn}
              className="w-full py-3 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white font-inter font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(88,101,242,0.35)] cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.54,6.83,77.19,77.19,0,0,0,49.24,0,105.15,105.15,0,0,0,18.8,8.07C-3.41,40.83-1,72.9,9.58,88.42A105.65,105.65,0,0,0,41,96.36a77.7,77.7,0,0,0,8.66-14A68.69,68.69,0,0,1,38,76.58c1.1-.81,2.16-1.67,3.17-2.56a75.76,75.76,0,0,0,9.91,5.12c5.84,2.5,12.06,4.24,18.52,5.12a81.76,81.76,0,0,0,32-.14,75.46,75.46,0,0,0,18.28-5.1A72,72,0,0,0,119.82,74c1,1,2.06,1.86,3.17,2.56a68.69,68.69,0,0,1-11.64,5.78,77.7,77.7,0,0,0,8.66,14,105.65,105.65,0,0,0,31.42-7.94C128.84,72.9,131.25,40.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.88,46,53.88,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.12,46,96.12,53,91,65.69,84.69,65.69Z" />
              </svg>
              Register with Discord
            </motion.button>

            {/* OR Divider */}
            <div className="flex items-center gap-3">
              <span className="flex-1 h-[1px] bg-border-custom/50" />
              <span className="font-inter text-[9px] text-secondary-text/40 font-bold uppercase tracking-widest">
                or register with email
              </span>
              <span className="flex-1 h-[1px] bg-border-custom/50" />
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <motion.div 
                variants={itemVariants}
                className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-inter leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Minecraft IGN Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
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
                  onChange={(e) => setIgn(e.target.value)}
                  className="w-full bg-[#111217]/60 border border-border-custom focus:border-primary-accent/65 pl-10 pr-4 py-3 rounded-xl font-inter text-xs text-white-text placeholder-secondary-text/30 outline-none transition-all duration-300"
                />
              </div>
              <span className="font-inter text-[9px] text-secondary-text/60 leading-normal block">
                ⚠️ Enter your **exact** in-game name. Ranks are delivered based on this profile name.
              </span>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="font-inter text-[10px] font-bold text-secondary-text uppercase tracking-widest block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text/50">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111217]/60 border border-border-custom focus:border-primary-accent/65 pl-10 pr-4 py-3 rounded-xl font-inter text-xs text-white-text placeholder-secondary-text/30 outline-none transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="font-inter text-[10px] font-bold text-secondary-text uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111217]/60 border border-border-custom focus:border-primary-accent/65 pl-10 pr-4 py-3 rounded-xl font-inter text-xs text-white-text placeholder-secondary-text/30 outline-none transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-accent hover:bg-primary-accent/90 text-white-text font-inter font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs font-inter text-secondary-text">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-accent hover:text-gold-accent font-bold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
