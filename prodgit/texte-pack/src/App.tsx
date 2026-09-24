import React, { useState } from "react";
import { UniversalApp, MOCK_ARTICLES } from "./features/UniversalApp";
import { ArticleReader } from "./features/ArticleReader";
import { ArticleEditor } from "./features/ArticleEditor";
import { AnimatedGradient } from "./animation/AnimatedGradient";
import { AnimatedLogo } from "./animation/AnimatedLogo";
import { ParticleField } from "./animation/ParticleField";
import { AnimatedContainer } from "./animation/AnimatedContainer";
import { AnimatedCube } from "./components/3d/AnimatedCube";
import { Article } from "./types";
import { Newspaper, BookOpen, PenTool, Sparkles, Activity } from "lucide-react";

type Tab = "feed" | "reader" | "editor";

export function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("feed");
  const [selectedArticle, setSelectedArticle] = useState<Article>(MOCK_ARTICLES[0]);

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
      <AnimatedGradient intensity={0.6} />
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
            <AnimatedLogo label="✍️ PACK TEXTE" />
            <span
              style={{
                fontSize: "11px",
                background:
                  "linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                color: "#38bdf8",
                padding: "3px 10px",
                borderRadius: 14,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Sparkles size={11} color="#38bdf8" /> Édition & Contenu
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
            <button
              onClick={() => setCurrentTab("feed")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 15px",
                borderRadius: 9,
                fontSize: "12.5px",
                fontWeight: currentTab === "feed" ? 700 : 500,
                cursor: "pointer",
                background:
                  currentTab === "feed"
                    ? "linear-gradient(135deg, #38bdf8 0%, #10b981 100%)"
                    : "transparent",
                color: currentTab === "feed" ? "#000" : "#94a3b8",
                border: "none",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <Newspaper size={14} /> Flux d'Articles
            </button>
            <button
              onClick={() => setCurrentTab("reader")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 15px",
                borderRadius: 9,
                fontSize: "12.5px",
                fontWeight: currentTab === "reader" ? 700 : 500,
                cursor: "pointer",
                background:
                  currentTab === "reader"
                    ? "linear-gradient(135deg, #38bdf8 0%, #10b981 100%)"
                    : "transparent",
                color: currentTab === "reader" ? "#000" : "#94a3b8",
                border: "none",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <BookOpen size={14} /> Lecture
            </button>
            <button
              onClick={() => setCurrentTab("editor")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 15px",
                borderRadius: 9,
                fontSize: "12.5px",
                fontWeight: currentTab === "editor" ? 700 : 500,
                cursor: "pointer",
                background:
                  currentTab === "editor"
                    ? "linear-gradient(135deg, #38bdf8 0%, #10b981 100%)"
                    : "transparent",
                color: currentTab === "editor" ? "#000" : "#94a3b8",
                border: "none",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <PenTool size={14} /> Rédiger un Article
            </button>
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
              <Activity size={12} /> Prêt Publication
            </span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "24px 20px" }}>
        <AnimatedContainer key={currentTab} animation="fade-in" delay={40}>
          {currentTab === "feed" && (
            <UniversalApp
              onSelectArticle={(art) => {
                setSelectedArticle(art);
                setCurrentTab("reader");
              }}
              onNewArticle={() => setCurrentTab("editor")}
            />
          )}
          {currentTab === "reader" && (
            <ArticleReader
              article={selectedArticle}
              onBackToFeed={() => setCurrentTab("feed")}
            />
          )}
          {currentTab === "editor" && (
            <ArticleEditor
              onArticlePublished={(art) => {
                setSelectedArticle(art);
                setCurrentTab("reader");
              }}
              onCancel={() => setCurrentTab("feed")}
            />
          )}
        </AnimatedContainer>
      </main>
    </div>
  );
}

export default App;