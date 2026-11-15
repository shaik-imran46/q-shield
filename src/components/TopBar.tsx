"use client";

import React, { useState } from "react";
import { NetworkId } from "@/types/security";
import { Bell, Menu, Globe, User, ShieldAlert } from "lucide-react";

interface TopBarProps {
  network: NetworkId;
  onNetworkChange: (net: NetworkId) => void;
  onOpenMobile: () => void;
  activeWalletAddress: string;
}

export default function TopBar({
  network,
  onNetworkChange,
  onOpenMobile,
  activeWalletAddress,
}: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#060913]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Simulated RPC:</span>
          <span className="font-medium text-slate-200">
            {network === "mainnet" ? "Ethereum Mainnet" : "Ethereum Sepolia"}
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400">
          <span>Active Target:</span>
          <code className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-300 font-mono">
            {activeWalletAddress.slice(0, 8)}...{activeWalletAddress.slice(-6)}
          </code>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <select
            value={network}
            onChange={(e) => onNetworkChange(e.target.value as NetworkId)}
            className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
            aria-label="Select Ethereum Network"
          >
            <option value="mainnet" className="bg-slate-900">
              Ethereum Mainnet
            </option>
            <option value="sepolia" className="bg-slate-900">
              Ethereum Sepolia
            </option>
          </select>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 cyber-card p-3 z-50 border border-slate-700/80">
              <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
                <span>Security Alerts (Simulated)</span>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-200">Critical Risk Wallet Flagged</p>
                    <p className="text-slate-400 text-[11px]">0x9f8C...9876 — Unlimited USDT approval</p>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <p className="font-medium">ML-DSA (FIPS 204) Seal Ready</p>
                  <p className="text-slate-400 text-[11px]">Report #QS-2026-0815 signed in simulation</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-none">
              Security Analyst
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Demo Session</div>
          </div>
        </div>
      </div>
    </header>
  );
}
