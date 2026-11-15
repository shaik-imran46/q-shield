"use client";

import React, { useState } from "react";
import { NetworkId, WalletProfileData } from "@/types/security";
import { SAMPLE_WALLET_A, SAMPLE_WALLET_B } from "@/data/mockWallets";
import { isValidEvmAddress, postWalletScan } from "@/lib/apiClient";
import RiskGauge from "@/components/RiskGauge";
import {
  ScanSearch,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Info,
} from "lucide-react";

const SCAN_STAGES = [
  "Connecting to blockchain",
  "Retrieving wallet transactions",
  "Extracting transaction features",
  "Running ML fraud detection",
  "Investigating suspicious activity using AI agents",
  "Calculating wallet risk",
  "Generating security report",
  "Signing report with ML-DSA",
];

interface ScannerViewProps {
  activeWallet: WalletProfileData;
  network: NetworkId;
  onNetworkChange: (net: NetworkId) => void;
  onWalletScanned: (wallet: WalletProfileData) => void;
  onScanningStateChange: (scanning: boolean, stage: number) => void;
}

export default function ScannerView({
  activeWallet,
  network,
  onNetworkChange,
  onWalletScanned,
  onScanningStateChange,
}: ScannerViewProps) {
  const [addressInput, setAddressInput] = useState(activeWallet.address);
  const [errorMsg, setErrorMsg] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);

  const runScan = async (targetAddr: string) => {
    if (!isValidEvmAddress(targetAddr)) {
      setErrorMsg("Please enter a valid 42-character EVM address starting with 0x.");
      return;
    }
    setErrorMsg("");
    setIsScanning(true);
    setCurrentStage(0);
    onScanningStateChange(true, 0);

    for (let i = 0; i < SCAN_STAGES.length; i++) {
      setCurrentStage(i);
      onScanningStateChange(true, i);
      await new Promise((r) => setTimeout(r, 340));
    }

    const res = await postWalletScan(targetAddr, network);
    onWalletScanned(res.data);
    setIsScanning(false);
    setCurrentStage(SCAN_STAGES.length);
    onScanningStateChange(false, SCAN_STAGES.length);
  };

  const loadSample = (sample: WalletProfileData) => {
    setAddressInput(sample.address);
    setErrorMsg("");
    runScan(sample.address);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">EVM Wallet Scanner</h1>
        <p className="text-sm text-slate-400 mt-1">
          Run an 8-stage simulated security scan combining XGBoost, LangGraph agents &amp; ML-DSA signing.
        </p>
      </div>

      {/* Scanner Input Card */}
      <div className="cyber-card p-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-7">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              EVM Wallet Address
            </label>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
              className="w-full px-4 py-2.5 rounded-xl bg-[#060913] border border-slate-700/80 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Target Network
            </label>
            <select
              value={network}
              onChange={(e) => onNetworkChange(e.target.value as NetworkId)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#060913] border border-slate-700/80 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="mainnet">Ethereum Mainnet</option>
              <option value="sepolia">Ethereum Sepolia</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex items-end">
            <button
              type="button"
              disabled={isScanning}
              onClick={() => runScan(addressInput)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm transition"
            >
              {isScanning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ScanSearch className="w-4 h-4" />
              )}
              {isScanning ? "Scanning..." : "Scan Wallet"}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400">Load demonstration wallets:</span>
          <button
            type="button"
            disabled={isScanning}
            onClick={() => loadSample(SAMPLE_WALLET_A)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-300 transition"
          >
            Sample Wallet A (Low Risk)
          </button>
          <button
            type="button"
            disabled={isScanning}
            onClick={() => loadSample(SAMPLE_WALLET_B)}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-medium text-red-300 transition"
          >
            Sample Wallet B (Critical Risk)
          </button>
        </div>
      </div>

      {/* 8-Stage Scan Progress */}
      {(isScanning || currentStage >= 0) && (
        <div className="cyber-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">8-Stage Scan Pipeline</h2>
            <span className="text-xs text-sky-400">
              {isScanning
                ? `Stage ${currentStage + 1} of ${SCAN_STAGES.length}`
                : "Simulation Complete"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SCAN_STAGES.map((stage, idx) => {
              const done = currentStage > idx || (!isScanning && currentStage === SCAN_STAGES.length);
              const active = isScanning && currentStage === idx;
              return (
                <div
                  key={stage}
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition ${
                    done
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                      : active
                        ? "bg-blue-500/15 border-blue-500/50 text-blue-200"
                        : "bg-slate-900/50 border-slate-800 text-slate-500"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : active ? (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                  )}
                  <span className="font-medium leading-tight">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Report Header + Gauge */}
      <div className="cyber-card p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-4 flex justify-center">
          <RiskGauge
            score={activeWallet.riskScore}
            classification={activeWallet.riskClassification}
          />
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Simulated Wallet Security Report
              </span>
              <h2 className="text-lg font-bold text-white font-mono break-all mt-0.5">
                {activeWallet.address}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
              {activeWallet.network === "mainnet" ? "Ethereum Mainnet" : "Ethereum Sepolia"}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Scan Timestamp: <span className="text-slate-200">{activeWallet.scanTimestamp}</span>
          </p>

          {/* A. Wallet Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ["Total Transactions", activeWallet.stats.totalTransactions],
              ["Incoming Tx", activeWallet.stats.incomingTransactions],
              ["Outgoing Tx", activeWallet.stats.outgoingTransactions],
              ["Unique Recipients", activeWallet.stats.uniqueRecipients],
              ["Token Interactions", activeWallet.stats.tokenInteractions],
              ["Contract Interactions", activeWallet.stats.contractInteractions],
            ].map(([label, val]) => (
              <div
                key={String(label)}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800"
              >
                <div className="text-[11px] text-slate-400">{label}</div>
                <div className="text-lg font-bold text-white mt-0.5">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* B. Threat Summary & C. Risk Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 cyber-card p-5 space-y-3">
          <h3 className="text-base font-semibold text-white">Threat Summary</h3>
          {[
            ["Suspicious Transactions", activeWallet.threatSummary.suspiciousTransactions],
            ["Risky Token Interactions", activeWallet.threatSummary.riskyTokenInteractions],
            ["Dangerous Contract Approvals", activeWallet.threatSummary.dangerousApprovals],
            ["Unusual Behaviour Flags", activeWallet.threatSummary.unusualBehaviourFlags],
            ["Verified Malicious Interactions", activeWallet.threatSummary.knownMaliciousInteractions],
          ].map(([label, val]) => (
            <div
              key={String(label)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-sm"
            >
              <span className="text-slate-300">{label}</span>
              <span
                className={`font-bold ${
                  Number(val) > 0 ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {val}
              </span>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7 cyber-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Contributing Risk Factors</h3>
            <span className="text-[11px] text-slate-400">
              Intel vs Behavioural Separation
            </span>
          </div>
          {activeWallet.riskFactors.map((factor) => (
            <div
              key={factor.title}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {factor.severity === "critical" || factor.severity === "high" ? (
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                  ) : (
                    <Info className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-sm font-semibold text-white">{factor.title}</span>
                </div>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${
                    factor.category === "Verified Threat Intelligence"
                      ? "bg-violet-500/15 text-violet-300 border-violet-500/30"
                      : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                  }`}
                >
                  {factor.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{factor.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
