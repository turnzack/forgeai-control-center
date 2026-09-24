import React from "react";
import { MOUNTED_MANIFEST } from "../integrations";
import { Code2, ShieldCheck } from "lucide-react";

export const IntegratedModulesPage: React.FC = () => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px 0" }}>
      <h2 style={{ fontSize: "20px", color: "#f8fafc", margin: "0 0 6px" }}>🧩 Modules & Briques GitHub Intégrés dans src/</h2>
      <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: 20 }}>Composants open-source adaptés dans src/integrations/ et branchés dans l'application.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
        {MOUNTED_MANIFEST.map((m, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc" }}><Code2 size={13} style={{ display: "inline", marginRight: 6, color: "#10b981" }} />{m.fileName}</div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>{m.repo}</div>
            </div>
            <span style={{ fontSize: "9px", color: "#38bdf8", background: "rgba(56,189,248,0.15)", padding: "2px 6px", borderRadius: 4 }}>{m.license}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
