"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { NavSection } from "@/types/security";
import { RotateCw, Pause, Play, Sparkles, Compass } from "lucide-react";

interface Guide3DViewportProps {
  section: NavSection;
  riskScore: number;
  isScanning?: boolean;
  scanStage?: number;
}

const GUIDE_METADATA: Record<
  NavSection,
  {
    title: string;
    subtitle: string;
    steps: string[];
  }
> = {
  overview: {
    title: "3D EVM Threat Topology",
    subtitle: "Interactive spatial view of scanned wallets and risk orbital tiers.",
    steps: [
      "Drag to orbit the EVM network globe",
      "Emerald/Amber/Red rings mirror risk distribution",
      "Click 'Scan New Wallet' to launch a live simulation",
    ],
  },
  scanner: {
    title: "3D Quantum-Shield Scan Core",
    subtitle: "Real-time 8-stage inspection core reacting to wallet scan progress.",
    steps: [
      "Enter an EVM address or load Sample Wallet A / B",
      "Watch concentric rings accelerate across all 8 stages",
      "Inspect the circular risk gauge & factor breakdown below",
    ],
  },
  transactions: {
    title: "3D Transaction Flow Graph",
    subtitle: "Spatial representation of sender-to-contract flows & XGBoost flags.",
    steps: [
      "Blue nodes represent normal verified transfers",
      "Red/Amber nodes highlight anomalous XGBoost predictions",
      "Click any transaction row to inspect 10 ML features",
    ],
  },
  tokens: {
    title: "3D Token Reputation Lattice",
    subtitle: "Orbital token polyhedra classified by verified vs flagged status.",
    steps: [
      "Emerald octahedra = verified canonical ERC-20s",
      "Amber = unverified (caution, not auto-fraud)",
      "Red = flagged phishing lure contracts",
    ],
  },
  contracts: {
    title: "3D Approval Permission Matrix",
    subtitle: "Layered holographic shield plates showing spender allowance scope.",
    steps: [
      "Green plates represent bounded protocol allowances",
      "Red pulsing plates indicate MAX_UINT256 unlimited risk",
      "Select any approval row to inspect contract bytecode flags",
    ],
  },
  agents: {
    title: "3D Multi-Agent LangGraph Hub",
    subtitle: "Central orchestrator linked to 4 specialized security AI agents.",
    steps: [
      "Central violet core = Investigation & Reporting Agent",
      "3 orbiting nodes = Behaviour, Token & Contract Agents",
      "Click 'Run Multi-Agent Investigation' to simulate orchestration",
    ],
  },
  reports: {
    title: "3D Post-Quantum ML-DSA Lattice",
    subtitle: "FIPS 204 lattice-based cryptographic seal protecting report integrity.",
    steps: [
      "Inner icosahedron = canonical SHA-256 report digest",
      "Outer wireframe cube = ML-DSA-65 signature lattice",
      "Use Sign, Verify & Download controls below",
    ],
  },
  settings: {
    title: "3D Architecture Pipeline Stack",
    subtitle: "Modular layers from Next.js UI to FastAPI, XGBoost & ML-DSA.",
    steps: [
      "5 stacked planes represent the full-stack architecture",
      "Switch between Ethereum Mainnet & Sepolia in header",
      "Review all 8 FastAPI integration endpoints below",
    ],
  },
};

