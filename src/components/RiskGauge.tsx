"use client";

import React from "react";
import { RiskLevel } from "@/types/security";

interface RiskGaugeProps {
  score: number;
  classification: RiskLevel;
}

export default function RiskGauge({ score, classification }: RiskGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped >= 75
      ? "#ef4444"
      : clamped >= 50
        ? "#f97316"
        : clamped >= 25
          ? "#f59e0b"
          : "#10b981";

  const glowClass =
    clamped >= 75 ? "glow-critical" : clamped >= 25 ? "" : "glow-emerald";

  return (
    <div className={`relative flex flex-col items-center justify-center p-4 rounded-2xl bg-[#080c18] border border-slate-800 ${glowClass}`}>
      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.14)"
          strokeWidth="12"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.7s ease, stroke 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-white">{clamped}</span>
        <span className="text-[11px] uppercase tracking-wider text-slate-400">/ 100 Risk</span>
      </div>
      <span
        className="mt-2 px-3 py-1 rounded-full text-xs font-semibold border"
        style={{
          color,
          borderColor: `${color}55`,
          backgroundColor: `${color}18`,
        }}
      >
        {classification}
      </span>
    </div>
  );
}
