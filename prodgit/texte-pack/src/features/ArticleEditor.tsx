import React, { useState } from "react";
import { Article } from "../types";
import { PenTool, Check, ArrowLeft } from "lucide-react";

interface ArticleEditorProps {
  onArticlePublished?: (article: Article) => void;
  onCancel?: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ onArticlePublished, onCancel }) => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Architecture & IA");
  const [author, setAuthor] = useState("Auteur Blog");
  const [tagsInput, setTagsInput] = useState("React, Innovation");
  const [published, setPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newArticle: Article = {
      id: "art-" + Date.now(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title,
      excerpt: excerpt || title,
      content,
      author: author || "Auteur Blog",
      category,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      status: "published",
      publishedAt: new Date().toISOString().slice(0, 10),
      readTimeMinutes: Math.max(1, Math.round(content.split(" ").length / 150)),
      metrics: { views: 1, rating: 5.0, commentsCount: 0 }
    };

    setPublished(true);
    setTimeout(() => {
      if (onArticlePublished) onArticlePublished(newArticle);
    }, 800);
  };

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", padding: "10px 0" }}>
      {onCancel && (
        <button onClick={onCancel} style={{ background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "13px", fontWeight: 700, marginBottom: 16 }}>
          <ArrowLeft size={16} /> Annuler et retour au flux
        </button>
      )}

      <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 32px" }}>
        <h2 style={{ fontSize: "20px", color: "#f8fafc", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
          <PenTool size={18} color="#38bdf8" /> Rédiger un Nouvel Article
        </h2>
        <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: 24 }}>Publiez du contenu directement dans le flux éditorial de votre application.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Titre de l'article *</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Les 5 règles d'or pour concevoir avec les pépites..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Catégorie</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#0b0f19", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}>
                <option value="Architecture & IA">Architecture & IA</option>
                <option value="Design & UX">Design & UX</option>
                <option value="IA & Automatisation">IA & Automatisation</option>
                <option value="Tutoriels & Guides">Tutoriels & Guides</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Auteur</label>
              <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Votre nom ou pseudonyme" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Extrait / Résumé introductif</label>
            <input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Courte synthèse pour la carte du flux..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Contenu complet *</label>
            <textarea required rows={7} value={content} onChange={e => setContent(e.target.value)} placeholder="Rédigez l'article complet ici..." style={{ width: "100%", padding: "12px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>Tags (séparés par virgule)</label>
            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="React, Vite, Architecture" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <button type="submit" disabled={published} style={{ background: published ? "#10b981" : "#38bdf8", color: "#000", border: "none", padding: "12px 24px", borderRadius: 10, cursor: published ? "default" : "pointer", fontWeight: 800, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
            {published ? <><Check size={16} /> Article Publié avec Succès !</> : <><PenTool size={16} /> Publier l'Article</>}
          </button>
        </form>
      </div>
    </div>
  );
};