export default function Guide3DViewport({
  section,
  riskScore,
  isScanning = false,
  scanStage = 0,
}: Guide3DViewportProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const meta = GUIDE_METADATA[section];

  useEffect(() => {
    setActiveStep(0);
  }, [section]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0x3b82f6, 2.2, 20);
    pointLight1.position.set(3, 3, 4);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1.8, 20);
    pointLight2.position.set(-3, -2, 3);
    scene.add(pointLight2);

    const root = new THREE.Group();
    scene.add(root);

    const riskColor =
      riskScore >= 75 ? 0xef4444 : riskScore >= 50 ? 0xf97316 : riskScore >= 25 ? 0xf59e0b : 0x10b981;

    // Build section-specific 3D scene
    if (section === "overview") {
      const globe = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.35, 2),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.45 })
      );
      root.add(globe);

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 24, 24),
        new THREE.MeshStandardMaterial({ color: riskColor, emissive: riskColor, emissiveIntensity: 0.35, roughness: 0.3 })
      );
      root.add(core);

      [1.75, 2.1].forEach((r, idx) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.025, 12, 64),
          new THREE.MeshBasicMaterial({ color: idx === 0 ? 0x8b5cf6 : riskColor, transparent: true, opacity: 0.65 })
        );
        ring.rotation.x = idx === 0 ? Math.PI / 3 : -Math.PI / 4;
        root.add(ring);
      });
    } else if (section === "scanner") {
      const shieldCore = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.85, 0),
        new THREE.MeshStandardMaterial({
          color: isScanning ? 0x38bdf8 : riskColor,
          emissive: isScanning ? 0x3b82f6 : riskColor,
          emissiveIntensity: 0.45,
          wireframe: false,
          metalness: 0.4,
          roughness: 0.2,
        })
      );
      root.add(shieldCore);

      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.25 + i * 0.35, 0.03, 12, 64),
          new THREE.MeshBasicMaterial({
            color: i === 0 ? 0x3b82f6 : i === 1 ? 0x8b5cf6 : riskColor,
            transparent: true,
            opacity: 0.8,
          })
        );
        ring.rotation.x = (i + 1) * 0.6;
        ring.rotation.y = i * 0.5;
        root.add(ring);
      }
    } else if (section === "transactions") {
      const positions = [
        [-1.6, 0.4, 0],
        [0, 0.8, 0.4],
        [1.6, 0.2, -0.2],
        [-0.8, -0.8, 0.3],
        [1.1, -0.7, 0.2],
      ];
      positions.forEach((pos, idx) => {
        const nodeColor = idx === 2 || idx === 4 ? riskColor : 0x3b82f6;
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(idx === 1 ? 0.35 : 0.24, 20, 20),
          new THREE.MeshStandardMaterial({ color: nodeColor, emissive: nodeColor, emissiveIntensity: 0.4 })
        );
        node.position.set(pos[0], pos[1], pos[2]);
        root.add(node);
      });
      const pts = positions.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
      const lineGeo = new THREE.BufferGeometry().setFromPoints([...pts, pts[0]]);
      root.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.75 })));
    } else if (section === "tokens") {
      const tokenColors = [0x10b981, 0xf59e0b, 0xef4444, 0x3b82f6];
      tokenColors.forEach((col, i) => {
        const angle = (i / tokenColors.length) * Math.PI * 2;
        const mesh = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.45, 0),
          new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.3, wireframe: i % 2 === 1 })
        );
        mesh.position.set(Math.cos(angle) * 1.45, Math.sin(angle) * 0.65, Math.sin(angle) * 0.6);
        root.add(mesh);
      });
      const center = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.45, 0.14, 64, 12),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.35 })
      );
      root.add(center);
    } else if (section === "contracts") {
      for (let i = 0; i < 4; i++) {
        const col = i === 3 && riskScore >= 50 ? 0xef4444 : i === 0 ? 0x10b981 : 0x3b82f6;
        const plate = new THREE.Mesh(
          new THREE.BoxGeometry(2.2, 1.3, 0.06),
          new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.28 + i * 0.12, wireframe: i === 2 })
        );
        plate.position.z = -0.9 + i * 0.55;
        root.add(plate);
      }
    } else if (section === "agents") {
      const hub = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.65, 0),
        new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, emissiveIntensity: 0.45 })
      );
      root.add(hub);
      const agentCols = [0x3b82f6, 0x10b981, 0xf59e0b, riskColor];
      agentCols.forEach((col, i) => {
        const a = (i / 4) * Math.PI * 2;
        const sat = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 20, 20),
          new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.4 })
        );
        sat.position.set(Math.cos(a) * 1.65, Math.sin(a) * 0.85, Math.sin(a) * 0.7);
        root.add(sat);
      });
    } else if (section === "reports") {
      const outerCube = new THREE.Mesh(
        new THREE.BoxGeometry(1.75, 1.75, 1.75),
        new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.7 })
      );
      root.add(outerCube);
      const innerSeal = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.8, 0),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.4 })
      );
      root.add(innerSeal);
    } else {
      const layerCols = [0x38bdf8, 0x3b82f6, 0x8b5cf6, 0x10b981, 0xf59e0b];
      layerCols.forEach((col, i) => {
        const plane = new THREE.Mesh(
          new THREE.BoxGeometry(2.1, 0.14, 1.4),
          new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.72 })
        );
        plane.position.y = -0.9 + i * 0.45;
        root.add(plane);
      });
    }

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      root.rotation.y += dx * 0.01;
      root.rotation.x += dy * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    let animId = 0;
    const speed = isScanning ? 0.025 + scanStage * 0.004 : 0.006;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotateRef.current && !isDragging) {
        root.rotation.y += speed;
        root.rotation.x = Math.sin(Date.now() * 0.0007) * 0.18;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 200;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [section, riskScore, isScanning, scanStage]);

  return (
    <div className="cyber-card p-4 mb-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center border border-blue-500/20 bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#11152c]">
      <div className="lg:col-span-5 relative h-48 sm:h-52 rounded-xl bg-[#060913]/80 border border-slate-800/80 overflow-hidden">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 border border-slate-700/70 text-[11px] font-medium text-sky-300">
          <Sparkles className="w-3 h-3 text-violet-400" />
          Interactive 3D Guide
        </div>
        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/85 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 transition"
          title="Toggle 3D auto-rotation"
        >
          {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {autoRotate ? "Pause Orbit" : "Orbit"}
        </button>
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Compass className="w-3.5 h-3.5" />
            Spatial Security Guide — Drag 3D Model to Inspect
          </div>
          <h2 className="text-lg font-semibold text-white">{meta.title}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{meta.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {meta.steps.map((step, idx) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`text-left p-2.5 rounded-lg border text-xs transition ${
                activeStep === idx
                  ? "bg-blue-500/15 border-blue-500/50 text-blue-200"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-800 text-[10px] font-bold text-sky-400 mr-1.5">
                {idx + 1}
              </span>
              {step}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>WebGL Three.js Engine • Interactive Prototype Guide</span>
          <span className="flex items-center gap-1 text-slate-400">
            <RotateCw className="w-3 h-3" /> Drag canvas to rotate 360°
          </span>
        </div>
      </div>
    </div>
  );
}
