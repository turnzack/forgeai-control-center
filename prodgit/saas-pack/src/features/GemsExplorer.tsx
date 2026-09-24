import React, { useState } from "react";
import { GEMS_DATA, GEMS_CATEGORIES, GemItem } from "../data/gemsManifest";
import { Search, FileCode2, Copy, Check, ShieldCheck, Code, ChevronRight } from "lucide-react";

interface GemsExplorerProps {
  onNavigateToPage?: (tab: string) => void;
  onApplyGemToProject?: (gem: any, tab: string) => void;
}

export const GemsExplorer: React.FC<GemsExplorerProps> = ({ onNavigateToPage, onApplyGemToProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [activeGem, setActiveGem] = useState<GemItem>(GEMS_DATA[0] || null);
  const [copied, setCopied] = useState<boolean>(false);

  const filteredGems = GEMS_DATA.filter((gem) => {
    const matchCat = selectedCategory === "all" || gem.category === selectedCategory;
    const matchSearch =
      gem.fileName.toLowerCase().includes(search.toLowerCase()) ||
      gem.role.toLowerCase().includes(search.toLowerCase()) ||
      gem.targetPath.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopyCode = () => {
    if (!activeGem) return;
    navigator.clipboard.writeText(activeGem.fullCode || activeGem.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 700, color: "#34d399", background: "rgba(16, 185, 129, 0.15)", padding: "4px 10px", borderRadius: 20 }}>
              <ShieldCheck size={14} /> {GEMS_DATA.length} Pépites Montées & Câblées (Licence MIT Clean)
            </div>
            <h2 style={{ margin: "10px 0 4px", fontSize: "18px", color: "#f8fafc" }}>
              Explorateur Exhaustif des Pépites & Composants
            </h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              Tous les modules adaptés depuis les sources GitHub avec mentions de provenance, rôles et intégrations directes.
            </p>
          </div>

          <div style={{ position: "relative", width: 260 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
            <input
              type="text"
              placeholder="Rechercher par nom, rôle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 34px",
                borderRadius: 8,
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#f8fafc",
                fontSize: "12px",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
          {GEMS_CATEGORIES.filter(c => c.count > 0 || c.key === "all").map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                background: selectedCategory === cat.key ? "rgba(99, 102, 241, 0.3)" : "rgba(255,255,255,0.04)",
                border: selectedCategory === cat.key ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.08)",
                color: selectedCategory === cat.key ? "#c7d2fe" : "#94a3b8",
              }}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 420px) 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 14, maxHeight: "750px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", padding: "4px 8px", textTransform: "uppercase" }}>
            {filteredGems.length} Composant(s) disponible(s)
          </div>

          {filteredGems.map((gem) => {
            const isSelected = activeGem?.id === gem.id;
            return (
              <div
                key={gem.id}
                onClick={() => setActiveGem(gem)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: isSelected ? "rgba(99, 102, 241, 0.18)" : "rgba(255,255,255,0.02)",
                  border: isSelected ? "1px solid rgba(99, 102, 241, 0.5)" : "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <FileCode2 size={14} style={{ color: isSelected ? "#818cf8" : "#94a3b8", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: isSelected ? "#f8fafc" : "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {gem.fileName}
                    </span>
                    <span style={{ fontSize: "9px", background: "rgba(16,185,129,0.15)", color: "#34d399", padding: "1px 5px", borderRadius: 4 }}>
                      MIT
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: isSelected ? "#c7d2fe" : "#64748b", marginTop: 4 }}>
                    {gem.role}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6, fontSize: "10px", color: "#64748b" }}>
                    <span>{gem.linesCount} lignes</span>
                    <span>•</span>
                    <span>{(gem.sizeBytes / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: isSelected ? "#818cf8" : "#475569", flexShrink: 0 }} />
              </div>
            );
          })}
        </div>

        {activeGem && (
          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#f8fafc", fontFamily: "monospace" }}>
                    {activeGem.fileName}
                  </h3>
                  <span style={{ fontSize: "10px", background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                    {activeGem.role}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: 4 }}>
                  Origine : <strong>{activeGem.repo}</strong> · Emplacement : <code style={{ color: "#cbd5e1" }}>{activeGem.targetPath}</code>
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                style={{
                  background: copied ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
                  color: copied ? "#34d399" : "#cbd5e1",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: "11px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copié !" : "Copier le code"}
              </button>
            </div>

            <div style={{ background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: "11px", color: "#c7d2fe" }}>
                Import TypeScript direct :
                <code style={{ marginLeft: 8, background: "rgba(0,0,0,0.4)", padding: "2px 6px", borderRadius: 4, color: "#38bdf8" }}>
                  {`import { ... } from "@/${activeGem.targetPath.replace(/^src\//, '').replace(/\.(ts|tsx|js|jsx)$/, '')}";`}
                </code>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#090d16", padding: "8px 14px", borderTopLeftRadius: 8, borderTopRightRadius: 8, border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
                  <Code size={13} style={{ color: "#38bdf8" }} /> Code source complet audité
                </span>
                <span style={{ fontSize: "10px", color: "#64748b" }}>{activeGem.linesCount} lignes</span>
              </div>
              <pre
                style={{
                  margin: 0,
                  background: "#050811",
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: 16,
                  maxHeight: "460px",
                  overflowY: "auto",
                  fontFamily: "Consolas, Monaco, monospace",
                  fontSize: "11px",
                  lineHeight: 1.5,
                  color: "#cbd5e1",
                  whiteSpace: "pre",
                }}
              >
                {activeGem.fullCode || activeGem.codeSnippet}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
