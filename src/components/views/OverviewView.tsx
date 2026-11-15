"use client";

import React from "react";
import { OVERVIEW_METRICS, SAMPLE_WALLET_A, SAMPLE_WALLET_B } from "@/data/mockWallets";
import { NavSection, WalletProfileData } from "@/types/security";
import {
  ShieldAlert,
  Activity,
  ScanSearch,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface OverviewViewProps {
  onNavigate: (section: NavSection) => void;
  onSelectWallet: (wallet: WalletProfileData) => void;
}

export default function OverviewView({ onNavigate, onSelectWallet }: OverviewViewProps) {
  const kpis = [
    {
      label: "Total Wallets Scanned",
      value: OVERVIEW_METRICS.totalWalletsScanned.toLocaleString(),
      sub: "Simulated telemetry",
      icon: Wallet,
      accent: "text-blue-400 bg-blue-500/10 border-blue-500/25",
    },
    {
      label: "Transactions Analysed",
      value: OVERVIEW_METRICS.totalTransactionsAnalysed.toLocaleString(),
      sub: "EVM Mainnet & Sepolia",
      icon: Activity,
      accent: "text-violet-400 bg-violet-500/10 border-violet-500/25",
    },
    {
      label: "Suspicious Tx Detected",
      value: OVERVIEW_METRICS.suspiciousTransactionsDetected.toLocaleString(),
      sub: "XGBoost flagged (demo)",
      icon: AlertTriangle,
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    },
    {
      label: "High-Risk Wallets",
      value: OVERVIEW_METRICS.highRiskWalletsIdentified.toLocaleString(),
      sub: "Score >= 50",
      icon: ShieldAlert,
      accent: "text-red-400 bg-red-500/10 border-red-500/25",
    },
  ];

  const recentScans = [SAMPLE_WALLET_B, SAMPLE_WALLET_A];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Security Command Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            AI/ML-powered EVM threat intelligence, multi-agent forensics &amp; post-quantum report integrity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("scanner")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition"
        >
          <ScanSearch className="w-4 h-4" />
          Scan New Wallet
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="cyber-card p-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">{kpi.label}</p>
                <p className="text-2xl font-bold text-white mt-1.5">{kpi.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{kpi.sub}</p>
              </div>
              <div className={`p-2.5 rounded-xl border ${kpi.accent}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 cyber-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Wallet Risk Distribution</h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Simulated
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={OVERVIEW_METRICS.riskDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {OVERVIEW_METRICS.riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1322",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {OVERVIEW_METRICS.riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
                <span className="ml-auto font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 cyber-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">
              Transaction Activity (Normal vs Suspicious)
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              7-Day Window
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={OVERVIEW_METRICS.activitySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1322",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="normal"
                  name="Normal Tx"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="suspicious"
                  name="Suspicious Tx"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 cyber-card p-5 overflow-x-auto">
          <h2 className="text-base font-semibold text-white mb-4">
            Recent Security Alerts (Demonstration Data)
          </h2>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Wallet</th>
                <th className="pb-3 font-medium">Tx Hash</th>
                <th className="pb-3 font-medium">Risk Score</th>
                <th className="pb-3 font-medium">Threat Category</th>
                <th className="pb-3 font-medium">Detected</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {OVERVIEW_METRICS.recentAlerts.map((alert) => (
                <tr key={alert.txHash} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 font-mono text-sky-300">{alert.wallet}</td>
                  <td className="py-3 font-mono text-slate-300">{alert.txHash}</td>
                  <td className="py-3 font-semibold text-white">{alert.riskScore}/100</td>
                  <td className="py-3 text-slate-300">{alert.category}</td>
                  <td className="py-3 text-slate-400">{alert.time}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        alert.status === "Critical"
                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                          : alert.status === "High"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="xl:col-span-4 cyber-card p-5">
          <h2 className="text-base font-semibold text-white mb-4">Recent Wallet Scans</h2>
          <div className="space-y-3">
            {recentScans.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                onClick={() => {
                  onSelectWallet(wallet);
                  onNavigate("scanner");
                }}
                className="w-full text-left p-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 transition flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {wallet.riskScore >= 50 ? (
                      <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-white truncate">
                      {wallet.label}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 truncate mt-1">
                    {wallet.address}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      wallet.riskScore >= 75
                        ? "bg-red-500/15 text-red-400"
                        : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    {wallet.riskScore}/100
                  </span>
                  <div className="flex items-center justify-end gap-0.5 text-[11px] text-blue-400 mt-1">
                    Inspect <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
