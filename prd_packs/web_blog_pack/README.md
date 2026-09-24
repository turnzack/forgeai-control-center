> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en SEO, Génération Statique (SSG) et Content Management.
> Ce document est le PRD (Product Requirements Document) du **PACK WEB BLOG SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Optimisée pour les Moteurs de Recherche (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📰 PACK WEB BLOG (Moteur de Blog SEO)

Ce pack force la création de plateformes de publication de contenu. La vitesse de chargement et la sémantique HTML sont les priorités absolues.

---

## 🎯 La Mission Principale (Architecture de Blog)

**Mission :** Générer un moteur de blog complet (Liste d'articles, Page article, Catégories, Auteur).
Le code généré doit être prêt pour être indexé par Google (Sémantique riche, balises Meta, données structurées).

### 🧩 Core Features Architecturaux Requis :
1. **Grille d'Articles (Blog Roll) :** Cartes avec image de couverture optimisée, date, temps de lecture estimé et tags.
2. **Page Article (Single Post) :** En-tête massif avec le titre. Corps du texte parfaitement formaté via `@tailwindcss/typography`.
3. **Composants d'Engagement :** Boîte d'inscription à la newsletter en bas de l'article, articles similaires (Related posts).
4. **Table des Matières (TOC) :** Menu latéral sticky généré automatiquement depuis les balises H2/H3.

---

## 🎨 Vision UI/UX & Design System Web Blog
* **Directives pour Stitch :** Un blog doit être une expérience de lecture apaisante. Limite la largeur du texte (ex: `max-w-2xl` ou `max-w-prose`) pour que l'œil n'ait pas à faire de grands mouvements. 
* **Typographie :** Utilise un contraste élevé (Texte `slate-900` sur fond `slate-50`).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*À utiliser quand l'utilisateur souhaite créer un blog d'entreprise ou personnel.*

[INSTRUCTION IA]
Génère une architecture de Blog SEO :
- Composants `Helmet` ou balises `next/head` pour les métadonnées SEO (Title, Description, OpenGraph).
- Support du format Markdown/MDX simulé ou réel.
- Rendu typographique professionnel (Citations en exergue, blocs de code, tableaux).

[STRUCTURE REQUISE]
- `src/features/blog/pages/BlogIndex.tsx`
- `src/features/blog/pages/BlogPost.tsx`
- `src/features/blog/components/PostCard.tsx`
- `src/features/blog/components/NewsletterCTA.tsx`
- `src/features/blog/components/TableOfContents.tsx`