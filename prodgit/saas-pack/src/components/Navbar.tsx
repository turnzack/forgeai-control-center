import React from "react";
import { Sparkles, Layers, Box, CheckCircle2 } from "lucide-react";

export function Navbar({ title, gemsCount }: { title: string; gemsCount: number }) {
  return (
    <header className="app-header">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #38bdf8, #10b981)", display: "grid", placeItems: "center", color: "#051119" }}>
          <Box size={18} />
        </div>
        <div>
          <b style={{ fontSize: 14, color: "#f8fafc" }}>{title}</b>
          <span style={{ display: "block", fontSize: 10, color: "#94a3b8" }}>ForgeAI Project Scaffold</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span className="badge">
          <Sparkles size={12} /> {gemsCount} pépites montées
        </span>
        <span style={{ fontSize: 11, color: "#34d399", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <CheckCircle2 size={13} /> Prêt au développement
        </span>
      </div>
    </header>
  );
}
