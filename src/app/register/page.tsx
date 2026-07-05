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
  const { signUp, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ign, setIgn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
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
