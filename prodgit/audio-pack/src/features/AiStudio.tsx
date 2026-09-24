import React, { useState } from "react";
import { ChatMessage, VoiceSettings } from "../types";
import { Mic, MicOff, Send, Sparkles, Volume2, Bot, Play, Settings2 } from "lucide-react";

export const AiStudio: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", content: "Bonjour ! Je suis votre agent vocal intelligent. Comment puis-je vous assister aujourd'hui ?", timestamp: "10:00" }
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Réponse simulée
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Réponse analysée pour : "${userMsg.content}". Traitement vocal haute fidélité effectué.`,
        timestamp: new Date().toLocaleTimeString(),
        tokensUsed: 42
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: 800, color: "#D946EF", background: "rgba(217, 70, 239, 0.15)", padding: "2px 8px", borderRadius: 4 }}>
            ASSISTANT VOCAL & IA
          </span>
          <h1 style={{ margin: "4px 0 0 0", fontSize: "22px", color: "#f8fafc" }}>🎵 PACK AUDIO</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setIsRecording(!isRecording)}
            style={{ padding: "8px 16px", borderRadius: 20, background: isRecording ? "#ef4444" : "#D946EF", color: "#fff", border: "none", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 600 }}
          >
            {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
            <span>{isRecording ? "Écoute en cours..." : "Parler à l'Agent"}</span>
          </button>
        </div>
      </header>

      {/* Visualiseur d'ondes audio */}
      <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px", marginBottom: 20, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, height: 40 }}>
          {[12, 28, 45, 18, 55, 75, 40, 60, 25, 15, 40, 80, 50, 30, 65, 20].map((h, i) => (
            <span
              key={i}
              style={{
                width: 4,
                height: isRecording || isSpeaking ? `${h}%` : "15%",
                background: "#D946EF",
                borderRadius: 2,
                transition: "height 0.15s ease"
              }}
            />
          ))}
        </div>
        <small style={{ color: "#94a3b8", fontSize: "11px" }}>
          {isRecording ? "Capture audio active via WebRTC / AudioContext" : "Mode veille — cliquez sur 'Parler à l'Agent' ou écrivez un message"}
        </small>
      </div>

      {/* Chat Messages */}
      <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 18, height: "400px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: "flex", gap: 10, alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            {m.role === "assistant" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#D946EF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}><Bot size={15} /></div>}
            <div style={{ background: m.role === "user" ? "#D946EF" : "rgba(255,255,255,0.06)", padding: "10px 14px", borderRadius: 10, fontSize: "13px", color: "#f8fafc" }}>
              <div>{m.content}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: 4, textAlign: "right" }}>{m.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Envoyer une consigne ou poser une question..."
          style={{ flex: 1, padding: "12px 16px", borderRadius: 8, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px" }}
        />
        <button onClick={handleSend} style={{ background: "#D946EF", color: "#fff", border: "none", padding: "0 20px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};