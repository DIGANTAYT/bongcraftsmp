"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { audioSynth } from "@/lib/audio";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  toast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType, duration = 4500) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Play low latency contextual Minecraft sound
    if (type === "success") {
      audioSynth.playLevelUp();
    } else {
      audioSynth.playClick();
    }

    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = useCallback((msg: string, dur?: number) => toast(msg, "success", dur), [toast]);
  const error = useCallback((msg: string, dur?: number) => toast(msg, "error", dur), [toast]);
  const info = useCallback((msg: string, dur?: number) => toast(msg, "info", dur), [toast]);
  const warning = useCallback((msg: string, dur?: number) => toast(msg, "warning", dur), [toast]);

  return (
    <ToastContext.Provider value={{ success, error, info, warning, toast }}>
      {children}
      
      {/* Toast container overlay */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <style>{`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in-right {
            animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
        
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border bg-[#09090B]/95 backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 animate-slide-in-right ${
              t.type === "success" ? "border-emerald-500/40 text-emerald-400" :
              t.type === "error" ? "border-rose-500/40 text-rose-400" :
              t.type === "warning" ? "border-amber-500/40 text-amber-400" :
              "border-cyan-500/40 text-cyan-400"
            }`}
          >
            {t.type === "success" && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />}
            {t.type === "error" && <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />}
            {t.type === "warning" && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />}
            {t.type === "info" && <Info className="w-5 h-5 shrink-0 text-cyan-500 mt-0.5" />}
            
            <div className="flex-1 font-inter text-xs font-semibold leading-relaxed text-[#E2E8F0] whitespace-pre-line">
              {t.message}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="p-0.5 hover:bg-white/5 rounded-lg text-secondary-text hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
