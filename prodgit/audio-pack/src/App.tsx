import React, { useState } from "react";
import { AiStudio } from "./features/AiStudio";
import { PromptEngineeringView } from "./features/PromptEngineeringView";
import { GemsStudio } from "./features/GemsStudio";
import { Bot, Sliders, Sparkles, Activity } from "lucide-react";

export function App() {
  const [currentTab, setCurrentTab] = useState<"agent" | "prompts">("agent");

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#f8fafc", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <header style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(11, 15, 25, 0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, padding: "12px 24px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)", borderRadius: 10, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc" }}>🎵 PACK AUDIO</span>
                <span style={{ fontSize: "10px", background: "rgba(217, 70, 239, 0.2)", color: "#f472b6", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>Studio Agent IA</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Agent Conversationnel & Synthèse Vocale Temps Réel</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            <button onClick={() => setCurrentTab("agent")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "agent" ? 700 : 500, cursor: "pointer", background: currentTab === "agent" ? "#d946ef" : "transparent", color: currentTab === "agent" ? "#fff" : "#94a3b8", border: "none" }}><Bot size={14} /> Studio Agent IA</button>
            <button onClick={() => setCurrentTab("prompts")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: "12px", fontWeight: currentTab === "prompts" ? 700 : 500, cursor: "pointer", background: currentTab === "prompts" ? "#d946ef" : "transparent", color: currentTab === "prompts" ? "#fff" : "#94a3b8", border: "none" }}><Sliders size={14} /> Modèles & Prompts</button>
          </nav>

          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#34d399", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "4px 10px", borderRadius: 20 }}><Activity size={12} /> Modèle Connecté</span>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 20px" }}>
        {currentTab === "agent" && <AiStudio />}
        {currentTab === "prompts" && <PromptEngineeringView />}
      </main>
    </div>
  );
}

export default App;