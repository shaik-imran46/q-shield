export type NavSection =
  | "overview"
  | "scanner"
  | "transactions"
  | "tokens"
  | "contracts"
  | "agents"
  | "reports"
  | "settings";

export type NetworkId = "mainnet" | "sepolia";

export type RiskLevel = "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk";

export type TxFilter = "all" | "normal" | "suspicious" | "high_risk";

export type AgentStatus = "Idle" | "Running" | "Completed" | "Attention required";

export interface ExtractedMLFeatures {
  txAmountEth: number;
  avgHistoricalAmountEth: number;
  txFrequencyPerDay: number;
  uniqueRecipients: number;
  newRecipientIndicator: boolean;
  contractInteractionIndicator: boolean;
  tokenApprovalIndicator: boolean;
  unlimitedApprovalIndicator: boolean;
  historicalSuspiciousInteraction: boolean;
  behavioralDeviationScore: number; // 0 to 1
}

export interface WalletTransaction {
  hash: string;
  timestamp: string;
  from: string;
  to: string;
  valueEth: string;
  type: "Transfer" | "Token Approval" | "Swap" | "Contract Call" | "Bridge";
  gasFeeEth: string;
  mlPrediction: "Normal" | "Potentially suspicious";
  mlConfidence: number; // percentage 0-100
  riskLevel: RiskLevel;
  contractDetails?: string;
  investigationFindings: string[];
  features: ExtractedMLFeatures;
}

export interface TokenSecurityItem {
  name: string;
  symbol: string;
  contractAddress: string;
  balance: string;
  reputation: "Verified" | "Unverified" | "Flagged Malicious";
  riskClassification: RiskLevel;
  findings: string[];
  warningFlags: {
    knownMaliciousLabel: boolean;
    suspiciousContractChars: boolean;
    unverifiedInfo: boolean;
    unusualInteractions: boolean;
  };
}

export interface ContractApprovalItem {
  token: string;
  contractName: string;
  contractAddress: string;
  spenderAddress: string;
  verificationStatus: "Verified" | "Unverified";
  approvalAmount: string;
  unlimitedApproval: boolean;
  riskClassification: RiskLevel;
  interactionHistory: string;
  permissionIndicators: string[];
}

export interface AgentFinding {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  progress: number;
  issuesIdentified: number;
  findings: string[];
}

export interface InvestigationTimelineEvent {
  time: string;
  agent: string;
  action: string;
  target: string;
  severity: "info" | "warning" | "critical" | "success";
}

export interface RiskFactor {
  title: string;
  category: "Verified Threat Intelligence" | "Behavioural Anomaly";
  severity: "low" | "moderate" | "high" | "critical";
  description: string;
}

export interface WalletProfileData {
  id: "wallet-a" | "wallet-b";
  label: string;
  address: string;
  network: NetworkId;
  scanTimestamp: string;
  riskScore: number;
  riskClassification: RiskLevel;
  stats: {
    totalTransactions: number;
    incomingTransactions: number;
    outgoingTransactions: number;
    uniqueRecipients: number;
    tokenInteractions: number;
    contractInteractions: number;
  };
  threatSummary: {
    suspiciousTransactions: number;
    riskyTokenInteractions: number;
    dangerousApprovals: number;
    unusualBehaviourFlags: number;
    knownMaliciousInteractions: number;
  };
  riskFactors: RiskFactor[];
  transactions: WalletTransaction[];
  tokens: TokenSecurityItem[];
  approvals: ContractApprovalItem[];
  agents: AgentFinding[];
  timeline: InvestigationTimelineEvent[];
}

export interface SecurityReportRecord {
  reportId: string;
  walletAddress: string;
  network: NetworkId;
  scanDate: string;
  riskScore: number;
  threatClassification: RiskLevel;
  suspiciousTxCount: number;
  investigationStatus: "Completed" | "Attention Required";
  mlDsaSignatureStatus: "Signed (Simulated)" | "Pending Signature";
  verificationStatus: "Verified (Simulated)" | "Unverified";
  payloadHash: string;
  publicKeyFingerprint: string;
  signaturePreview: string;
  evidenceSummary: string[];
}
