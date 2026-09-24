import React, { useState } from "react";
import { Sliders, Cpu, Save, RefreshCw, Key, Sparkles } from "lucide-react";

export const PromptEngineeringView: React.FC = () => {
  const [model, setModel] = useState("gpt-4o");
  const [systemPrompt, setSystemPrompt] = useState("Tu es un agent conversationnel d'assistance client expert, chaleureux, concis et rigoureux.");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "10px 0" }}>
      <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 32px" }}>
        <h2 style={{ fontSize: "20px", color: "#f8fafc", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
          <Sliders size={20} color="#d946ef" /> Configuration du Moteur LLM & Prompts
        </h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: 24 }}>Ajustez les hyperparamètres du modèle de langage et le prompt système de l'agent.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Modèle LLM</label>
            <select value={model} onChange={e => setModel(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#0b0f19", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none" }}>
              <option value="gpt-4o">OpenAI GPT-4o (Multimodal & Rapide)</option>
              <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (Raisonnement)</option>
              <option value="gemini-1-5-pro">Google Gemini 1.5 Pro (Grand Contexte)</option>
              <option value="llama-3-70b">Meta Llama 3 70B (Open-Source)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Prompt Système Fondateur</label>
            <textarea rows={5} value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#cbd5e1", marginBottom: 6 }}>
                <span>Température : <b>{temperature}</b></span>
                <span style={{ color: "#94a3b8" }}>{temperature < 0.4 ? "Précis" : "Créatif"}</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} style={{ width: "100%" }} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#cbd5e1", marginBottom: 6 }}>
                <span>Max Tokens : <b>{maxTokens}</b></span>
              </div>
              <input type="range" min="256" max="4096" step="128" value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value))} style={{ width: "100%" }} />
            </div>
          </div>

          <button onClick={handleSave} style={{ alignSelf: "flex-start", background: saved ? "#10b981" : "#d946ef", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: "13px", display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <Save size={15} /> {saved ? "Configuration Enregistrée !" : "Enregistrer la Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
};
