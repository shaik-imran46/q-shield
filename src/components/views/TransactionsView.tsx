"use client";

import React, { useState } from "react";
import { TxFilter, WalletProfileData, WalletTransaction } from "@/types/security";
import { XGBOOST_ILLUSTRATIVE_METRICS } from "@/data/mockWallets";
import { ExternalLink, X, Cpu } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface TransactionsViewProps {
  activeWallet: WalletProfileData;
}

export default function TransactionsView({ activeWallet }: TransactionsViewProps) {
  const [filter, setFilter] = useState<TxFilter>("all");
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);

  const filtered = activeWallet.transactions.filter((tx) => {
    if (filter === "normal") return tx.mlPrediction === "Normal";
    if (filter === "suspicious") return tx.mlPrediction === "Potentially suspicious";
    if (filter === "high_risk")
      return tx.riskLevel === "High Risk" || tx.riskLevel === "Critical Risk";
    return true;
  });

  const explorerBase =
    activeWallet.network === "sepolia"
      ? "https://sepolia.etherscan.io/tx/"
      : "https://etherscan.io/tx/";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Transaction Analysis &amp; XGBoost ML
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Inspect extracted transaction features, XGBoost fraud classifications &amp; illustrative model metrics.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Transactions" },
            { id: "normal", label: "Normal" },
            { id: "suspicious", label: "Suspicious" },
            { id: "high_risk", label: "High Risk" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as TxFilter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                filter === tab.id
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="cyber-card p-5 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3 font-medium">Tx Hash</th>
              <th className="pb-3 font-medium">Date &amp; Time</th>
              <th className="pb-3 font-medium">From</th>
              <th className="pb-3 font-medium">To</th>
              <th className="pb-3 font-medium">Value</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">ML Prediction</th>
              <th className="pb-3 font-medium">Confidence</th>
              <th className="pb-3 font-medium">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filtered.map((tx) => (
              <tr
                key={tx.hash}
                onClick={() => setSelectedTx(tx)}
                className="hover:bg-blue-500/5 cursor-pointer transition"
              >
                <td className="py-3 font-mono text-sky-300">
                  {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                </td>
                <td className="py-3 text-slate-400">{tx.timestamp}</td>
                <td className="py-3 font-mono text-slate-300">
                  {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                </td>
                <td className="py-3 font-mono text-slate-300">
                  {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                </td>
                <td className="py-3 font-semibold text-white">{tx.valueEth}</td>
                <td className="py-3 text-slate-300">{tx.type}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${
                      tx.mlPrediction === "Normal"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {tx.mlPrediction}
                  </span>
                </td>
                <td className="py-3 text-slate-200">{tx.mlConfidence.toFixed(1)}%</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${
                      tx.riskLevel === "Critical Risk" || tx.riskLevel === "High Risk"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    {tx.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* XGBoost ML Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 cyber-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-semibold text-white">XGBoost ML Engine Analytics</h2>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200">
            Illustrative metrics shown for prototype demonstration until a trained Python/FastAPI XGBoost model is connected.
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Model</div>
              <div className="font-semibold text-white mt-0.5">XGBoost (10 features)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Precision / Recall / F1</div>
              <div className="font-semibold text-sky-300 mt-0.5">
                {XGBOOST_ILLUSTRATIVE_METRICS.precision} / {XGBOOST_ILLUSTRATIVE_METRICS.recall} /{" "}
                {XGBOOST_ILLUSTRATIVE_METRICS.f1Score}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-400 mb-2">
              Illustrative Confusion Matrix
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                <div className="text-slate-400">True Negative</div>
                <div className="text-base font-bold text-emerald-300">
                  {XGBOOST_ILLUSTRATIVE_METRICS.confusionMatrix.trueNegative}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25">
                <div className="text-slate-400">False Positive</div>
                <div className="text-base font-bold text-amber-300">
                  {XGBOOST_ILLUSTRATIVE_METRICS.confusionMatrix.falsePositive}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25">
                <div className="text-slate-400">False Negative</div>
                <div className="text-base font-bold text-amber-300">
                  {XGBOOST_ILLUSTRATIVE_METRICS.confusionMatrix.falseNegative}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/25">
                <div className="text-slate-400">True Positive</div>
                <div className="text-base font-bold text-blue-300">
                  {XGBOOST_ILLUSTRATIVE_METRICS.confusionMatrix.truePositive}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 cyber-card p-5">
          <h2 className="text-base font-semibold text-white mb-4">
            Feature Importance (Illustrative XGBoost Weights)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={XGBOOST_ILLUSTRATIVE_METRICS.featureImportance}
                layout="vertical"
                margin={{ left: 30, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="feature" stroke="#cbd5e1" fontSize={11} width={175} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1322",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transaction Detail Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-[#0b101e] border-l border-slate-800 h-full overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Transaction Inspection</h3>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">Transaction Hash</div>
              <div className="font-mono text-sky-300 break-all">{selectedTx.hash}</div>
              <a
                href={`${explorerBase}${selectedTx.hash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:underline pt-1"
              >
                View on Block Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-slate-400">Amount</div>
                <div className="font-bold text-white mt-0.5">{selectedTx.valueEth}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-slate-400">Gas Fee</div>
                <div className="font-bold text-white mt-0.5">{selectedTx.gasFeeEth}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-slate-400">XGBoost Prediction</div>
                <div className="font-bold text-white mt-0.5">{selectedTx.mlPrediction}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-slate-400">Model Confidence</div>
                <div className="font-bold text-sky-300 mt-0.5">{selectedTx.mlConfidence}%</div>
              </div>
            </div>

            {selectedTx.contractDetails && (
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                <div className="text-slate-400 mb-1">Contract Interaction</div>
                <div className="text-slate-200 font-mono">{selectedTx.contractDetails}</div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Extracted ML Features (10-Vector)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedTx.features).map(([k, v]) => (
                  <div
                    key={k}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between gap-2"
                  >
                    <span className="text-slate-400 truncate">{k}</span>
                    <span className="font-mono text-slate-100">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Investigation Findings
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                {selectedTx.investigationFindings.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
