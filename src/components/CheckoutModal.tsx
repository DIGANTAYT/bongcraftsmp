"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { X, ShieldCheck, CheckCircle2, Loader2, Sparkles, Copy, Check, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, minecraftUsername, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [step, setStep] = useState<"summary" | "processing" | "success">("summary");
  const [copied, setCopied] = useState(false);
  const [copiedDetails, setCopiedDetails] = useState(false);
  const [orderId, setOrderId] = useState("");

  const activeIgn = profile?.minecraft_username || minecraftUsername || "GuestPlayer";

  const getCopyableText = () => {
    const itemsText = cart.map(item => `  • ${item.name} (x${item.quantity})`).join("\n");
    return `🛒 **BongCraft SMP Store Order**\n- **Order ID:** ${orderId}\n- **Minecraft IGN:** ${activeIgn}\n- **Items:**\n${itemsText}\n- **Total Paid:** ₹${cartTotal}`;
  };

  const handleCopyDetails = () => {
    const text = getCopyableText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedDetails(true);
          setTimeout(() => setCopiedDetails(false), 2000);
        })
        .catch(err => {
          console.error("Clipboard copy failed:", err);
          fallbackCopyText(text);
        });
    } else {
      fallbackCopyText(text);
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedDetails(true);
      setTimeout(() => setCopiedDetails(false), 2000);
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
  };

  const upiId = "sarkardiganta04-2@oksbi";

  useEffect(() => {
    if (isOpen) {
      setStep("summary");
      setOrderId("BC-" + Math.floor(100000 + Math.random() * 900000));
    }
  }, [isOpen]);

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitClaim = () => {
    setStep("processing");
    
    // Create new order record
    const newOrder = {
      id: orderId,
      ign: activeIgn,
      items: cart.map(item => `${item.name} (x${item.quantity})`),
      total: cartTotal,
      status: "Pending Verification" as const,
      timestamp: new Date().toLocaleString()
    };
    
    // Save to database or local fallback
    if (isSupabaseConfigured && user) {
      supabase.from("orders").insert([{
        user_id: user.id,
        order_id: orderId,
        ign: activeIgn,
        items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
        total: cartTotal,
        status: "Pending Verification"
      }]).then((res: any) => {
        if (res.error) {
          console.error("Failed to save order to Supabase:", res.error);
        }
      });
    } else {
      try {
        const existingOrders = JSON.parse(localStorage.getItem("bongcraft_orders") || "[]");
        localStorage.setItem("bongcraft_orders", JSON.stringify([newOrder, ...existingOrders]));
      } catch (e) {
        console.error("Failed to save order to localStorage:", e);
      }
    }

    // Dispatch optional Discord Webhook notification if webhook is configured
    try {
      const webhookUrl = localStorage.getItem("bongcraft_discord_webhook");
      if (webhookUrl && webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "🟢 NEW STORE CLAIM SUBMITTED",
                color: 16507396, // gold accent
                fields: [
                  { name: "Minecraft IGN", value: activeIgn, inline: true },
                  { name: "Order ID", value: orderId, inline: true },
                  { name: "Grand Total", value: `₹${cartTotal}`, inline: true },
                  {
                    name: "Purchased Items",
                    value: cart.map(item => `• ${item.name} (x${item.quantity})`).join("\n")
                  }
                ],
                footer: {
                  text: "Verification Action: Match ID & verify UPI receipt in Discord ticket!"
                },
                timestamp: new Date().toISOString()
              }
            ]
          })
        }).catch(err => console.error("Webhook dispatch failed:", err));
      }
    } catch (err) {
      console.error(err);
    }

    // Dispatch Email Notification to Admin
    fetch("/api/order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        activeIgn,
        cartTotal,
        cart
      })
    }).catch(err => console.error("Email notification dispatch failed:", err));

    // Simulate short buffering check
    setTimeout(() => {
      setStep("success");
      // Fire confetti explosions
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      // Clear cart on success
      clearCart();
    }, 1500);

    // Open Discord ticket in a new tab
    window.open("https://discord.gg/WzDAzMYwGX", "_blank");
  };

  const handleCloseSuccess = () => {
    onClose();
    setStep("summary");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#09090B]/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-border-custom shadow-2xl overflow-hidden z-10 flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-border-custom flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-accent rounded-full animate-ping" />
            <h3 className="font-cinzel text-base md:text-lg font-bold text-white-text tracking-wider uppercase">
              UPI Checkout Portal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-secondary-text hover:text-white-text hover:bg-card-bg/60 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {isSupabaseConfigured && !user ? (
            <div className="text-center py-10 space-y-4">
              <span className="font-inter text-xs text-primary-accent font-extrabold uppercase tracking-widest block">
                Verification Required
              </span>
              <h4 className="font-cinzel text-lg font-bold text-white-text">
                Please Sign In to Checkout
              </h4>
              <p className="font-inter text-xs text-secondary-text max-w-sm mx-auto leading-relaxed">
                You must have an account linked to your Minecraft Username to complete this purchase and track order delivery.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="px-6 py-3 bg-primary-accent hover:bg-primary-accent/90 text-white-text font-inter font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="px-6 py-3 border border-border-custom hover:bg-card-bg text-secondary-text hover:text-white-text font-inter font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Register
                </Link>
              </div>
            </div>
          ) : step === "summary" && (
            <div className="space-y-6">
              
              {/* Delivery Account Summary */}
              <div className="flex items-center gap-4 bg-secondary-bg/60 border border-border-custom p-4 rounded-2xl">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-primary-bg border border-primary-accent/30 p-0.5 shrink-0">
                  <img
                    src={`https://mc-heads.net/avatar/${activeIgn}`}
                    alt={activeIgn}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-inter text-[10px] text-primary-accent uppercase tracking-widest font-semibold">
                    Target Username (IGN)
                  </div>
                  <h4 className="font-inter text-base font-bold text-white-text leading-tight">
                    {activeIgn}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="font-inter text-[10px] text-secondary-text">
                      Active receiver on play.bongcraftsmp.in
                    </span>
                  </div>
                </div>
              </div>

              {/* UPI & QR Code Manual Payment Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* QR Code Left Column */}
                <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3.5">
                  <div className="relative w-48 h-48 bg-white p-3 rounded-2xl border-2 border-gold-accent shadow-lg shadow-gold-accent/25 overflow-hidden group/qr">
                    {/* Glowing Laser Scanner Sweeper */}
                    <div className="absolute inset-x-0 h-1 bg-gold-accent shadow-[0_0_12px_rgba(251,191,36,1)] animate-scan z-10" />
                    
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                        `upi://pay?pa=${upiId}&pn=BongCraft%20SMP&am=${cartTotal}&cu=INR&tn=Order%20${orderId}`
                      )}`}
                      alt="Dynamic UPI QR Code Scanner"
                      width={192}
                      height={192}
                      className="object-contain w-full h-full relative z-1"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-inter text-[10px] text-gold-accent font-extrabold uppercase tracking-widest text-center block">
                      Amount locked: ₹{cartTotal}
                    </span>
                    <span className="font-inter text-[8px] text-secondary-text tracking-wide text-center block">
                      Scan with GPay, PhonePe, or Paytm
                    </span>
                  </div>
                </div>

                {/* Manual Pay Details Right Column */}
                <div className="md:col-span-7 space-y-4">
                  <div className="space-y-1.5">
                    <span className="font-inter text-[10px] text-secondary-text font-bold uppercase tracking-wider block">
                      Amount to Pay
                    </span>
                    <div className="font-cinzel text-3xl font-extrabold text-gold-accent text-glow-gold">
                      ₹{cartTotal.toLocaleString()}
                    </div>
                  </div>

                  {/* Rules Bullet Points */}
                  <div className="space-y-2">
                    <span className="font-inter text-[10px] text-primary-accent font-bold uppercase tracking-wider block">
                      Claim Instructions:
                    </span>
                    <ol className="font-inter text-[11px] text-secondary-text list-decimal list-inside space-y-1 leading-relaxed">
                      <li>Pay the total amount above using GPay, PhonePe, or Paytm.</li>
                      <li>Take a screenshot of the successful transaction page.</li>
                      <li>Click the button below to launch our Discord ticket helper.</li>
                      <li>Open a ticket and submit your screenshot + username to claim!</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="bg-secondary-bg/30 border border-border-custom rounded-2xl px-5 py-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-secondary-text uppercase tracking-wider font-bold">
                  <span>Item Summary</span>
                  <span>Amount</span>
                </div>
                <div className="h-px bg-border-custom" />
                <div className="max-h-[100px] overflow-y-auto space-y-1.5">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-white-text font-medium truncate max-w-[320px]">
                        {item.name} <span className="text-secondary-text text-[10px]">x{item.quantity}</span>
                      </span>
                      <span className="text-gold-accent font-cinzel font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleSubmitClaim}
                  className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white-text font-inter font-bold text-sm tracking-wider uppercase rounded-xl hover:shadow-[0_0_20px_rgba(88,101,242,0.35)] transition-all duration-300 cursor-pointer"
                >
                  <MessageSquare className="w-4.5 h-4.5 fill-current" />
                  Submit Claim on Discord
                </button>
                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="px-6 py-4 bg-primary-accent/10 hover:bg-primary-accent/20 border border-primary-accent/30 text-primary-accent hover:text-white flex items-center justify-center gap-2 font-inter font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer"
                >
                  {copiedDetails ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Details
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-secondary-text text-[10px] uppercase font-bold tracking-wider pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                100% Encrypted Manual Verification System
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-primary-accent animate-spin" />
                <div className="absolute inset-0 bg-primary-accent/10 rounded-full filter blur-xl animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="font-cinzel text-lg font-bold text-white-text uppercase tracking-wider">
                  Preparing Discord Redirect
                </h4>
                <p className="font-inter text-xs text-secondary-text max-w-sm">
                  Registering order reference and launching your browser...
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card-bg border border-border-custom rounded-full text-[10px] text-secondary-text font-mono">
                <span>Ref: {orderId}</span>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-500 glow-emerald">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="absolute inset-0 bg-emerald-500/5 rounded-full filter blur-xl animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="font-inter text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest">
                  Claim Request Created
                </div>
                <h4 className="font-cinzel text-2xl font-black text-white-text uppercase tracking-wide">
                  Submit Receipt Ticket!
                </h4>
                <p className="font-inter text-xs text-secondary-text max-w-md mt-1">
                  We have launched Discord in a new tab. Please open a billing support ticket and paste the details below.
                </p>
              </div>

              {/* Details card */}
              <div className="w-full bg-[#111217]/80 border border-border-custom rounded-2xl p-5 space-y-4 text-left">
                <div className="flex justify-between items-center pb-1 border-b border-border-custom/50">
                  <span className="font-inter text-[10px] font-bold text-primary-accent uppercase tracking-wider">
                    Order Verification Details
                  </span>
                  <button
                    onClick={handleCopyDetails}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-accent/10 hover:bg-primary-accent/20 border border-primary-accent/30 text-primary-accent hover:text-white rounded-lg transition-colors text-[10px] font-inter font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {copiedDetails ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Ticket Info
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 font-inter text-xs">
                  <div>
                    <span className="text-secondary-text block">Order Reference</span>
                    <span className="text-white-text font-bold font-mono">{orderId}</span>
                  </div>
                  <div>
                    <span className="text-secondary-text block">Minecraft IGN</span>
                    <span className="text-white-text font-bold">{activeIgn}</span>
                  </div>
                </div>

                <div className="h-px bg-border-custom" />

                <div className="space-y-2">
                  <span className="font-inter text-[11px] font-bold text-primary-accent uppercase tracking-wider block">
                    Discord Claim Steps:
                  </span>
                  <ul className="font-inter text-xs text-secondary-text list-disc list-inside space-y-1.5 leading-relaxed">
                    <li>Locate the ticket channel created for you on Discord.</li>
                    <li>Upload your <strong className="text-white-text">UPI Transaction Screenshot</strong>.</li>
                    <li>Click the copy button above and paste the details into your ticket!</li>
                    <li>A staff moderator will review the receipt and run delivery console commands instantly!</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleCloseSuccess}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white-text font-inter font-bold text-sm tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer"
              >
                Return to Store
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
