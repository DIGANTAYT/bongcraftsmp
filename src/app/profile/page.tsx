"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Coins, History, Copy, Check, ExternalLink, Loader2, Sparkles, ShoppingBag } from "lucide-react";

interface ProfileOrderType {
  id: string;
  ign: string;
  items: any; // Can be string[] or object[]
  total: number;
  status: string;
  created_at?: string;
  timestamp?: string;
}

export default function ProfilePage() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState<ProfileOrderType[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Load orders history
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          
          const formattedOrders = (data || []).map((o: any) => ({
            id: o.order_id || o.id,
            ign: o.ign,
            items: o.items,
            total: o.total,
            status: o.status,
            created_at: o.created_at
          }));
          setOrders(formattedOrders);
        } catch (e) {
          console.error("Failed to load orders from Supabase:", e);
        }
      } else {
        // Fallback to localStorage orders matching current IGN
        try {
          const saved = JSON.parse(localStorage.getItem("bongcraft_orders") || "[]");
          const userOrders = saved.filter((o: any) => o.ign === profile?.minecraft_username);
          setOrders(userOrders);
        } catch (e) {
          console.error("Failed to parse local storage orders:", e);
        }
      }
      setLoadingOrders(false);
    };

    fetchOrders();
  }, [user, profile]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading || !user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-primary-bg">
        <BackgroundParticles />
        <div className="flex flex-col items-center gap-3 z-10 text-center">
          <Loader2 className="w-8 h-8 text-primary-accent animate-spin" />
          <p className="font-inter text-xs text-secondary-text">Loading profile session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-[1100px] mx-auto space-y-10">
          
          {/* Header */}
          <div className="text-center md:text-left">
            <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block mb-2">
              Customer Area
            </span>
            <h1 className="font-cinzel text-3xl md:text-5xl font-black text-white-text tracking-wider uppercase">
              Player Dashboard
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-accent to-gold-accent mt-4 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Left Side: Profile Details Card */}
            <div className="lg:col-span-4 w-full space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-3xl border border-border-custom relative overflow-hidden flex flex-col items-center text-center w-full"
              >
                {/* Backlight glow */}
                <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-primary-accent/10 filter blur-2xl -z-1" />
                <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-gold-accent/10 filter blur-2xl -z-1" />

                {/* Minecraft IGN avatar */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gold-accent bg-primary-bg p-0.5 shadow-xl shadow-gold-accent/10 mb-4 group">
                  <img
                    src={`https://mc-heads.net/avatar/${profile?.minecraft_username || "Steve"}`}
                    alt="Minecraft Head"
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h3 className="font-cinzel text-xl font-bold text-white-text tracking-wide mb-1">
                  {profile?.minecraft_username || "Steve"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider bg-gold-accent/10 text-gold-accent border border-gold-accent/25 mb-6">
                  Verified Character
                </span>

                <div className="w-full space-y-3.5 text-left border-t border-border-custom/50 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary-bg flex items-center justify-center text-secondary-text/80">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-inter text-[9px] text-secondary-text/50 font-bold uppercase block">
                        Email Address
                      </span>
                      <span className="font-inter text-xs text-white-text font-semibold block truncate" title={user.email}>
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary-bg flex items-center justify-center text-secondary-text/80">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-inter text-[9px] text-secondary-text/50 font-bold uppercase block">
                        Join Date
                      </span>
                      <span className="font-inter text-xs text-white-text font-semibold block">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "July 2026"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Purchase History */}
            <div className="lg:col-span-8 w-full space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 md:p-8 rounded-3xl border border-border-custom space-y-6 w-full"
              >
                <div className="flex items-center justify-between border-b border-border-custom pb-4">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-primary-accent" />
                    <h2 className="font-cinzel text-sm font-bold text-white-text tracking-wider uppercase">
                      Purchase History Log
                    </h2>
                  </div>
                  <span className="font-inter text-[10px] text-secondary-text font-bold bg-[#111217] border border-border-custom px-2.5 py-1 rounded-md">
                    Total Purchases: {orders.length}
                  </span>
                </div>

                {loadingOrders ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 text-primary-accent animate-spin" />
                    <p className="font-inter text-xs text-secondary-text">Querying transaction log...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center space-y-3.5 bg-primary-bg/20 rounded-2xl border border-dashed border-border-custom/50">
                    <ShoppingBag className="w-10 h-10 mx-auto text-secondary-text/30" />
                    <div className="space-y-1">
                      <p className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider">
                        No Purchases Found
                      </p>
                      <p className="font-inter text-xs text-secondary-text max-w-sm mx-auto leading-relaxed">
                        You have not placed any orders yet. Visit our store categories and add items to your cart to make your first purchase!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto pr-1">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border-custom text-[9px] font-bold text-secondary-text uppercase tracking-widest font-cinzel">
                          <th className="pb-3.5">Order ID</th>
                          <th className="pb-3.5">Date</th>
                          <th className="pb-3.5">Purchased Items</th>
                          <th className="pb-3.5 text-right">Amount</th>
                          <th className="pb-3.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-custom/40 font-inter text-xs">
                        {orders.map((order) => {
                          // Render items clean listing
                          let itemsList = "";
                          if (Array.isArray(order.items)) {
                            itemsList = order.items
                              .map((it: any) => typeof it === "object" ? `${it.name} (x${it.quantity})` : it)
                              .join(", ");
                          } else {
                            itemsList = String(order.items);
                          }

                          return (
                            <tr key={order.id} className="hover:bg-card-bg/20 transition-colors">
                              <td className="py-4 font-mono font-bold text-[10px] text-white-text">
                                <div className="flex items-center gap-1.5">
                                  <span className="select-all">{order.id}</span>
                                  <button
                                    onClick={() => copyToClipboard(order.id)}
                                    className="p-1 text-secondary-text/60 hover:text-white-text hover:bg-card-bg/60 rounded transition-colors cursor-pointer"
                                    title="Copy Order ID"
                                  >
                                    {copiedText === order.id ? (
                                      <Check className="w-3 h-3 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 text-secondary-text/80 text-[11px]">
                                {formatDate(order.created_at || order.timestamp)}
                              </td>
                              <td className="py-4 text-white-text/85 font-medium max-w-[200px] truncate" title={itemsList}>
                                {itemsList}
                              </td>
                              <td className="py-4 text-right font-bold text-gold-accent">
                                ₹{order.total}
                              </td>
                              <td className="py-4 text-center">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider border ${
                                    order.status === "Completed"
                                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                      : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                                  }`}
                                >
                                  {order.status === "Pending Verification" ? (
                                    <>
                                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                                      Pending
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-3 h-3" />
                                      Completed
                                    </>
                                  )}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
