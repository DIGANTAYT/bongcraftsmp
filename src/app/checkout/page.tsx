"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { 
  ShieldCheck, Copy, Check, MessageSquare, ArrowLeft, 
  HelpCircle, Sparkles, CheckCircle2, Loader2, Send
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import Script from "next/script";
import { audioSynth } from "@/lib/audio";

export default function CheckoutPage() {
  const { 
    cart, cartTotal, minecraftUsername, clearCart,
    couponCode, discountPercentage, discountAmount, rawTotal, applyCoupon, removeCoupon
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"summary" | "processing" | "success">("summary");
  const [orderId, setOrderId] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [receiptItems, setReceiptItems] = useState<any[]>([]);
  const [receiptTotal, setReceiptTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"automatic" | "manual">("automatic");
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  
  const upiId = "sarkardiganta04-2@oksbi";
  const activeIgn = minecraftUsername || "GuestPlayer";

  useEffect(() => {
    setOrderId("BC-" + Math.floor(100000 + Math.random() * 900000));
  }, []);

  const getCopyableText = () => {
    const itemsText = receiptItems.map(item => `  • ${item.name} (x${item.quantity})`).join("\n");
    return `🛒 **BongCraft SMP Store Order**\n- **Order ID:** ${orderId}\n- **Minecraft IGN:** ${activeIgn}\n- **UTR Reference:** ${utrNumber || "N/A"}\n- **Items:**\n${itemsText}\n- **Total Paid:** ₹${receiptTotal}`;
  };

  const handleCopyDetails = () => {
    const text = getCopyableText();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleRazorpayPayment = async () => {
    if (isRazorpayLoading) return;
    setIsRazorpayLoading(true);

    try {
      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal,
          receipt: orderId,
          ign: activeIgn,
          items: cart.map(item => ({ name: item.name, quantity: item.quantity }))
        })
      });

      const data = await res.json();

      if (res.status === 501) {
        // If not configured, automatically switch to manual UPI and notify the user
        alert("🔒 Razorpay is currently not configured on this server. Please use the Manual UPI payment option instead!");
        setPaymentMethod("manual");
        setIsRazorpayLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate Razorpay order");
      }

      // Open Razorpay Checkout Modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "BongCraft SMP Store",
        description: `Order Receipt: ${orderId}`,
        order_id: data.id,
        prefill: {
          name: activeIgn
        },
        theme: {
          color: "#7c3aed"
        },
        handler: async function (response: any) {
          setStep("processing");
          setReceiptItems([...cart]);
          setReceiptTotal(cartTotal);

          // Save order to database as completed
          if (isSupabaseConfigured) {
            try {
              await supabase.from("orders").insert([{
                user_id: user?.id || null,
                order_id: orderId,
                ign: activeIgn,
                items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
                total: cartTotal,
                status: "Completed" // automatically completed since payment verified!
              }]);
            } catch (err) {
              console.error("Failed to insert completed order:", err);
            }
          }

          // Trigger email notification to admin
          try {
            await fetch("/api/order-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                activeIgn: activeIgn,
                cartTotal,
                cart
              })
            });
          } catch (err) {
            console.error("Failed to send order email:", err);
          }

          setStep("success");
          audioSynth.playLevelUp(); // Synthesize Minecraft XP level-up chime!
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.5 }
          });
          clearCart();
        },
        modal: {
          ondismiss: function() {
            setIsRazorpayLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong initiating automatic checkout.");
      setIsRazorpayLoading(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      alert("Please enter a valid Transaction UTR / Ref Number.");
      return;
    }

    setStep("processing");
    setReceiptItems([...cart]);
    setReceiptTotal(cartTotal);

    // Format username to include UTR reference for visibility in Admin panel
    const formattedIgn = `${activeIgn} (UTR: ${utrNumber.trim()})`;

    const newOrder = {
      id: orderId,
      ign: formattedIgn,
      items: cart.map(item => `${item.name} (x${item.quantity})`),
      total: cartTotal,
      status: "Pending Verification" as const,
      timestamp: new Date().toLocaleString()
    };

    // 1. Save to Supabase (Unified orders table)
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("orders").insert([{
          user_id: user?.id || null,
          order_id: orderId,
          ign: formattedIgn,
          items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
          total: cartTotal,
          status: "Pending Verification"
        }]);

        if (error) {
          console.error("Failed to save order to Supabase:", error);
        }
      } catch (err) {
        console.error("Failed to insert order:", err);
      }
    } else {
      // Local fallback for static sandbox builds
      try {
        const existingOrders = JSON.parse(localStorage.getItem("bongcraft_orders") || "[]");
        localStorage.setItem("bongcraft_orders", JSON.stringify([newOrder, ...existingOrders]));
      } catch (e) {
        console.error("Failed to save order to localStorage:", e);
      }
    }

    try {
      const webhookUrl = localStorage.getItem("bongcraft_discord_webhook");
      if (webhookUrl && webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
        const payload = {
          content: null,
          embeds: [
            {
              title: "🛒 New Store Order Received (Manual UPI)",
              description: `A player has submitted an order receipt for verification.`,
              color: 16106001,
              fields: [
                { name: "Order ID", value: orderId, inline: true },
                { name: "Minecraft IGN", value: activeIgn, inline: true },
                { name: "UTR / Ref Number", value: utrNumber.trim(), inline: true },
                { name: "Total Paid", value: `₹${cartTotal}`, inline: true },
                { name: "Applied Coupon", value: couponCode || "None", inline: true },
                {
                  name: "Items Purchased",
                  value: cart.map(item => `- ${item.name} (x${item.quantity})`).join("\n")
                }
              ],
              footer: { text: "BongCraft SMP Shop Bot" },
              timestamp: new Date().toISOString()
            }
          ]
        };

        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      console.error("Webhook dispatch failed:", err);
    }

    // 3. Dispatch Email Notification to Admin
    try {
      await fetch("/api/order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          activeIgn: formattedIgn,
          cartTotal,
          cart
        })
      });
    } catch (err) {
      console.error("Email notification dispatch failed:", err);
    }

    // 4. Fire celebration and success screen
    setTimeout(() => {
      setStep("success");
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 }
      });
      clearCart();
      window.open("https://discord.gg/WzDAzMYwGX", "_blank");
    }, 1500);
  };

  // If cart is empty and not in success state
  if (cart.length === 0 && step !== "success") {
    return (
      <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
        <BackgroundParticles />
        <Navbar />
        <main className="flex-1 w-full relative z-10 pt-36 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto flex items-center justify-center">
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-border-custom max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-primary-accent/10 border border-primary-accent/20 rounded-full flex items-center justify-center text-primary-accent mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-cinzel text-lg font-bold text-white-text uppercase tracking-wider">Your Cart is Empty</h3>
              <p className="font-inter text-xs text-secondary-text leading-relaxed">
                Add ranks, coins, or keys to your cart to proceed with the checkout process.
              </p>
            </div>
            <Link
              href="/ranks"
              className="inline-block px-6 py-3.5 bg-primary-accent hover:bg-primary-accent/90 text-white-text font-bold uppercase text-[10px] tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Browse Shop Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Back Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border-custom/50">
            <Link 
              href="/ranks"
              className="flex items-center gap-2 text-xs text-secondary-text hover:text-white-text transition-colors uppercase tracking-wider font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </Link>
            <div className="text-right">
              <span className="text-[10px] text-primary-accent uppercase tracking-widest font-extrabold block">Checkout Order ID</span>
              <span className="text-sm text-white-text font-mono font-bold">{orderId}</span>
            </div>
          </div>

          {step === "summary" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form & QR Code (8 Columns) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Section header */}
                <div className="glass-panel p-6 rounded-3xl border border-border-custom space-y-5">
                  
                  {/* Delivery Username Summary */}
                  <div className="flex items-center gap-4 bg-secondary-bg/30 border border-border-custom/60 p-4 rounded-2xl">
                    <div className="relative w-14 h-20 rounded-xl overflow-hidden bg-[#09090B] border border-primary-accent/30 p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={`https://mc-heads.net/player/${activeIgn}`}
                        alt={activeIgn}
                        className="h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-inter text-[10px] text-primary-accent uppercase tracking-widest font-bold">
                        Target Username (IGN)
                      </div>
                      <h4 className="font-inter text-lg font-black text-white-text leading-tight mt-0.5 animate-pulse">
                        {activeIgn}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="font-inter text-[10px] text-secondary-text">
                          Delivery will be dispatched on play.bongcraftsmp.in
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div className="flex bg-[#09090B] p-1 border border-border-custom rounded-2xl gap-1">
                    <button
                      onClick={() => setPaymentMethod("automatic")}
                      className={`flex-1 py-3 text-center rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                        paymentMethod === "automatic"
                          ? "bg-primary-accent text-white-text shadow-lg shadow-primary-accent/15"
                          : "text-secondary-text hover:text-white-text"
                      }`}
                    >
                      ⚡ Instant Automatic Delivery
                    </button>
                    <button
                      onClick={() => setPaymentMethod("manual")}
                      className={`flex-1 py-3 text-center rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                        paymentMethod === "manual"
                          ? "bg-rose-500 text-white-text shadow-lg shadow-rose-500/15"
                          : "text-secondary-text hover:text-white-text"
                      }`}
                    >
                      ✉️ Manual UPI Claim (No fees)
                    </button>
                  </div>

                  {paymentMethod === "automatic" ? (
                    /* Automated Razorpay Checkout Card */
                    <div className="bg-secondary-bg/30 border border-border-custom p-6 rounded-2xl space-y-6 text-center">
                      <div className="w-14 h-14 bg-primary-accent/10 border border-primary-accent/20 rounded-full flex items-center justify-center text-primary-accent mx-auto">
                        <Sparkles className="w-6 h-6 text-gold-accent animate-pulse" />
                      </div>
                      <div className="space-y-1.5 max-w-sm mx-auto">
                        <h4 className="font-cinzel text-sm font-bold text-white-text uppercase tracking-wider">
                          Razorpay Secure Gateway
                        </h4>
                        <p className="font-inter text-[11px] text-secondary-text leading-relaxed">
                          Pay instantly via UPI (GPay, PhonePe, Paytm), NetBanking, or Cards. Ranks are delivered automatically in-game in less than 3 seconds!
                        </p>
                      </div>

                      <button
                        onClick={handleRazorpayPayment}
                        disabled={isRazorpayLoading}
                        className="w-full py-4 bg-gradient-to-r from-primary-accent to-purple-600 hover:from-primary-accent/90 hover:to-purple-600/90 text-white-text font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary-accent/15 disabled:opacity-50"
                      >
                        {isRazorpayLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirecting to Gateway...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Pay Automatically (₹{cartTotal})
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Manual UPI QR Code Block */
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* QR Code */}
                        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3.5">
                          <div className="relative w-44 h-44 bg-white p-3 rounded-2xl border-2 border-gold-accent shadow-lg shadow-gold-accent/15 overflow-hidden group/qr">
                            <div className="absolute inset-x-0 h-1 bg-gold-accent shadow-[0_0_12px_rgba(251,191,36,1)] animate-scan z-10" />
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                                `upi://pay?pa=${upiId}&pn=BongCraft%20SMP&am=${cartTotal}&cu=INR&tn=Order%20${orderId}`
                              )}`}
                              alt="Dynamic UPI QR Code Scanner"
                              className="object-contain w-full h-full relative z-1"
                            />
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-inter text-[10px] text-gold-accent font-extrabold uppercase tracking-widest text-center">
                              Amount: ₹{cartTotal}
                            </span>
                            <span className="font-inter text-[8px] text-secondary-text tracking-wide text-center">
                              Scan with PhonePe, GPay, or Paytm
                            </span>
                          </div>
                        </div>

                        {/* Instruction List & UPI Copy */}
                        <div className="md:col-span-7 space-y-4 font-inter">
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-secondary-text font-bold uppercase tracking-wider block">UPI VPA Address</span>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={upiId} 
                                readOnly 
                                className="flex-1 bg-[#09090B] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none text-xs font-mono"
                              />
                              <button
                                onClick={copyUpi}
                                className="px-4 py-2 bg-secondary-bg hover:bg-secondary-bg/80 border border-border-custom text-white-text hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1"
                              >
                                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedUpi ? "Copied" : "Copy"}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] text-primary-accent font-bold uppercase tracking-wider block">Claim Instructions:</span>
                            <ol className="text-[11px] text-secondary-text list-decimal list-inside space-y-1.5 leading-relaxed">
                              <li>Pay the amount above via any UPI scanner application.</li>
                              <li>Save the successful payment receipt page/screenshot.</li>
                              <li>Copy the UPI transaction reference ID / UTR number.</li>
                              <li>Input the UTR number in the form below and submit order!</li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      {/* Form Input for UTR Validation */}
                      <div className="glass-panel p-6 rounded-3xl border border-border-custom mt-6">
                        <form onSubmit={handleSubmitOrder} className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold uppercase tracking-wider text-white-text block">
                                Transaction Ref / UTR Number
                              </label>
                              <span className="text-[9px] text-secondary-text uppercase">12-Digit Transaction Reference</span>
                            </div>
                            <input
                              type="text"
                              required
                              value={utrNumber}
                              onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ""))}
                              maxLength={12}
                              placeholder="e.g. 123456789012"
                              className="w-full bg-[#09090B] border border-border-custom px-4 py-3.5 rounded-xl text-white-text outline-none text-sm font-mono tracking-wider focus:border-primary-accent"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-primary-accent to-purple-600 hover:from-primary-accent/90 hover:to-purple-600/90 text-white-text font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary-accent/15"
                          >
                            <Send className="w-4 h-4" />
                            Submit Order & Launch Discord Claim
                          </button>
                        </form>
                      </div>
                    </>
                  )}

                </div>

              </div>

              {/* Right Column: Order Summary & Seals (4 Columns) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Items Summary card */}
                <div className="glass-panel p-6 rounded-3xl border border-border-custom space-y-4">
                  <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider border-b border-border-custom/50 pb-3">
                    Order Summary
                  </h3>

                  <div className="divide-y divide-border-custom/50 max-h-[220px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="py-3 flex justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <span className="text-white-text font-bold block truncate max-w-[200px]">
                            {item.name}
                          </span>
                          <span className="text-secondary-text text-[10px] uppercase font-bold block mt-0.5">
                            {item.category} (x{item.quantity})
                          </span>
                        </div>
                        <span className="text-gold-accent font-cinzel font-semibold shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-border-custom" />

                  <div className="space-y-2.5 pt-1 text-xs">
                    <div className="flex justify-between text-secondary-text">
                      <span>Subtotal</span>
                      <span>₹{rawTotal.toLocaleString()}</span>
                    </div>
                    {discountPercentage > 0 && (
                      <div className="flex justify-between text-rose-500 font-bold">
                        <span>Discount ({discountPercentage}% Off)</span>
                        <span>- ₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-secondary-text">
                      <span>Taxes & Gateway Fees</span>
                      <span className="text-emerald-500 font-bold uppercase">FREE</span>
                    </div>
                    <div className="h-px bg-border-custom/30 my-2" />
                    <div className="flex justify-between font-cinzel font-bold text-sm text-white-text">
                      <span>TOTAL DUE</span>
                      <span className="text-gold-accent text-glow-gold text-base">
                        ₹{cartTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Application Box */}
                  <div className="h-px bg-border-custom/50 my-4" />
                  <div className="space-y-2">
                    <label className="text-[10px] text-secondary-text font-bold uppercase tracking-wider block">Have a Coupon Code?</label>
                    {couponCode ? (
                      <div className="flex items-center justify-between bg-primary-accent/10 border border-primary-accent/30 rounded-xl px-3 py-2.5 text-xs">
                        <span className="text-white-text font-bold">🎁 {couponCode} Applied (-{discountPercentage}%)</span>
                        <button 
                          onClick={removeCoupon} 
                          className="text-rose-500 hover:text-rose-400 font-bold uppercase text-[9px] cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. AKASH" 
                          id="couponInput"
                          className="flex-1 bg-[#09090B] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none text-xs font-mono uppercase tracking-wider"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = (e.target as HTMLInputElement).value;
                              if (applyCoupon(val)) {
                                audioSynth.playLevelUp(); // Synthesize XP sound!
                                (e.target as HTMLInputElement).value = "";
                              } else {
                                alert("Invalid coupon code! Try code: AKASH");
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById("couponInput") as HTMLInputElement;
                            if (input && applyCoupon(input.value)) {
                              audioSynth.playLevelUp(); // Synthesize XP sound!
                              input.value = "";
                            } else {
                              alert("Invalid coupon code! Try code: AKASH");
                            }
                          }}
                          className="px-4 py-2 bg-secondary-bg hover:bg-secondary-bg/80 border border-border-custom text-white rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust Seal */}
                <div className="glass-panel p-6 rounded-3xl border border-border-custom space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider">
                        Secure Verification
                      </h4>
                      <p className="font-inter text-[10px] text-secondary-text leading-tight mt-0.5">
                        100% Encrypted Manual Verification System.
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-border-custom/50" />
                  <p className="font-inter text-[10px] text-secondary-text/80 leading-relaxed">
                    By submitting your claim reference, our RCON console queue verifies your order logs directly against transactions. Staff will match your details inside your Discord claim ticket.
                  </p>
                </div>

              </div>

            </div>
          )}

          {step === "processing" && (
            <div className="glass-panel py-16 rounded-3xl border border-border-custom max-w-xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-primary-accent animate-spin" />
                <div className="absolute inset-0 bg-primary-accent/10 rounded-full filter blur-xl animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="font-cinzel text-lg font-bold text-white-text uppercase tracking-wider animate-pulse">
                  Verifying Transaction Details
                </h4>
                <p className="font-inter text-xs text-secondary-text max-w-xs mx-auto">
                  Saving order to database, dispatching webhooks, and preparing your Discord redirection...
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-[#09090B] border border-border-custom rounded-full text-[10px] text-secondary-text font-mono">
                <span>Ref: {orderId}</span>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="glass-panel py-12 px-6 md:px-12 rounded-3xl border border-border-custom max-w-2xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-500 glow-emerald animate-scale">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="absolute inset-0 bg-emerald-500/5 rounded-full filter blur-xl animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="font-inter text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest">
                  Order Registered Successfully
                </div>
                <h4 className="font-cinzel text-2xl md:text-3xl font-black text-white-text uppercase tracking-wide">
                  Complete Discord Ticket!
                </h4>
                <p className="font-inter text-xs text-secondary-text max-w-md mx-auto leading-relaxed">
                  We have launched Discord in a new tab. Paste your copied ticket info and upload your transaction screenshot to claim your perks!
                </p>
              </div>

              {/* Receipt Voucher Card */}
              <div className="w-full bg-[#111217]/90 border border-border-custom rounded-3xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-[#18181b] border-b border-border-custom/50 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider">
                      Official Store Receipt
                    </span>
                  </div>
                  <button
                    onClick={handleCopyDetails}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-accent/10 hover:bg-primary-accent/20 border border-primary-accent/30 text-primary-accent hover:text-white rounded-xl transition-colors text-[10px] font-inter font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Receipt Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Receipt Text
                      </>
                    )}
                  </button>
                </div>

                {/* Receipt Body */}
                <div className="p-6 space-y-6 font-inter text-xs text-left">
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-dashed border-border-custom/50">
                    <div>
                      <span className="text-secondary-text text-[9px] uppercase font-bold block">Order ID</span>
                      <span className="text-white-text font-bold font-mono">{orderId}</span>
                    </div>
                    <div>
                      <span className="text-secondary-text text-[9px] uppercase font-bold block">Target IGN</span>
                      <span className="text-white-text font-bold">{activeIgn}</span>
                    </div>
                    <div>
                      <span className="text-secondary-text text-[9px] uppercase font-bold block">UTR Reference</span>
                      <span className="text-white-text font-bold font-mono">{utrNumber || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-secondary-text text-[9px] uppercase font-bold block">Method</span>
                      <span className="text-emerald-400 font-bold uppercase">UPI QR Code</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <span className="text-secondary-text text-[9px] uppercase font-bold block">Purchased Items</span>
                    <div className="divide-y divide-border-custom/30">
                      {receiptItems.map((item) => (
                        <div key={item.id} className="py-2.5 flex justify-between gap-3">
                          <div>
                            <span className="text-white-text font-bold block">{item.name}</span>
                            <span className="text-secondary-text text-[9px] uppercase font-bold block mt-0.5">
                              {item.category} (x{item.quantity})
                            </span>
                          </div>
                          <span className="text-gold-accent font-cinzel font-semibold text-right">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="pt-4 border-t border-dashed border-border-custom/50 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest block">Payment Status</span>
                      <span className="text-[9px] text-secondary-text block mt-0.5">Pending Staff Verification</span>
                    </div>
                    <div className="text-right">
                      <span className="text-secondary-text text-[9px] uppercase font-bold block">Total Paid</span>
                      <span className="text-gold-accent text-glow-gold font-cinzel font-black text-lg">
                        ₹{receiptTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Claim Check-List */}
              <div className="w-full glass-panel p-5 rounded-2xl border border-border-custom/50 text-left space-y-3">
                <span className="font-inter text-[11px] font-bold text-primary-accent uppercase tracking-wider block">
                  Support Ticket Guidelines:
                </span>
                <ul className="font-inter text-xs text-secondary-text list-disc list-inside space-y-1.5 leading-relaxed">
                  <li>Upload your successful <strong className="text-white-text">UPI Payment Screenshot</strong>.</li>
                  <li>Click <strong className="text-white-text">"Copy Receipt Text"</strong> above and paste it in the channel.</li>
                  <li>Staff will match your UTR reference and run command delivery instantly!</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href="https://discord.gg/WzDAzMYwGX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white-text font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  Open Discord Link
                </a>
                <button
                  onClick={() => {
                    router.push("/ranks");
                  }}
                  className="flex-1 py-4 bg-secondary-bg hover:bg-secondary-bg/80 border border-border-custom text-white-text font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Return to Store
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  );
}
