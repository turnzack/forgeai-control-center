import React, { useState, useMemo } from "react";
import { Article } from "../types";
import { Search, Plus, BookOpen, Clock, Tag, ThumbsUp, MessageSquare, Sparkles } from "lucide-react";

interface UniversalAppProps {
  onSelectArticle?: (article: Article) => void;
  onNewArticle?: () => void;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: "art-1",
    slug: "architecture-react-moderne",
    title: "Architecture React & Next.js : Le Guide Ultime des Pépites Modulaires",
    excerpt: "Découvrez comment structurer vos applications industrielles avec les 40 composants extraits et assemblés d'office.",
    content: "Dans le développement moderne, la modularité et la séparation des responsabilités sont la clé. En isolant les composants dans src/features et src/components, on garantit une maintenabilité et une évolutivité sans faille...",
    author: "Alexandre Dev",
    category: "Architecture & IA",
    tags: ["React", "TypeScript", "Vite", "Pépites"],
    status: "published",
    publishedAt: "2026-09-21",
    readTimeMinutes: 5,
    metrics: { views: 2450, rating: 4.9, commentsCount: 14 }
  },
  {
    id: "art-2",
    slug: "design-systems-accessibles",
    title: "Construire un Design System Accessible WCAG AA en 2026",
    excerpt: "Les principes fondamentaux pour concevoir des interfaces utilisables par tous avec un contraste et des tokens certifiés.",
    content: "L'accessibilité web n'est pas une option. L'utilisation de tokens CSS harmonisés et de composants accessibles dès la conception garantit une expérience utilisateur fluide et universelle...",
    author: "Sarah Design",
    category: "Design & UX",
    tags: ["Design System", "WCAG", "CSS", "UI"],
    status: "published",
    publishedAt: "2026-09-22",
    readTimeMinutes: 4,
    metrics: { views: 1820, rating: 4.8, commentsCount: 8 }
  },
  {
    id: "art-3",
    slug: "orchestration-micro-agents",
    title: "Orchestration de Micro-Agents IA : Du Prototype au Déploiement",
    excerpt: "Retour d'expérience sur le pilotage autonome et le câblage temps réel des flux de données IA.",
    content: "L'intelligence artificielle générative franchit un cap décisif lorsqu'elle est orchestrée sous forme d'agents spécialisés autonomes travaillant de concert...",
    author: "Équipe ForgeAI",
    category: "IA & Automatisation",
    tags: ["Agents IA", "LLM", "Orchestration"],
    status: "published",
    publishedAt: "2026-09-23",
    readTimeMinutes: 7,
    metrics: { views: 3100, rating: 5.0, commentsCount: 22 }
  }
];

export const UniversalApp: React.FC<UniversalAppProps> = ({ onSelectArticle, onNewArticle }) => {
  const [articles] = useState<Article[]>(MOCK_ARTICLES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", "Architecture & IA", "Design & UX", "IA & Automatisation"];

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchCat = selectedCategory === "Tous" || a.category === selectedCategory;
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [articles, search, selectedCategory]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* En-tête du flux */}
      <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 700, color: "#38bdf8", background: "rgba(56,189,248,0.15)", padding: "3px 10px", borderRadius: 20 }}>
            <Sparkles size={13} /> UNIVERSAL_APP
          </div>
          <h1 style={{ margin: "10px 0 6px", fontSize: "24px", color: "#f8fafc" }}>✍️ PACK TEXTE</h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Flux d'articles éditoriaux, commentaires interactifs et 40 pépites connectées.</p>
        </div>
        {onNewArticle && (
          <button onClick={onNewArticle} style={{ background: "#3B82F6", color: "#000", border: "none", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: "13px", display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={16} /> Rédiger un Article
          </button>
        )}
      </div>

      {/* Barre de recherche et catégories */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: "12px", fontWeight: selectedCategory === cat ? 700 : 500, cursor: "pointer", background: selectedCategory === cat ? "#3B82F6" : "rgba(255,255,255,0.04)", color: selectedCategory === cat ? "#000" : "#cbd5e1", border: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px", minWidth: 260 }}>
          <Search size={15} color="#94a3b8" />
          <input placeholder="Rechercher un article..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "12px", outline: "none", width: "100%" }} />
        </div>
      </div>

      {/* Grille d'articles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
        {filtered.map(article => (
          <div key={article.id} onClick={() => onSelectArticle && onSelectArticle(article)} style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer", transition: "transform 0.15s ease", borderTop: "3px solid #3B82F6" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#3B82F6", background: "rgba(56,189,248,0.1)", padding: "2px 8px", borderRadius: 4 }}>{article.category}</span>
                <span style={{ fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {article.readTimeMinutes} min</span>
              </div>
              <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", margin: "0 0 10px", lineHeight: 1.4 }}>{article.title}</h2>
              <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 16px" }}>{article.excerpt}</p>
            </div>
            <div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                {article.tags.map(t => (
                  <span key={t} style={{ fontSize: "10px", color: "#94a3b8", background: "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: 4 }}><Tag size={10} style={{ display: "inline", marginRight: 4 }} />{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                <span style={{ fontSize: "11px", color: "#cbd5e1" }}>Par <b>{article.author}</b></span>
                <div style={{ display: "flex", gap: 12, fontSize: "11px", color: "#94a3b8" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ThumbsUp size={12} /> {article.metrics.views}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageSquare size={12} /> {article.metrics.commentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};