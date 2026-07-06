"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { Footer } from "@/components/Footer";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  Lock, LayoutDashboard, CheckSquare, Terminal, Settings, 
  TrendingUp, Clock, CheckCircle2, ShieldAlert, Copy, Check, LogOut,
  RefreshCw, Server, Trash2, Edit3, DollarSign, FileText
} from "lucide-react";
import { motion } from "framer-motion";

interface Order {
  id: string;
  ign: string;
  items: string[];
  total: number;
  status: "Pending Verification" | "Completed";
  timestamp: string;
}

interface AuditLog {
  time: string;
  action: string;
  type: "info" | "success" | "warning";
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "pricing" | "sandbox" | "system">("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // Audit Logs
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Prices Catalog State
  const [prices, setPrices] = useState({
    // Ranks
    knight: 99,
    lord: 399,
    paladin: 699,
    duke: 999,
    king: 1499,
    // Crates
    common_crate: 20,
    rare_crate: 30,
    epic_crate: 50,
    superior_crate: 75,
    // Coins
    coins500: 49,
    coins1200: 99,
    coins2500: 199,
    coins6000: 399,
    coins12000: 699
  });

  // Mock Console State
  const [consoleInput, setConsoleInput] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[System] BongCraft SMP Core console initialized.",
    "[System] Listening on port 25571 (UDP/TCP)...",
    "[RCON] Secure socket established with Vercel Web Gateway."
  ]);

  // Sandbox State
  const [sandboxIgn, setSandboxIgn] = useState("");
  const [sandboxType, setSandboxType] = useState<"rank" | "key" | "coins">("rank");
  const [sandboxItem, setSandboxItem] = useState("king");
  const [sandboxQty, setSandboxQty] = useState(1);
  const [webhookInput, setWebhookInput] = useState("");

  // RCON Config state
  const [rconHost, setRconHost] = useState("play.bongcraftsmp.in");
  const [rconPort, setRconPort] = useState("25575");
  const [rconPassword, setRconPassword] = useState("");
  const [rconEnabled, setRconEnabled] = useState(false);
  const [rconDeliveryLogs, setRconDeliveryLogs] = useState<string[]>([]);
  const [isRconLoading, setIsRconLoading] = useState(false);

  const loadGlobalConfig = async () => {
    try {
      const authHeader = "Basic " + btoa("admin:bongcraftadmin");
      const res = await fetch("/api/config/admin", {
        headers: { "Authorization": authHeader }
      });
      if (!res.ok) throw new Error("Failed to fetch admin config");
      const config = await res.json();

      if (config) {
        setMaintenanceMode(config.maintenanceMode ?? false);
        setWebhookInput(config.discordWebhook ?? "");
        
        if (config.prices) {
          setPrices(config.prices);
        }
        
        if (config.rcon) {
          setRconEnabled(config.rcon.enabled ?? false);
          setRconHost(config.rcon.host ?? "play.bongcraftsmp.in");
          setRconPort(config.rcon.port ?? "25575");
          setRconPassword(config.rcon.password ?? "");
        }
      }
    } catch (e) {
      console.error("Failed to load global config:", e);
    }
  };

  const saveFullConfig = async (updatedConfig: any) => {
    try {
      const authHeader = "Basic " + btoa("admin:bongcraftadmin");
      const res = await fetch("/api/config/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader
        },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configuration");
      addAuditLog("Global configuration synced to Supabase database", "success");
    } catch (e: any) {
      console.error("Failed to save config:", e);
      alert("Error saving configuration to database: " + e.message);
    }
  };

  useEffect(() => {
    // Check session auth
    const auth = sessionStorage.getItem("bongcraft_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    
    loadOrders();
    loadGlobalConfig();

    // Initialize audit logs
    const savedLogs = JSON.parse(sessionStorage.getItem("bongcraft_audit_logs") || "[]");
    if (savedLogs.length === 0) {
      const initialLogs: AuditLog[] = [
        { time: new Date().toLocaleTimeString(), action: "Admin Panel initialized", type: "info" }
      ];
      setLogs(initialLogs);
      sessionStorage.setItem("bongcraft_audit_logs", JSON.stringify(initialLogs));
    } else {
      setLogs(savedLogs);
    }
  }, []);

  const addAuditLog = (action: string, type: "info" | "success" | "warning") => {
    const newLog: AuditLog = {
      time: new Date().toLocaleTimeString(),
      action,
      type
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    sessionStorage.setItem("bongcraft_audit_logs", JSON.stringify(updated));
  };

  const loadOrders = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Map database schema to Order interface
        const mappedOrders: Order[] = data.map((o: any) => ({
          id: o.order_id,
          ign: o.ign,
          items: Array.isArray(o.items)
            ? o.items.map((item: any) => `${item.name} (x${item.quantity})`)
            : [],
          total: o.total,
          status: o.status,
          timestamp: new Date(o.created_at).toLocaleString()
        }));

        setOrders(mappedOrders);
      } catch (e) {
        console.error("Failed to load orders from Supabase:", e);
      }
    } else {
      try {
        const data = JSON.parse(localStorage.getItem("bongcraft_orders") || "[]");
        setOrders(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const loadPrices = () => {
    try {
      const savedPrices = localStorage.getItem("bongcraft_prices");
      if (savedPrices) {
        setPrices(JSON.parse(savedPrices));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "bongcraftadmin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("bongcraft_admin_auth", "true");
      setLoginError("");
      addAuditLog("Operator authenticated successfully", "success");
    } else {
      setLoginError("Access Denied: Invalid credentials. Verification failed.");
      addAuditLog(`Failed authentication attempt as '${username}'`, "warning");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("bongcraft_admin_auth");
    addAuditLog("Operator logged out of console session", "info");
  };

  const handleApprove = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setSelectedOrder(order);

    let rconLogOutput = "";
    let rconSuccess = true;

    if (rconEnabled && order.status === "Pending Verification") {
      const commands = getDeliveryCommands(order.ign, order.items);
      addAuditLog(`Attempting live RCON delivery for Order ${orderId}...`, "info");
      
      const results: string[] = [];
      for (const cmd of commands) {
        if (cmd.startsWith("#")) continue;
        try {
          const output = await executeRconCommand(cmd);
          results.push(`[Success] ${cmd}: ${output}`);
        } catch (err: any) {
          rconSuccess = false;
          results.push(`[Failed] ${cmd}: ${err.message}`);
        }
      }
      rconLogOutput = results.join("\n");
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .update({ status: "Completed" })
          .eq("order_id", orderId)
          .select();

        if (error) throw error;

        if (!data || data.length === 0) {
          alert(`Warning: The order was NOT updated. This is likely due to Supabase Row Level Security (RLS) policies blocking anonymous updates on the 'orders' table. Please check your Supabase dashboard and add a policy allowing updates.`);
          addAuditLog(`RLS policy blocked verification for Order ${orderId}`, "warning");
          return;
        }

        addAuditLog(`Order ${orderId} approved in database`, "success");
        if (rconEnabled) {
          if (rconSuccess) {
            alert(`Order Approved & Packages Delivered Live!\n\nRCON Output:\n${rconLogOutput}`);
            addAuditLog(`RCON Delivery completed for Order ${orderId}`, "success");
          } else {
            alert(`Order Approved, but live RCON delivery encountered issues:\n\n${rconLogOutput}\n\nPlease verify commands manually.`);
            addAuditLog(`RCON Delivery failed for some commands on Order ${orderId}`, "warning");
          }
        } else {
          alert(`Order ${orderId} has been successfully verified and marked as Completed!`);
        }
        loadOrders();
        setSelectedOrder(prev => prev ? { ...prev, status: "Completed" } : null);
      } catch (e: any) {
        console.error("Failed to approve order in Supabase:", e);
        alert(`Error verifying claim: ${e.message || JSON.stringify(e)}`);
      }
    } else {
      const updated = orders.map(o => {
        if (o.id === orderId) {
          const approvedOrder: Order = { ...o, status: "Completed" };
          setSelectedOrder(approvedOrder);
          addAuditLog(`Order ${orderId} verified and approved`, "success");
          if (rconEnabled) {
            if (rconSuccess) {
              alert(`Order Approved & Packages Delivered Live!\n\nRCON Output:\n${rconLogOutput}`);
            } else {
              alert(`Order Approved, but live RCON delivery encountered issues:\n\n${rconLogOutput}`);
            }
          } else {
            alert(`Order ${orderId} has been successfully verified and marked as Completed!`);
          }
          return approvedOrder;
        }
        return o;
      });
      setOrders(updated);
      localStorage.setItem("bongcraft_orders", JSON.stringify(updated));
    }
  };

  const handleDelete = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .delete()
            .eq("order_id", orderId)
            .select();

          if (error) throw error;

          if (!data || data.length === 0) {
            alert(`Warning: The order was NOT deleted. This is likely due to Supabase Row Level Security (RLS) policies blocking anonymous deletes on the 'orders' table. Please check your Supabase dashboard.`);
            return;
          }

          alert(`Order ${orderId} has been deleted successfully.`);
          addAuditLog(`Order ${orderId} deleted from database`, "warning");
          loadOrders();
          if (selectedOrder?.id === orderId) setSelectedOrder(null);
        } catch (e: any) {
          console.error("Failed to delete order in Supabase:", e);
          alert(`Failed to delete order from database: ${e.message || JSON.stringify(e)}`);
        }
      } else {
        const filtered = orders.filter(o => o.id !== orderId);
        setOrders(filtered);
        localStorage.setItem("bongcraft_orders", JSON.stringify(filtered));
        alert(`Order ${orderId} has been deleted successfully.`);
        addAuditLog(`Order log ${orderId} deleted from database`, "warning");
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
      }
    }
  };

  const handlePriceChange = async (key: keyof typeof prices, value: number) => {
    const updated = { ...prices, [key]: value };
    setPrices(updated);
    
    const fullConfig = {
      maintenanceMode,
      discordWebhook: webhookInput,
      prices: updated,
      rcon: { enabled: rconEnabled, host: rconHost, port: rconPort, password: rconPassword }
    };
    await saveFullConfig(fullConfig);
    addAuditLog(`Catalog pricing updated for ${key} to ₹${value}`, "info");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleToggleMaintenance = async (val: boolean) => {
    setMaintenanceMode(val);
    
    const fullConfig = {
      maintenanceMode: val,
      discordWebhook: webhookInput,
      prices,
      rcon: { enabled: rconEnabled, host: rconHost, port: rconPort, password: rconPassword }
    };
    await saveFullConfig(fullConfig);
    addAuditLog(`Maintenance mode toggled ${val ? "ON" : "OFF"}`, val ? "warning" : "success");
  };

  const handleSaveDiscordWebhook = async () => {
    const fullConfig = {
      maintenanceMode,
      discordWebhook: webhookInput,
      prices,
      rcon: { enabled: rconEnabled, host: rconHost, port: rconPort, password: rconPassword }
    };
    await saveFullConfig(fullConfig);
    alert("Discord Webhook saved successfully!");
    addAuditLog("Discord Webhook endpoint updated", "info");
  };

  const handleSaveRconSettings = async () => {
    const fullConfig = {
      maintenanceMode,
      discordWebhook: webhookInput,
      prices,
      rcon: { enabled: rconEnabled, host: rconHost, port: rconPort, password: rconPassword }
    };
    await saveFullConfig(fullConfig);
    alert("RCON configuration saved successfully!");
    addAuditLog("RCON server settings updated", "info");
  };

  const executeRconCommand = async (command: string): Promise<string> => {
    try {
      const authHeader = "Basic " + btoa("admin:bongcraftadmin");
      const res = await fetch("/api/rcon", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": authHeader
        },
        body: JSON.stringify({ command })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "RCON execution error");
      }
      return data.output || "Command executed successfully (no response output).";
    } catch (e: any) {
      throw new Error(e.message || "Failed to contact RCON gateway");
    }
  };

  const handleConsoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const cmd = consoleInput.trim();
    if (cmd === "clear") {
      setConsoleLogs([]);
      setConsoleInput("");
      return;
    }

    const newLogs = [...consoleLogs, `> ${cmd}`];
    setConsoleLogs(newLogs);
    setConsoleInput("");

    if (rconEnabled) {
      setConsoleLogs(prev => [...prev, `[RCON] Executing on server...`]);
      try {
        const output = await executeRconCommand(cmd);
        const splitOutput = output.split("\n").filter(Boolean);
        setConsoleLogs(prev => [...prev, ...splitOutput]);
        addAuditLog(`RCON Command executed: ${cmd.substring(0, 30)}`, "success");
      } catch (err: any) {
        setConsoleLogs(prev => [...prev, `[RCON Error] ${err.message}`]);
        addAuditLog(`RCON Command failed: ${cmd.substring(0, 30)}`, "warning");
      }
    } else {
      // Mock console response logic
      const mockLogs = [...newLogs];
      if (cmd.startsWith("/lp user") || cmd.startsWith("lp user")) {
        const parts = cmd.split(" ");
        const user = parts[cmd.startsWith("/") ? 2 : 1] || "Player";
        const rank = parts[parts.length - 1] || "default";
        mockLogs.push(`[LuckPerms] Promotion successful: Added parent group '${rank}' to player '${user}'.`);
      } else if (cmd.startsWith("/crazycrates") || cmd.startsWith("crazycrates")) {
        const parts = cmd.split(" ");
        const crate = parts[cmd.startsWith("/") ? 3 : 2] || "crate";
        const qty = parts[cmd.startsWith("/") ? 4 : 3] || "1";
        const user = parts[cmd.startsWith("/") ? 5 : 4] || "Player";
        mockLogs.push(`[CrazyCrates] Delivered ${qty}x physical ${crate} key(s) to inventory of ${user}.`);
      } else if (cmd.startsWith("/points give") || cmd.startsWith("points give")) {
        const parts = cmd.split(" ");
        const user = parts[cmd.startsWith("/") ? 2 : 1] || "Player";
        const qty = parts[cmd.startsWith("/") ? 3 : 2] || "500";
        mockLogs.push(`[PlayerPoints] Credited ${qty} points successfully to player account '${user}'.`);
      } else {
        mockLogs.push(`[Console (Mock Mode)] Command dispatched (enable RCON in config for live delivery).`);
      }
      setConsoleLogs(mockLogs);
      addAuditLog(`Mock Command executed: ${cmd.substring(0, 20)}...`, "info");
    }
  };

  // Minecraft command generator helper
  const getDeliveryCommands = (rawIgn: string, items: string[]) => {
    const ign = rawIgn.split(" ")[0];
    const commands: string[] = [];
    items.forEach(item => {
      const lower = item.toLowerCase();
      if (lower.includes("knight")) commands.push(`/lp user ${ign} parent add knight`);
      else if (lower.includes("lord")) commands.push(`/lp user ${ign} parent add lord`);
      else if (lower.includes("paladin")) commands.push(`/lp user ${ign} parent add paladin`);
      else if (lower.includes("duke")) commands.push(`/lp user ${ign} parent add duke`);
      else if (lower.includes("king")) commands.push(`/lp user ${ign} parent add king`);

      if (lower.includes("party")) {
        const qty = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "1");
        commands.push(`/crazycrates give physical party ${qty} ${ign}`);
      }
      else if (lower.includes("spawner")) {
        const qty = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "1");
        commands.push(`/crazycrates give physical spawner ${qty} ${ign}`);
      }
      else if (lower.includes("rare")) {
        const qty = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "1");
        commands.push(`/crazycrates give physical rare ${qty} ${ign}`);
      }
      else if (lower.includes("epic")) {
        const qty = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "1");
        commands.push(`/crazycrates give physical epic ${qty} ${ign}`);
      }

      if (lower.includes("coin")) {
        const qtyStr = lower.replace(/[^0-9]/g, "");
        const qty = qtyStr ? parseInt(qtyStr) : 500;
        commands.push(`/points give ${ign} ${qty}`);
      }
    });
    return commands.length > 0 ? commands : [`# No commands found`];
  };

  // Dashboard Stats
  const pendingOrders = orders.filter(o => o.status === "Pending Verification");
  const completedOrders = orders.filter(o => o.status === "Completed");
  const grossRevenue = completedOrders.reduce((acc, curr) => acc + curr.total, 0);

  const getSandboxCommand = () => {
    if (!sandboxIgn) return "# Enter player username (IGN)";
    if (sandboxType === "rank") {
      return `/lp user ${sandboxIgn} parent add ${sandboxItem}`;
    } else if (sandboxType === "key") {
      return `/crazycrates give physical ${sandboxItem} ${sandboxQty} ${sandboxIgn}`;
    } else {
      return `/points give ${sandboxIgn} ${sandboxItem}`;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      <BackgroundParticles />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          
          {/* SECURED LOGIN GATE */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-16">
              <div className="glass-panel p-8 rounded-[32px] border border-border-custom shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary-accent/10 border border-primary-accent/40 rounded-2xl flex items-center justify-center text-primary-accent mx-auto">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <h2 className="font-cinzel text-xl font-bold text-white-text uppercase tracking-wider">
                    Staff Portal Auth
                  </h2>
                  <p className="font-inter text-xs text-secondary-text">
                    Access restricted. Enter console operator credentials to proceed.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 font-inter text-sm">
                  <div className="space-y-1.5">
                    <label className="text-xs text-secondary-text font-bold uppercase tracking-wider">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter operator username"
                      required
                      className="w-full bg-[#111217] border border-border-custom px-4 py-3 rounded-xl text-white-text focus:border-primary-accent/60 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-secondary-text font-bold uppercase tracking-wider">Security Key</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-[#111217] border border-border-custom px-4 py-3 rounded-xl text-white-text focus:border-primary-accent/60 outline-none transition-colors"
                    />
                  </div>

                  {loginError && (
                    <div className="text-xs text-rose-500 font-bold bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl text-center">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-primary-accent hover:bg-primary-accent/90 text-white-text font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    Authenticate Console
                  </button>
                </form>
              </div>
            </div>
          ) : (
            
            /* SECURE PANEL CONTENT */
            <div className="space-y-8 animate-scale">
              
              {/* Header Info */}
              <div className="glass-panel p-6 rounded-3xl border border-border-custom flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <div>
                    <h1 className="font-cinzel text-lg font-bold text-white-text tracking-wide uppercase leading-tight">
                      BongCraft Admin Console
                    </h1>
                    <span className="font-inter text-[10px] text-secondary-text">
                      Operator Session Active • Live commands enabled
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={loadOrders}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-border-custom hover:border-white/20 bg-card-bg/40 text-secondary-text hover:text-white-text text-xs font-bold rounded-xl transition-all cursor-pointer grow md:grow-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Sync Data
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-rose-500/30 hover:bg-rose-500/10 text-rose-500 hover:text-rose-400 text-xs font-bold rounded-xl transition-all cursor-pointer grow md:grow-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-border-custom flex items-center gap-4 relative overflow-hidden group">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-inter text-[10px] text-secondary-text uppercase tracking-widest font-bold block">Gross Revenue</span>
                    <span className="font-cinzel text-2xl font-black text-gold-accent text-glow-gold">₹{grossRevenue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-border-custom flex items-center gap-4 relative overflow-hidden group">
                  <div className="w-12 h-12 bg-primary-accent/10 border border-primary-accent/30 rounded-2xl flex items-center justify-center text-primary-accent shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-inter text-[10px] text-secondary-text uppercase tracking-widest font-bold block">Pending claims</span>
                    <span className="font-cinzel text-2xl font-black text-white-text">{pendingOrders.length} Claims</span>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-border-custom flex items-center gap-4 relative overflow-hidden group">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-inter text-[10px] text-secondary-text uppercase tracking-widest font-bold block">Verified orders</span>
                    <span className="font-cinzel text-2xl font-black text-emerald-500">{completedOrders.length} Processed</span>
                  </div>
                </div>
              </div>

              {/* Main Work Area Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-3">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`relative w-full flex items-center gap-3 px-5 py-4.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      activeTab === "dashboard"
                        ? "border-primary-accent text-primary-accent font-bold"
                        : "border-border-custom text-secondary-text hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {activeTab === "dashboard" && (
                      <motion.span
                        layoutId="activeAdminTabBackground"
                        className="absolute inset-0 bg-primary-accent/10 rounded-2xl -z-1"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-3 w-full">
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="font-inter text-xs uppercase tracking-wider font-semibold">Console Overview</span>
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`relative w-full flex items-center gap-3 px-5 py-4.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      activeTab === "orders"
                        ? "border-primary-accent text-primary-accent font-bold"
                        : "border-border-custom text-secondary-text hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {activeTab === "orders" && (
                      <motion.span
                        layoutId="activeAdminTabBackground"
                        className="absolute inset-0 bg-primary-accent/10 rounded-2xl -z-1"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-3 w-full">
                      <CheckSquare className="w-4 h-4" />
                      <span className="font-inter text-xs uppercase tracking-wider font-semibold">Verify Claims</span>
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("pricing")}
                    className={`relative w-full flex items-center gap-3 px-5 py-4.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      activeTab === "pricing"
                        ? "border-primary-accent text-primary-accent font-bold"
                        : "border-border-custom text-secondary-text hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {activeTab === "pricing" && (
                      <motion.span
                        layoutId="activeAdminTabBackground"
                        className="absolute inset-0 bg-primary-accent/10 rounded-2xl -z-1"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-3 w-full">
                      <Edit3 className="w-4 h-4" />
                      <span className="font-inter text-xs uppercase tracking-wider font-semibold">Catalog Pricing</span>
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("sandbox")}
                    className={`relative w-full flex items-center gap-3 px-5 py-4.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      activeTab === "sandbox"
                        ? "border-primary-accent text-primary-accent font-bold"
                        : "border-border-custom text-secondary-text hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {activeTab === "sandbox" && (
                      <motion.span
                        layoutId="activeAdminTabBackground"
                        className="absolute inset-0 bg-primary-accent/10 rounded-2xl -z-1"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-3 w-full">
                      <Terminal className="w-4 h-4" />
                      <span className="font-inter text-xs uppercase tracking-wider font-semibold">Command Console</span>
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("system")}
                    className={`relative w-full flex items-center gap-3 px-5 py-4.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      activeTab === "system"
                        ? "border-primary-accent text-primary-accent font-bold"
                        : "border-border-custom text-secondary-text hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {activeTab === "system" && (
                      <motion.span
                        layoutId="activeAdminTabBackground"
                        className="absolute inset-0 bg-primary-accent/10 rounded-2xl -z-1"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-3 w-full">
                      <Settings className="w-4 h-4" />
                      <span className="font-inter text-xs uppercase tracking-wider font-semibold">System Settings</span>
                    </span>
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="lg:col-span-9 space-y-6">
                  
                  {/* TAB 1: DASHBOARD OVERVIEW */}
                  {activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Left: General info */}
                      <div className="md:col-span-7 glass-panel p-6 md:p-8 rounded-3xl border border-border-custom space-y-6">
                        <h2 className="font-cinzel text-lg font-bold text-white-text uppercase tracking-wider border-b border-border-custom pb-4">
                          Console Info
                        </h2>
                        <div className="space-y-4 font-inter text-sm text-secondary-text leading-relaxed">
                          <p>
                            Verify players transactions by validating their **Discord Ticket payment screenshots** first, then copy the console commands generated by this verification panel to update their packages in-game.
                          </p>
                          <p>
                            Use the **Catalog Pricing** tab to edit package costs. Changes are synced with browser local caches, updating store items instantly for players.
                          </p>
                        </div>

                        <div className="bg-secondary-bg/50 border border-border-custom p-5 rounded-2xl space-y-3.5">
                          <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider flex items-center gap-2">
                            <Server className="w-4 h-4 text-primary-accent" />
                            System Health Indicators
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                            <div className="bg-[#09090B] p-3 rounded-xl border border-border-custom">
                              <span className="text-secondary-text block mb-1">Web Server</span>
                              <span className="text-emerald-500 font-bold">ONLINE</span>
                            </div>
                            <div className="bg-[#09090B] p-3 rounded-xl border border-border-custom">
                              <span className="text-secondary-text block mb-1">Minecraft Ping</span>
                              <span className="text-emerald-500 font-bold">20.0 TPS</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Audit logs */}
                      <div className="md:col-span-5 glass-panel p-6 rounded-3xl border border-border-custom flex flex-col h-full max-h-[380px]">
                        <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider border-b border-border-custom pb-3 flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-gold-accent" />
                          Action Audit Logs
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 font-mono text-[10px] scrollbar-thin">
                          {logs.map((log, i) => (
                            <div key={i} className="flex gap-2 items-start border-b border-border-custom/30 pb-2">
                              <span className="text-secondary-text/60 shrink-0">{log.time}</span>
                              <span className={`grow ${
                                log.type === "success" ? "text-emerald-500" :
                                log.type === "warning" ? "text-amber-500" : "text-cyan-400"
                              }`}>
                                {log.action}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: VERIFY CLAIMS */}
                  {activeTab === "orders" && (
                    <div className="space-y-6">
                      <div className="glass-panel p-6 rounded-3xl border border-border-custom space-y-4">
                        <h2 className="font-cinzel text-lg font-bold text-white-text uppercase tracking-wider border-b border-border-custom pb-4 flex justify-between items-center">
                          <span>Verification Queue</span>
                          <span className="bg-primary-accent/15 border border-primary-accent/30 text-primary-accent font-inter text-[10px] font-bold px-2.5 py-1 rounded-full">
                            {orders.length} Claims Total
                          </span>
                        </h2>

                        {orders.length === 0 ? (
                          <div className="py-12 text-center text-secondary-text space-y-2">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500/30 mx-auto" />
                            <h4 className="font-inter text-sm font-bold text-white-text uppercase tracking-wider">Queue Clear</h4>
                            <p className="font-inter text-xs text-secondary-text">No player claim tickets logged. Try checking out items in the store!</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left font-inter text-xs">
                              <thead>
                                <tr className="border-b border-border-custom text-secondary-text uppercase font-bold">
                                  <th className="pb-3 px-2">Order ID</th>
                                  <th className="pb-3">IGN Username</th>
                                  <th className="pb-3">Grand Total</th>
                                  <th className="pb-3">Status</th>
                                  <th className="pb-3">Timestamp</th>
                                  <th className="pb-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border-custom/50">
                                {orders.map((order) => (
                                  <tr 
                                    key={order.id} 
                                    onClick={() => setSelectedOrder(order)}
                                    className={`hover:bg-card-bg/20 transition-colors cursor-pointer ${
                                      selectedOrder?.id === order.id ? "bg-card-bg/40 border-l-2 border-primary-accent" : ""
                                    }`}
                                  >
                                    <td className="py-3 px-2 font-mono font-bold text-white-text">{order.id}</td>
                                    <td className="py-3 font-semibold text-white-text flex items-center gap-2">
                                      <img
                                        src={`https://mc-heads.net/avatar/${order.ign}`}
                                        alt={order.ign}
                                        className="w-5 h-5 rounded bg-primary-bg"
                                      />
                                      {order.ign}
                                    </td>
                                    <td className="py-3 font-cinzel font-bold text-gold-accent">₹{order.total}</td>
                                    <td className="py-3">
                                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                        order.status === "Pending Verification"
                                          ? "bg-amber-500/10 border-amber-500/35 text-amber-500"
                                          : "bg-emerald-500/10 border-emerald-500/35 text-emerald-500"
                                      }`}>
                                        {order.status}
                                      </span>
                                    </td>
                                    <td className="py-3 text-secondary-text">{order.timestamp}</td>
                                    <td className="py-3 text-right space-x-1">
                                      {order.status === "Pending Verification" && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApprove(order.id);
                                          }}
                                          className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white-text font-bold uppercase text-[9px] rounded-lg cursor-pointer transition-colors"
                                        >
                                          Verify
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(order.id);
                                        }}
                                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-lg cursor-pointer transition-colors inline-flex items-center"
                                        title="Delete order logs"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Display Delivery Commands Drawer when selected */}
                      {selectedOrder && (
                        <div className="glass-panel p-6 rounded-3xl border border-border-custom bg-emerald-500/5 border-emerald-500/20 space-y-4 animate-scale">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-cinzel text-sm font-bold text-emerald-500 uppercase tracking-wider">
                                Order Claims Verified!
                              </h3>
                              <span className="font-inter text-[10px] text-secondary-text">
                                Logged Reference: {selectedOrder.id} • IGN: {selectedOrder.ign}
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedOrder(null)}
                              className="text-xs text-secondary-text hover:text-white cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </div>

                          <div className="bg-[#09090B] border border-border-custom rounded-2xl p-4.5 space-y-3 font-mono text-xs">
                            <span className="text-secondary-text text-[10px] uppercase font-bold block mb-1">
                              Server Console Commands to Execute:
                            </span>
                            <div className="space-y-2">
                              {getDeliveryCommands(selectedOrder.ign, selectedOrder.items).map((cmd, i) => (
                                <div key={i} className="flex justify-between items-center gap-4 bg-[#111217] p-2.5 px-3.5 rounded-xl border border-border-custom">
                                  <span className="text-white-text select-all">{cmd}</span>
                                  <button
                                    onClick={() => copyToClipboard(cmd)}
                                    className="p-1 text-secondary-text hover:text-gold-accent cursor-pointer transition-colors"
                                    title="Copy Command to Clipboard"
                                  >
                                    {copiedText === cmd ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: CATALOG PRICING */}
                  {activeTab === "pricing" && (
                    <div className="glass-panel p-6 md:p-8 rounded-3xl border border-border-custom space-y-6">
                      <h2 className="font-cinzel text-lg font-bold text-white-text uppercase tracking-wider border-b border-border-custom pb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gold-accent text-glow-gold" />
                        Store Catalog Price Manager
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-inter text-xs text-secondary-text">
                        
                        {/* Ranks Prices */}
                        <div className="bg-[#111217] border border-border-custom p-5 rounded-2xl space-y-4">
                          <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider border-b border-border-custom pb-2">
                            Ranks Catalog (₹)
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center gap-2">
                              <span>Knight Rank</span>
                              <input
                                type="number"
                                value={prices.knight}
                                onChange={(e) => handlePriceChange("knight", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>Lord Rank</span>
                              <input
                                type="number"
                                value={prices.lord}
                                onChange={(e) => handlePriceChange("lord", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>Paladin Rank</span>
                              <input
                                type="number"
                                value={prices.paladin}
                                onChange={(e) => handlePriceChange("paladin", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>Duke Rank</span>
                              <input
                                type="number"
                                value={prices.duke}
                                onChange={(e) => handlePriceChange("duke", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>King Rank</span>
                              <input
                                type="number"
                                value={prices.king}
                                onChange={(e) => handlePriceChange("king", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Keys Prices */}
                        <div className="bg-[#111217] border border-border-custom p-5 rounded-2xl space-y-4">
                          <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider border-b border-border-custom pb-2">
                            Crate Keys Catalog (₹)
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center gap-2">
                              <span>Common Key</span>
                              <input
                                type="number"
                                value={prices.common_crate}
                                onChange={(e) => handlePriceChange("common_crate", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>Rare Key</span>
                              <input
                                type="number"
                                value={prices.rare_crate}
                                onChange={(e) => handlePriceChange("rare_crate", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>Epic Key</span>
                              <input
                                type="number"
                                value={prices.epic_crate}
                                onChange={(e) => handlePriceChange("epic_crate", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>Superior Key</span>
                              <input
                                type="number"
                                value={prices.superior_crate}
                                onChange={(e) => handlePriceChange("superior_crate", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Coins Prices */}
                        <div className="bg-[#111217] border border-border-custom p-5 rounded-2xl space-y-4">
                          <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider border-b border-border-custom pb-2">
                            Server Coins Catalog (₹)
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center gap-2">
                              <span>500 Coins</span>
                              <input
                                type="number"
                                value={prices.coins500}
                                onChange={(e) => handlePriceChange("coins500", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>1,200 Coins</span>
                              <input
                                type="number"
                                value={prices.coins1200}
                                onChange={(e) => handlePriceChange("coins1200", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>2,500 Coins</span>
                              <input
                                type="number"
                                value={prices.coins2500}
                                onChange={(e) => handlePriceChange("coins2500", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>6,000 Coins</span>
                              <input
                                type="number"
                                value={prices.coins6000}
                                onChange={(e) => handlePriceChange("coins6000", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span>12,000 Coins</span>
                              <input
                                type="number"
                                value={prices.coins12000}
                                onChange={(e) => handlePriceChange("coins12000", parseInt(e.target.value) || 0)}
                                className="w-20 bg-[#09090B] border border-border-custom p-1.5 rounded text-white-text text-right"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* TAB 4: MOCK SERVER CONSOLE & SANDBOX */}
                  {activeTab === "sandbox" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Console CLI Terminal */}
                      <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-border-custom flex flex-col h-[400px]">
                        <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider border-b border-border-custom pb-3 flex items-center gap-2 mb-3">
                          <Terminal className="w-4 h-4 text-emerald-500" />
                          Minecraft Server Core RCON CLI
                        </h3>
                        
                        {/* Terminal Logs Box */}
                        <div className="flex-1 bg-[#09090B] border border-border-custom rounded-xl p-4 font-mono text-[10px] text-white-text overflow-y-auto space-y-2 select-all scrollbar-thin">
                          {consoleLogs.map((log, i) => (
                            <div key={i} className="leading-relaxed break-all">
                              {log}
                            </div>
                          ))}
                        </div>

                        {/* Terminal Input prompt */}
                        <form onSubmit={handleConsoleSubmit} className="flex gap-2 mt-3.5">
                          <span className="font-mono text-emerald-500 text-xs self-center select-none font-bold">&gt;</span>
                          <input
                            type="text"
                            value={consoleInput}
                            onChange={(e) => setConsoleInput(e.target.value)}
                            placeholder="Enter LuckPerms or Crates command..."
                            className="flex-1 bg-[#111217] border border-border-custom px-3 py-2 rounded-xl text-white-text focus:border-emerald-500/60 outline-none transition-colors font-mono text-[11px]"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white-text font-inter font-bold text-[10px] uppercase rounded-xl cursor-pointer transition-colors"
                          >
                            Send
                          </button>
                        </form>
                      </div>

                      {/* Right: Sandbox Generator */}
                      <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-border-custom space-y-5 flex flex-col justify-between">
                        <div className="space-y-4">
                          <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider border-b border-border-custom pb-2">
                            Manual Command Builder
                          </h3>

                          <div className="space-y-3 font-inter text-xs text-secondary-text">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider">Player IGN</label>
                              <input
                                type="text"
                                value={sandboxIgn}
                                onChange={(e) => setSandboxIgn(e.target.value)}
                                placeholder="IGN Username"
                                className="w-full bg-[#111217] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none focus:border-primary-accent/60"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider">Category</label>
                              <select
                                value={sandboxType}
                                onChange={(e) => setSandboxType(e.target.value as any)}
                                className="w-full bg-[#111217] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none"
                              >
                                <option value="rank">Rank Group (LP)</option>
                                <option value="key">Crate Key (CrazyCrates)</option>
                                <option value="coins">Coins (PlayerPoints)</option>
                              </select>
                            </div>

                            {sandboxType === "rank" && (
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider">Select Rank</label>
                                <select
                                  value={sandboxItem}
                                  onChange={(e) => setSandboxItem(e.target.value)}
                                  className="w-full bg-[#111217] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none"
                                >
                                  <option value="knight">Knight</option>
                                  <option value="lord">Lord</option>
                                  <option value="paladin">Paladin</option>
                                  <option value="duke">Duke</option>
                                  <option value="king">King</option>
                                </select>
                              </div>
                            )}

                            {sandboxType === "key" && (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider">Key Type</label>
                                  <select
                                    value={sandboxItem}
                                    onChange={(e) => setSandboxItem(e.target.value)}
                                    className="w-full bg-[#111217] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none"
                                  >
                                    <option value="party">Party Key</option>
                                    <option value="spawner">Spawner Key</option>
                                    <option value="rare">Rare Key</option>
                                    <option value="epic">Epic Key</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider">Quantity</label>
                                  <input
                                    type="number"
                                    min={1}
                                    max={64}
                                    value={sandboxQty}
                                    onChange={(e) => setSandboxQty(parseInt(e.target.value) || 1)}
                                    className="w-full bg-[#111217] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none"
                                  />
                                </div>
                              </div>
                            )}

                            {sandboxType === "coins" && (
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider">Coins Amount</label>
                                <select
                                  value={sandboxItem}
                                  onChange={(e) => setSandboxItem(e.target.value)}
                                  className="w-full bg-[#111217] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none"
                                >
                                  <option value="500">500 Coins</option>
                                  <option value="1200">1,200 Coins</option>
                                  <option value="2500">2,500 Coins</option>
                                  <option value="6000">6,000 Coins</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Generated Builder string */}
                        <div className="bg-[#09090B] border border-border-custom rounded-xl p-3.5 space-y-2 font-mono text-[10px]">
                          <span className="text-secondary-text text-[9px] uppercase font-bold block mb-1">Generated Output:</span>
                          <div className="flex justify-between items-center gap-2 bg-[#111217] p-2 rounded border border-border-custom">
                            <span className="text-white-text select-all">{getSandboxCommand()}</span>
                            <button
                              onClick={() => copyToClipboard(getSandboxCommand())}
                              disabled={!sandboxIgn}
                              className="p-1 text-secondary-text hover:text-gold-accent disabled:opacity-40 disabled:hover:text-secondary-text cursor-pointer transition-colors"
                            >
                              {copiedText === getSandboxCommand() ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 5: SYSTEM SETTINGS */}
                  {activeTab === "system" && (
                    <div className="glass-panel p-6 md:p-8 rounded-3xl border border-border-custom space-y-6">
                      <h2 className="font-cinzel text-lg font-bold text-white-text uppercase tracking-wider border-b border-border-custom pb-4">
                        Web Setting Overrides
                      </h2>

                      <div className="space-y-6 font-inter text-sm">
                        {/* Maintenance Toggle */}
                        <div className="flex items-center justify-between gap-4 bg-secondary-bg/50 p-5 rounded-2xl border border-border-custom">
                          <div className="space-y-1">
                            <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 text-amber-500" />
                              Storefront Maintenance Banner
                            </h3>
                            <p className="text-xs text-secondary-text">
                              Display a status warning at the top of all pages alerting players of server backend maintenance.
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggleMaintenance(!maintenanceMode)}
                            className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 border cursor-pointer ${
                              maintenanceMode
                                ? "bg-amber-500 border-amber-600 justify-end"
                                : "bg-[#111217] border-border-custom justify-start"
                            }`}
                          >
                            <span className="w-5.5 h-5.5 rounded-full bg-white shadow-md block transition-transform" />
                          </button>
                        </div>

                        {/* Discord Webhook configuration */}
                        <div className="bg-secondary-bg/50 p-5 rounded-2xl border border-border-custom space-y-4">
                          <div className="space-y-1">
                            <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider flex items-center gap-2">
                              <span className="w-2 h-2 bg-[#5865F2] rounded-full" />
                              Discord Webhook Logging
                            </h3>
                            <p className="text-xs text-secondary-text">
                              Input your private Discord channel Webhook URL to receive instant push notification logs when players submit store checkout orders.
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="password"
                              value={webhookInput}
                              onChange={(e) => setWebhookInput(e.target.value)}
                              placeholder="https://discord.com/api/webhooks/..."
                              className="flex-1 bg-[#09090B] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none text-xs focus:border-primary-accent/60"
                            />
                            <button
                              onClick={handleSaveDiscordWebhook}
                              className="px-4 py-2 bg-primary-accent hover:bg-primary-accent/90 text-white-text font-bold uppercase text-[10px] rounded-xl cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        </div>


                        {/* RCON Live Commands Integration */}
                        <div className="bg-secondary-bg/50 p-5 rounded-2xl border border-border-custom space-y-5">
                          <div className="flex items-center justify-between gap-4 border-b border-border-custom/50 pb-3.5">
                            <div className="space-y-1">
                              <h3 className="font-cinzel text-xs font-bold text-white-text uppercase tracking-wider flex items-center gap-2">
                                <Server className="w-4 h-4 text-emerald-500" />
                                RCON Live Command Delivery
                              </h3>
                              <p className="text-xs text-secondary-text">
                                Enable direct delivery of packages via RCON when manual claims are verified (requires RCON port open on your server).
                              </p>
                            </div>
                            <button
                              onClick={() => setRconEnabled(!rconEnabled)}
                              className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 border cursor-pointer ${
                                rconEnabled
                                  ? "bg-emerald-500 border-emerald-500/80 justify-end"
                                  : "bg-[#111217] border-border-custom justify-start"
                              }`}
                            >
                              <span className="w-5.5 h-5.5 rounded-full bg-white shadow-md block transition-transform" />
                            </button>
                          </div>

                          {rconEnabled && (
                            <div className="space-y-4 pt-1 font-inter text-xs text-secondary-text">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold uppercase tracking-wider block text-white-text">RCON Server Host</label>
                                  <input
                                    type="text"
                                    value={rconHost}
                                    onChange={(e) => setRconHost(e.target.value)}
                                    placeholder="e.g. play.bongcraftsmp.in"
                                    className="w-full bg-[#09090B] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none text-xs focus:border-primary-accent/60"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold uppercase tracking-wider block text-white-text">RCON Port</label>
                                  <input
                                    type="text"
                                    value={rconPort}
                                    onChange={(e) => setRconPort(e.target.value)}
                                    placeholder="e.g. 25575"
                                    className="w-full bg-[#09090B] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none text-xs focus:border-primary-accent/60"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold uppercase tracking-wider block text-white-text">RCON Password</label>
                                  <input
                                    type="password"
                                    value={rconPassword}
                                    onChange={(e) => setRconPassword(e.target.value)}
                                    placeholder="Enter RCON password"
                                    className="w-full bg-[#09090B] border border-border-custom px-3 py-2 rounded-xl text-white-text outline-none text-xs focus:border-primary-accent/60"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  onClick={handleSaveRconSettings}
                                  className="px-6 py-2.5 bg-primary-accent hover:bg-primary-accent/90 text-white-text font-bold uppercase text-[10px] rounded-xl cursor-pointer transition-colors"
                                >
                                  Save RCON Configuration
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Reset Local Storage database */}
                        <div className="flex items-center justify-between gap-4 bg-rose-500/5 p-5 rounded-2xl border border-rose-500/10">
                          <div className="space-y-1">
                            <h3 className="font-cinzel text-xs font-bold text-rose-500 uppercase tracking-wider">
                              Reset Orders Database
                            </h3>
                            <p className="text-xs text-secondary-text">
                              Clear all locally saved order references from this browser cache. This action is irreversible.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm("Reset order cache database? This clears all logs.")) {
                                localStorage.removeItem("bongcraft_orders");
                                setOrders([]);
                                setSelectedOrder(null);
                                addAuditLog("Clear command: reset order cache database completed", "warning");
                              }
                            }}
                            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white-text font-bold uppercase text-[10px] rounded-xl cursor-pointer transition-colors"
                          >
                            Reset Data
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
