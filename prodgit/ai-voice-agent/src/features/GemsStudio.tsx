import React, { useState } from "react";
import { GemsExplorer } from "./GemsExplorer";
import { ProvenanceAuditView } from "./ProvenanceAuditView";
import { IntegratedModulesPage } from "./IntegratedModulesPage";
import { GEMS_DATA } from "../data/gemsManifest";
import { MOUNTED_MANIFEST } from "../integrations";
import { Layers, ShieldCheck, Code2 } from "lucide-react";

interface GemsStudioProps {
  onNavigateToPage?: (tab: string) => void;
  onApplyGemToProject?: (gem: any, tab: string) => void;
}

export const GemsStudio: React.FC<GemsStudioProps> = ({ onNavigateToPage, onApplyGemToProject }) => {
  const [subTab, setSubTab] = useState<"explorer" | "modules" | "audit">("explorer");

  const subTabs = [
    { id: "explorer", label: `🗂️ Bac à Sable Live (${GEMS_DATA.length} Pépites)`, icon: Layers, count: GEMS_DATA.length },
    { id: "modules", label: `🧩 Modules dans src/ (${MOUNTED_MANIFEST.length})`, icon: Code2, count: MOUNTED_MANIFEST.length },
    { id: "audit", label: "📑 Audit de Provenance MIT", icon: ShieldCheck, badge: "Certifié" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 14, overflowX: "auto" }}>
        {subTabs.map((tab) => {
          const isActive = subTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "12px",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                background: isActive ? "rgba(99, 102, 241, 0.2)" : "transparent",
                border: isActive ? "1px solid #6366f1" : "1px solid transparent",
                color: isActive ? "#fff" : "#94a3b8",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={15} style={{ color: isActive ? "#818cf8" : "#64748b" }} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.1)", padding: "1px 6px", borderRadius: 10, color: "#cbd5e1" }}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span style={{ fontSize: "9px", background: "rgba(16,185,129,0.15)", color: "#34d399", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div>
        {subTab === "explorer" && (
          <GemsExplorer
            onNavigateToPage={onNavigateToPage}
            onApplyGemToProject={onApplyGemToProject}
          />
        )}
        {subTab === "modules" && <IntegratedModulesPage />}
        {subTab === "audit" && <ProvenanceAuditView />}
      </div>
    </div>
  );
};
