"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  NavSection,
  NetworkId,
  SecurityReportRecord,
  WalletProfileData,
} from "@/types/security";
import { INITIAL_REPORTS, SAMPLE_WALLET_B } from "@/data/mockWallets";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Guide3DViewport from "@/components/Guide3DViewport";
import OverviewView from "@/components/views/OverviewView";
import ScannerView from "@/components/views/ScannerView";
import TransactionsView from "@/components/views/TransactionsView";
import { TokensView, ContractsView } from "@/components/views/TokensContractsView";
import {
  AgentsView,
  ReportsView,
  SettingsView,
} from "@/components/views/AgentsReportsSettingsView";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const [network, setNetwork] = useState<NetworkId>("mainnet");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletProfileData>(SAMPLE_WALLET_B);
  const [reports, setReports] = useState<SecurityReportRecord[]>(INITIAL_REPORTS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex">
      <Sidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopBar
          network={network}
          onNetworkChange={setNetwork}
          onOpenMobile={() => setMobileOpen(true)}
          activeWalletAddress={activeWallet.address}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Guide3DViewport
            section={activeSection}
            riskScore={activeWallet.riskScore}
            isScanning={isScanning}
            scanStage={scanStage}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {activeSection === "overview" && (
                <OverviewView
                  onNavigate={setActiveSection}
                  onSelectWallet={setActiveWallet}
                />
              )}
              {activeSection === "scanner" && (
                <ScannerView
                  activeWallet={activeWallet}
                  network={network}
                  onNetworkChange={setNetwork}
                  onWalletScanned={setActiveWallet}
                  onScanningStateChange={(s, st) => {
                    setIsScanning(s);
                    setScanStage(st);
                  }}
                />
              )}
              {activeSection === "transactions" && (
                <TransactionsView activeWallet={activeWallet} />
              )}
              {activeSection === "tokens" && (
                <TokensView activeWallet={activeWallet} />
              )}
              {activeSection === "contracts" && (
                <ContractsView activeWallet={activeWallet} />
              )}
              {activeSection === "agents" && (
                <AgentsView activeWallet={activeWallet} />
              )}
              {activeSection === "reports" && (
                <ReportsView
                  activeWallet={activeWallet}
                  reports={reports}
                  onUpdateReports={setReports}
                />
              )}
              {activeSection === "settings" && (
                <SettingsView network={network} onNetworkChange={setNetwork} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
