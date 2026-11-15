import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Q-Shield | AI/ML Web3 Wallet Security & Post-Quantum Threat Intelligence",
  description:
    "EVM wallet security scanner powered by XGBoost ML classification, multi-agent AI investigation, and FIPS 204 ML-DSA report signing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#060913] text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
