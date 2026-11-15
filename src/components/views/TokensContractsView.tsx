"use client";

import React, { useState } from "react";
import { ContractApprovalItem, WalletProfileData } from "@/types/security";
import { AlertTriangle, CheckCircle2, ShieldAlert, FileCode2, Info } from "lucide-react";

export function TokensView({ activeWallet }: { activeWallet: WalletProfileData }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Token Security Analysis</h1>
        <p className="text-sm text-slate-400 mt-1">
          Reputation screening for ERC-20 tokens held or interacted with by{" "}
          <span className="font-mono text-sky-300">{activeWallet.address}</span>.
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-200 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        Unverified tokens are flagged for manual review and are never automatically classified as fraudulent.
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeWallet.tokens.map((token) => (
          <div key={token.contractAddress} className="cyber-card p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">
                    {token.name} ({token.symbol})
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      token.reputation === "Verified"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : token.reputation === "Flagged Malicious"
                          ? "bg-red-500/15 text-red-300 border-red-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {token.reputation}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">{token.contractAddress}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{token.balance}</div>
                <div className="text-xs text-slate-400">{token.riskClassification}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              {token.warningFlags.knownMaliciousLabel && (
                <span className="px-2.5 py-1 rounded-md bg-red-500/15 text-red-300 border border-red-500/30">
                  Known Malicious Label
                </span>
              )}
              {token.warningFlags.suspiciousContractChars && (
                <span className="px-2.5 py-1 rounded-md bg-red-500/15 text-red-300 border border-red-500/30">
                  Suspicious Contract Characteristics
                </span>
              )}
              {token.warningFlags.unverifiedInfo && (
                <span className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Unverified Token Info
                </span>
              )}
              {token.warningFlags.unusualInteractions && (
                <span className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Unusual Token Interactions
                </span>
              )}
              {!Object.values(token.warningFlags).some(Boolean) && (
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> No Warning Indicators
                </span>
              )}
            </div>

            <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
              {token.findings.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContractsView({ activeWallet }: { activeWallet: WalletProfileData }) {
  const [selected, setSelected] = useState<ContractApprovalItem | null>(
    activeWallet.approvals[0] || null
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Smart Contract &amp; Approval Security
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Inspect active ERC-20 token allowances, unlimited MAX_UINT256 approvals &amp; spender verification.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 cyber-card p-5 overflow-x-auto">
          <h2 className="text-base font-semibold text-white mb-4">Approval Risk Table</h2>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Token</th>
                <th className="pb-3 font-medium">Spender</th>
                <th className="pb-3 font-medium">Approval Amount</th>
                <th className="pb-3 font-medium">Unlimited</th>
                <th className="pb-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {activeWallet.approvals.map((app) => (
                <tr
                  key={app.spenderAddress}
                  onClick={() => setSelected(app)}
                  className="hover:bg-blue-500/5 cursor-pointer transition"
                >
                  <td className="py-3 font-semibold text-white">{app.token}</td>
                  <td className="py-3 font-mono text-sky-300">
                    {app.spenderAddress.slice(0, 8)}...{app.spenderAddress.slice(-6)}
                  </td>
                  <td className="py-3 text-slate-200">{app.approvalAmount}</td>
                  <td className="py-3">
                    {app.unlimitedApproval ? (
                      <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-emerald-400">No</span>
                    )}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        app.riskClassification === "Critical Risk" ||
                        app.riskClassification === "High Risk"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-emerald-500/15 text-emerald-400"
                      }`}
                    >
                      {app.riskClassification}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="xl:col-span-5 cyber-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white">Contract Inspection Panel</h2>
          </div>

          {selected ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Contract Name</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selected.contractName}
                </div>
                <div className="font-mono text-sky-300 break-all mt-1">
                  {selected.spenderAddress}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Verification</div>
                  <div
                    className={`font-semibold mt-0.5 ${
                      selected.verificationStatus === "Verified"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {selected.verificationStatus}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Allowance</div>
                  <div className="font-semibold text-white mt-0.5">{selected.approvalAmount}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 mb-1">Interaction History</div>
                <div className="text-slate-200">{selected.interactionHistory}</div>
              </div>

              <div>
                <div className="text-slate-400 mb-1.5">Permission Indicators</div>
                <div className="flex flex-wrap gap-2">
                  {selected.permissionIndicators.map((ind) => (
                    <span
                      key={ind}
                      className={`px-2.5 py-1 rounded-md border ${
                        selected.unlimitedApproval
                          ? "bg-red-500/10 border-red-500/30 text-red-300"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      }`}
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Select an approval row to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
