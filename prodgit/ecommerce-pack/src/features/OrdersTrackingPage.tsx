import React from "react";
import { Package, Clock, CheckCircle2, Truck, Download } from "lucide-react";

export const OrdersTrackingPage: React.FC = () => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px 0" }}>
      <h1 style={{ fontSize: "24px", color: "#f8fafc", margin: "0 0 6px" }}>📦 Mes Commandes & Suivi de Livraison</h1>
      <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: 24 }}>Consultez vos commandes récentes et téléchargez vos factures.</p>
      <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 14, marginBottom: 16 }}>
          <b>Commande #CMD-2026-9842</b>
          <span style={{ fontSize: "11px", color: "#38bdf8", background: "rgba(56,189,248,0.15)", padding: "3px 8px", borderRadius: 4 }}><Truck size={12} style={{ display: "inline", marginRight: 4 }} />En acheminement</span>
        </div>
        <p style={{ fontSize: "13px", color: "#cbd5e1" }}>Livraison estimée sous 48h par Colissimo Suivi.</p>
      </div>
    </div>
  );
};