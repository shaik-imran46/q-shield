"use client";

import React from "react";
import { NavSection } from "@/types/security";
import {
  LayoutDashboard,
  ScanSearch,
  ArrowLeftRight,
  Coins,
  FileCode2,
  Bot,
  FileCheck2,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

interface SidebarProps {
  activeSection: NavSection;
  onSelect: (section: NavSection) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const NAV_ITEMS: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "scanner", label: "Wallet Scanner", icon: ScanSearch },
  { id: "transactions", label: "Transaction Analysis", icon: ArrowLeftRight },
  { id: "tokens", label: "Token Security", icon: Coins },
  { id: "contracts", label: "Smart Contract Security", icon: FileCode2 },
  { id: "agents", label: "AI Investigation", icon: Bot },
  { id: "reports", label: "Security Reports", icon: FileCheck2 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  activeSection,
  onSelect,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#080c18] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white tracking-tight leading-none">
                  Q-Shield
                </div>
                <div className="text-[11px] text-sky-400 font-medium mt-1">
                  WalletGuard AI
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    active
                      ? "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-blue-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200 leading-relaxed">
            <span className="font-semibold block text-amber-300 mb-0.5">
              Prototype Simulation Mode
            </span>
            Uses illustrative ML &amp; blockchain sample data. No live RPC or private keys.
          </div>
        </div>
      </aside>
    </>
  );
}
