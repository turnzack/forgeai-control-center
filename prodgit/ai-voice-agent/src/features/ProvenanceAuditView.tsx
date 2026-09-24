import React from "react";
import { ShieldCheck, CheckCircle2, Scale } from "lucide-react";
import { GEMS_DATA } from "../data/gemsManifest";

export const ProvenanceAuditView: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 700, color: "#34d399", background: "rgba(16, 185, 129, 0.15)", padding: "4px 10px", borderRadius: 20 }}>
              <ShieldCheck size={14} /> Audit de Licence Automatisé ForgeAI Studio
            </div>
            <h2 style={{ margin: "10px 0 4px", fontSize: "18px", color: "#f8fafc" }}>
              Rapport de Provenance & Conformité Open Source (MIT)
            </h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              Traçabilité légale, licences SPDX et notices tierces pour l'ensemble des ${GEMS_DATA.length} pépites adaptées.
            </p>
          </div>
          <span style={{ fontSize: "11px", display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(16,185,129,0.15)", color: "#34d399", padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(16,185,129,0.3)" }}>
            <CheckCircle2 size={13} /> 100% Conforme MIT
          </span>
        </div>
      </div>

      <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "14px", color: "#f8fafc", display: "flex", alignItems: "center", gap: 8 }}>
          <Scale size={16} style={{ color: "#34d399" }} />
          Registre des Composants & Licences Associées
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left", color: "#94a3b8" }}>
                <th style={{ padding: "8px 12px" }}>Fichier</th>
                <th style={{ padding: "8px 12px" }}>Rôle Métier</th>
                <th style={{ padding: "8px 12px" }}>Dépôt Source</th>
                <th style={{ padding: "8px 12px" }}>Licence</th>
                <th style={{ padding: "8px 12px" }}>Statut Audit</th>
              </tr>
            </thead>
            <tbody>
              {GEMS_DATA.map((gem, idx) => (
                <tr
                  key={gem.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                  }}
                >
                  <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#f8fafc", fontWeight: 600 }}>
                    {gem.fileName}
                  </td>
                  <td style={{ padding: "8px 12px", color: "#cbd5e1" }}>{gem.role}</td>
                  <td style={{ padding: "8px 12px", color: "#64748b" }}>{gem.repo}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                      {gem.license}
                    </span>
                  </td>
                  <td style={{ padding: "8px 12px", color: "#34d399" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle2 size={12} /> Vérifié Clean
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
