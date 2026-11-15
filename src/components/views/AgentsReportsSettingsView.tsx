"use client";

import React, { useState } from "react";
import {
  AgentFinding,
  NetworkId,
  SecurityReportRecord,
  WalletProfileData,
} from "@/types/security";
import {
  FASTAPI_ENDPOINTS,
  postReportGenerate,
  postReportSign,
  postReportVerify,
} from "@/lib/apiClient";
import {
  Bot,
  Activity,
  Coins,
  FileCode2,
  FileCheck2,
  Play,
  Loader2,
  KeyRound,
  Download,
  ShieldCheck,
  Server,
} from "lucide-react";

export function AgentsView({ activeWallet }: { activeWallet: WalletProfileData }) {
  const [running, setRunning] = useState(false);
  const [agents, setAgents] = useState<AgentFinding[]>(activeWallet.agents);

  React.useEffect(() => {
    setAgents(activeWallet.agents);
  }, [activeWallet]);

  const simulateOrchestration = async () => {
    setRunning(true);
    setAgents((prev) => prev.map((a) => ({ ...a, status: "Running", progress: 25 })));
    await new Promise((r) => setTimeout(r, 600));
    setAgents((prev) => prev.map((a) => ({ ...a, progress: 70 })));
    await new Promise((r) => setTimeout(r, 600));
    setAgents(activeWallet.agents);
    setRunning(false);
  };

  const icons = [Activity, Coins, FileCode2, FileCheck2];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Multi-Agent AI Investigation
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            LangGraph-inspired 4-agent orchestration producing evidence-backed findings only.
          </p>
        </div>
        <button
          type="button"
          disabled={running}
          onClick={simulateOrchestration}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-semibold transition"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? "Orchestrating Agents..." : "Run Multi-Agent Investigation"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent, i) => {
          const Icon = icons[i] || Bot;
          return (
            <div key={agent.id} className="cyber-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                    <p className="text-xs text-slate-400">{agent.role}</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    agent.status === "Attention required"
                      ? "bg-red-500/15 text-red-400"
                      : agent.status === "Running"
                        ? "bg-blue-500/15 text-blue-300"
                        : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${agent.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Issues Identified:</span>
                <span className="font-bold text-white">{agent.issuesIdentified}</span>
              </div>

              <ul className="space-y-1 text-xs text-slate-300 list-disc pl-4">
                {agent.findings.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="cyber-card p-5">
        <h2 className="text-base font-semibold text-white mb-4">Investigation Timeline</h2>
        <div className="space-y-3">
          {activeWallet.timeline.map((ev) => (
            <div
              key={ev.time + ev.agent}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sky-400 font-semibold">{ev.time}</span>
                <span className="font-semibold text-white">{ev.agent}</span>
                <span className="text-slate-300">{ev.action}</span>
              </div>
              <span className="font-mono text-slate-400">{ev.target}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReportsView({
  activeWallet,
  reports,
  onUpdateReports,
}: {
  activeWallet: WalletProfileData;
  reports: SecurityReportRecord[];
  onUpdateReports: React.Dispatch<React.SetStateAction<SecurityReportRecord[]>>;
}) {
  const [selectedId, setSelectedId] = useState<string>(reports[0]?.reportId || "");
  const [statusNote, setStatusNote] = useState<string>("");

  const activeReport = reports.find((r) => r.reportId === selectedId) || reports[0];

  const handleGenerate = async () => {
    const newRep = await postReportGenerate(activeWallet);
    onUpdateReports((prev) => [newRep, ...prev]);
    setSelectedId(newRep.reportId);
    setStatusNote(`Generated simulated report ${newRep.reportId} (awaiting ML-DSA signature).`);
  };

  const handleSign = async () => {
    if (!activeReport) return;
    const res = await postReportSign(activeReport.reportId);
    onUpdateReports((prev) =>
      prev.map((r) =>
        r.reportId === activeReport.reportId
          ? {
              ...r,
              mlDsaSignatureStatus: "Signed (Simulated)",
              payloadHash: res.payloadHash,
              signaturePreview: res.signaturePreview,
            }
          : r
      )
    );
    setStatusNote("Simulated ML-DSA (FIPS 204) signature applied. Connect Python backend for real FIPS 204 keys.");
  };

  const handleVerify = async () => {
    if (!activeReport) return;
    const res = await postReportVerify(activeReport.reportId);
    onUpdateReports((prev) =>
      prev.map((r) =>
        r.reportId === activeReport.reportId
          ? { ...r, verificationStatus: "Verified (Simulated)" }
          : r
      )
    );
    setStatusNote(res.note);
  };

  const handleDownload = (rep: SecurityReportRecord) => {
    const blob = new Blob([JSON.stringify({ prototypeSimulated: true, ...rep }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rep.reportId}-qshield-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Security Reports &amp; ML-DSA (FIPS 204)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Post-quantum digital signature workflow (simulated until FastAPI FIPS 204 backend is connected).
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
        >
          Generate New Report for Active Wallet
        </button>
      </div>

      {activeReport && (
        <div className="cyber-card p-5 space-y-4 border border-violet-500/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-5 h-5 text-violet-400" />
              <div>
                <h2 className="text-base font-bold text-white">
                  ML-DSA Post-Quantum Signing Module — {activeReport.reportId}
                </h2>
                <p className="text-xs text-slate-400">
                  Algorithm: ML-DSA (FIPS 204) • Clearly labelled simulated signing state
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSign}
                className="px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition"
              >
                Sign Report
              </button>
              <button
                type="button"
                onClick={handleVerify}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition inline-flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Verify Signature
              </button>
              <button
                type="button"
                onClick={() => handleDownload(activeReport)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition inline-flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Public Key Fingerprint</div>
              <div className="font-mono text-sky-300 mt-1 break-all">
                {activeReport.publicKeyFingerprint}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Digital Signature Status</div>
              <div className="font-semibold text-white mt-1">
                {activeReport.mlDsaSignatureStatus}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Integrity &amp; Verification</div>
              <div className="font-semibold text-emerald-400 mt-1">
                {activeReport.verificationStatus}
              </div>
            </div>
          </div>

          {statusNote && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200">
              {statusNote}
            </div>
          )}
        </div>
      )}

      <div className="cyber-card p-5 overflow-x-auto">
        <h2 className="text-base font-semibold text-white mb-4">Generated Security Reports</h2>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3 font-medium">Report ID</th>
              <th className="pb-3 font-medium">Wallet</th>
              <th className="pb-3 font-medium">Scan Date</th>
              <th className="pb-3 font-medium">Risk Score</th>
              <th className="pb-3 font-medium">ML-DSA Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {reports.map((rep) => (
              <tr key={rep.reportId} className="hover:bg-slate-800/30">
                <td className="py-3 font-mono text-sky-300">{rep.reportId}</td>
                <td className="py-3 font-mono text-slate-300">
                  {rep.walletAddress.slice(0, 8)}...{rep.walletAddress.slice(-6)}
                </td>
                <td className="py-3 text-slate-400">{rep.scanDate}</td>
                <td className="py-3 font-bold text-white">{rep.riskScore}/100</td>
                <td className="py-3 text-violet-300">{rep.mlDsaSignatureStatus}</td>
                <td className="py-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedId(rep.reportId)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(rep)}
                    className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SettingsView({
  network,
  onNetworkChange,
}: {
  network: NetworkId;
  onNetworkChange: (n: NetworkId) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Settings &amp; Backend Integration Map
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure network defaults and inspect FastAPI endpoint placeholders for production deployment.
        </p>
      </div>

      <div className="cyber-card p-5 space-y-3">
        <h2 className="text-base font-semibold text-white">Default Network</h2>
        <div className="flex gap-3">
          {(["mainnet", "sepolia"] as NetworkId[]).map((net) => (
            <button
              key={net}
              type="button"
              onClick={() => onNetworkChange(net)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                network === net
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              {net === "mainnet" ? "Ethereum Mainnet" : "Ethereum Sepolia"}
            </button>
          ))}
        </div>
      </div>

      <div className="cyber-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-semibold text-white">
            FastAPI Backend API Integration Placeholders
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {FASTAPI_ENDPOINTS.map((ep) => (
            <div
              key={ep.path}
              className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-2"
            >
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-mono font-bold mr-2">
                  {ep.method}
                </span>
                <span className="font-mono text-white">{ep.path}</span>
                <div className="text-slate-400 mt-1">{ep.module}</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 shrink-0">
                Mocked
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
