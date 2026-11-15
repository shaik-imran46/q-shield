# Q-Shield — AI/ML Web3 Wallet Security Dashboard

A Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Three.js Web3 security prototype combining:
1. **XGBoost Transaction Classification** (10-feature extraction & illustrative metrics)
2. **Multi-Agent AI Investigation** (LangGraph-style 4-agent orchestration)
3. **EVM Blockchain Analytics** (Ethereum Mainnet & Sepolia simulation)
4. **Post-Quantum Report Signing** (FIPS 204 ML-DSA simulated workflow)

## Quick Start
```bash
npm install
npm run dev
```

## Production Build / Vercel Deployment
```bash
npm run typecheck
npm run build
```

## FastAPI Backend Integration
Update `NEXT_PUBLIC_QSHIELD_API_URL` in `.env.local` and connect `src/lib/apiClient.ts` to your Python/FastAPI service implementing:
- `POST /api/wallet/scan`
- `GET /api/wallet/{address}/transactions`
- `POST /api/ml/predict`
- `POST /api/agents/investigate`
- `GET /api/wallet/{address}/risk`
- `POST /api/reports/generate`
- `POST /api/reports/sign`
- `POST /api/reports/verify`
