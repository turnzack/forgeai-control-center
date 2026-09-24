import React, { useState } from "react";
import { Article, Comment } from "../types";
import { ArrowLeft, Clock, MessageSquare, ThumbsUp, Bookmark, Share2, Send, Check } from "lucide-react";

interface ArticleReaderProps {
  article: Article;
  onBackToFeed: () => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onBackToFeed }) => {
  const [comments, setComments] = useState<Comment[]>([
    { id: "c1", author: "Marc Leroy", text: "Article très clair et inspirant ! Les pépites modulaires font gagner un temps fou.", createdAt: "Il y a 2h" },
    { id: "c2", author: "Claire Martin", text: "Excellente analyse, j'applique cette architecture dès demain sur mon projet.", createdAt: "Il y a 30m" }
  ]);
  const [newComment, setNewComment] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, { id: Date.now().toString(), author: "Visiteur Connecté", text: newComment.trim(), createdAt: "À l'instant" }]);
    setNewComment("");
  };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 28, padding: "10px 0" }}>
      <button onClick={onBackToFeed} style={{ alignSelf: "flex-start", background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "13px", fontWeight: 700 }}>
        <ArrowLeft size={16} /> Retour au flux des articles
      </button>

      {/* En-tête Article */}
      <header>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", background: "rgba(56,189,248,0.15)", padding: "2px 8px", borderRadius: 4 }}>{article.category}</span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>•</span>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}><Clock size={12} style={{ display: "inline", marginRight: 4 }} />Lecture {article.readTimeMinutes} min</span>
        </div>
        <h1 style={{ fontSize: "30px", fontWeight: 900, color: "#f8fafc", lineHeight: 1.3, margin: "0 0 16px" }}>{article.title}</h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16 }}>
          <div style={{ fontSize: "12px", color: "#cbd5e1" }}>Par <b style={{ color: "#fff" }}>{article.author}</b> · Publié le {article.publishedAt}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setLiked(l => !l)} style={{ background: liked ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)", border: liked ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)", color: liked ? "#34d399" : "#cbd5e1", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <ThumbsUp size={13} /> {article.metrics.views + (liked ? 1 : 0)}
            </button>
            <button onClick={() => setBookmarked(b => !b)} style={{ background: bookmarked ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.05)", border: bookmarked ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)", color: bookmarked ? "#38bdf8" : "#cbd5e1", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <Bookmark size={13} /> {bookmarked ? "Enregistré" : "Sauvegarder"}
            </button>
          </div>
        </div>
      </header>

      {/* Corps de l'Article */}
      <article style={{ fontSize: "16px", color: "#e2e8f0", lineHeight: 1.8, background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "32px 36px" }}>
        <p style={{ fontSize: "17px", fontWeight: 600, color: "#38bdf8", marginBottom: 24 }}>{article.excerpt}</p>
        <p style={{ marginBottom: 20 }}>{article.content}</p>
        <p style={{ marginBottom: 20 }}>L'avantage décisif d'un projet assemblé avec le moteur ForgeAI réside dans la standardisation : chaque composant monté depuis les dépôts open-source est immédiatement audité, réutilisable et disponible dans l'onglet des pépites sans aucune configuration manuelle.</p>
        <div style={{ display: "flex", gap: 8, marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {article.tags.map(t => (
            <span key={t} style={{ fontSize: "11px", color: "#38bdf8", background: "rgba(56,189,248,0.1)", padding: "4px 10px", borderRadius: 6 }}>#{t}</span>
          ))}
        </div>
      </article>

      {/* Section Commentaires */}
      <section style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: "17px", color: "#f8fafc", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <MessageSquare size={17} color="#38bdf8" /> Commentaires ({comments.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {comments.map(c => (
            <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <b style={{ fontSize: "12px", color: "#f8fafc" }}>{c.author}</b>
                <span style={{ fontSize: "10px", color: "#64748b" }}>{c.createdAt}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#cbd5e1", margin: 0 }}>{c.text}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddComment()} placeholder="Ajoutez un commentaire..." style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", outline: "none" }} />
          <button onClick={handleAddComment} style={{ background: "#38bdf8", color: "#000", border: "none", padding: "0 18px", borderRadius: 8, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Send size={14} /> Publier
          </button>
        </div>
      </section>
    </div>
  );
};