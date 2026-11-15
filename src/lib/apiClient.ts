import { NetworkId, WalletProfileData, SecurityReportRecord } from "@/types/security";
import { SAMPLE_WALLET_A, SAMPLE_WALLET_B } from "@/data/mockWallets";

/**
 * Q-Shield FastAPI Integration Layer (Prototype Placeholders)
 *
 * Designed for drop-in connection to a Python/FastAPI backend:
 * - Blockchain: Web3.py + Ethereum RPC + Etherscan-compatible APIs
 * - ML Engine: XGBoost + Scikit-learn inference service
 * - Multi-Agent Orchestration: LangGraph + Gemini API
 * - Post-Quantum Cryptography: FIPS 204 ML-DSA signing service
 *
 * NOTE: Currently returns clearly labelled simulated prototype data.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_QSHIELD_API_URL || "";

export const FASTAPI_ENDPOINTS = [
  { method: "POST", path: "/api/wallet/scan", module: "Blockchain Ingestion (Web3.py)" },
  { method: "GET", path: "/api/wallet/{address}/transactions", module: "EVM Transaction Indexer" },
  { method: "POST", path: "/api/ml/predict", module: "XGBoost Fraud Classifier" },
  { method: "POST", path: "/api/agents/investigate", module: "LangGraph 4-Agent Orchestrator" },
  { method: "GET", path: "/api/wallet/{address}/risk", module: "Risk Scoring Engine" },
  { method: "POST", path: "/api/reports/generate", module: "Security Dossier Builder" },
  { method: "POST", path: "/api/reports/sign", module: "ML-DSA (FIPS 204) Signer" },
  { method: "POST", path: "/api/reports/verify", module: "ML-DSA (FIPS 204) Verifier" },
] as const;

export function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

export async function postWalletScan(
  address: string,
  network: NetworkId
): Promise<{ simulated: boolean; endpoint: string; data: WalletProfileData }> {
  const normalized = address.trim().toLowerCase();
  const baseProfile =
    normalized === SAMPLE_WALLET_A.address.toLowerCase()
      ? SAMPLE_WALLET_A
      : normalized === SAMPLE_WALLET_B.address.toLowerCase()
        ? SAMPLE_WALLET_B
        : {
            ...SAMPLE_WALLET_B,
            address: address.trim(),
            label: "Custom Scanned Wallet (Simulated)",
            network,
            riskScore: 42,
            riskClassification: "Moderate Risk" as const,
            scanTimestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC (Simulated)",
          };

  return {
    simulated: !API_BASE_URL,
    endpoint: "POST /api/wallet/scan",
    data: { ...baseProfile, network },
  };
}

export async function getWalletTransactions(address: string) {
  return {
    simulated: true,
    endpoint: `GET /api/wallet/${address}/transactions`,
  };
}

export async function postMlPredict(txHash: string) {
  return {
    simulated: true,
    endpoint: "POST /api/ml/predict",
    txHash,
  };
}

export async function postAgentsInvestigate(address: string) {
  return {
    simulated: true,
    endpoint: "POST /api/agents/investigate",
    address,
  };
}

export async function getWalletRisk(address: string) {
  return {
    simulated: true,
    endpoint: `GET /api/wallet/${address}/risk`,
  };
}

export async function postReportGenerate(wallet: WalletProfileData): Promise<SecurityReportRecord> {
  return {
    reportId: `QS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    walletAddress: wallet.address,
    network: wallet.network,
    scanDate: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
    riskScore: wallet.riskScore,
    threatClassification: wallet.riskClassification,
    suspiciousTxCount: wallet.threatSummary.suspiciousTransactions,
    investigationStatus: wallet.riskScore >= 50 ? "Attention Required" : "Completed",
    mlDsaSignatureStatus: "Pending Signature",
    verificationStatus: "Unverified",
    payloadHash: "sha256:pending-canonical-hash...",
    publicKeyFingerprint: "mldsa65:fp:4a8f:91c2:77e0:3b19:88d4",
    signaturePreview: "Not yet signed",
    evidenceSummary: wallet.riskFactors.map((r) => `${r.title} (${r.category})`),
  };
}

export async function postReportSign(reportId: string) {
  return {
    simulated: true,
    endpoint: "POST /api/reports/sign",
    reportId,
    algorithm: "ML-DSA-65 (FIPS 204 — Simulated)",
    payloadHash: `sha256:${reportId.toLowerCase().replace(/[^a-z0-9]/g, "")}e84b19c0d7f2a1...`,
    signaturePreview: `MLDSA65-SIM-SIG-0x${Math.random().toString(16).slice(2, 18)}...`,
  };
}

export async function postReportVerify(reportId: string) {
  return {
    simulated: true,
    endpoint: "POST /api/reports/verify",
    reportId,
    valid: true,
    note: "Simulated integrity & ML-DSA-65 signature verification passed.",
  };
}
