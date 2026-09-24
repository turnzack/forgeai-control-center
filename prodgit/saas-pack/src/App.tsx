import React, { useState } from "react";
import { SaasDashboard } from "./features/SaasDashboard";
import { AnimatedGradient } from "./animation/AnimatedGradient";
import { AnimatedLogo } from "./animation/AnimatedLogo";
import { ParticleField } from "./animation/ParticleField";
import { AnimatedContainer } from "./animation/AnimatedContainer";
import { AnimatedCube } from "./components/3d/AnimatedCube";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  Sparkles,
  Activity,
} from "lucide-react";

type Tab = "dashboard" | "billing" | "team" | "settings";

export function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("dashboard");

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard KPIs", icon: <LayoutDashboard size={14} /> },
    { id: "billing", label: "Facturation & Plans", icon: <CreditCard size={14} /> },
    { id: "team", label: "Équipe & Rôles", icon: <Users size={14} /> },
    { id: "settings", label: "Paramètres Espace", icon: <Settings size={14} /> },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#f8fafc",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <AnimatedGradient intensity={0.65} />
      <ParticleField />

      <header
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(11, 15, 25, 0.85)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "10px 24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <AnimatedLogo label="🛒 PACK E-COMMERCE" />
            <span
              style={{
                fontSize: "11px",
                background:
                  "linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)",
                border: "1px solid rgba(14, 165, 233, 0.4)",
                color: "#38bdf8",
                padding: "3px 10px",
                borderRadius: 14,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Sparkles size={11} color="#10B981" /> SaaS Souverain Actif
            </span>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 6,
              background: "rgba(255, 255, 255, 0.03)",
              padding: 4,
              borderRadius: 12,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              overflowX: "auto",
            }}
          >
            {TABS.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 15px",
                    borderRadius: 9,
                    fontSize: "12.5px",
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    background: isActive
                      ? "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)"
                      : "transparent",
                    color: isActive ? "#ffffff" : "#94a3b8",
                    border: "none",
                    boxShadow: isActive
                      ? "0 4px 15px rgba(14, 165, 233, 0.4)"
                      : "none",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              title="Moteur SaaS 3D ForgeAI actif"
            >
              <AnimatedCube size={28} />
            </div>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "11px",
                color: "#34d399",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "5px 12px",
                borderRadius: 20,
              }}
            >
              <Activity size={12} />
              <span>Production Prête</span>
            </span>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "24px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <AnimatedContainer key={currentTab} animation="fade-in" delay={40}>
          {(currentTab === "dashboard" ||
            currentTab === "billing" ||
            currentTab === "team") && (
            <SaasDashboard defaultTab={currentTab as any} />
          )}

          {currentTab === "settings" && (
            <div
              style={{
                padding: "32px",
                background: "rgba(15, 23, 42, 0.75)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 style={{ color: "#f8fafc", margin: "0 0 10px" }}>
                Paramètres de l'Espace Workspace
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.6 }}>
                Configuration des clés d'API, webhooks Stripe et préférences de sécurité SSO.
              </p>
            </div>
          )}
        </AnimatedContainer>
      </main>
    </div>
  );
}

export default App;