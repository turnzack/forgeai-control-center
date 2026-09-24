> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Média Digital et Édition de Presse.
> Ce document est le PRD (Product Requirements Document) du **PACK BLOG MAGAZINE SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Éditoriale Majestueuse (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📰 PACK BLOG MAGAZINE (News & Éditorial)

Ce pack force la création d'architectures de type Média/Magazine en ligne (façon The Verge, Wired ou Vogue). L'information doit être hiérarchisée, visuellement frappante, et optimisée pour la lecture longue.

---

## 🎯 La Mission Principale (Média & News)

**Mission :** Générer un portail de news dynamique.
Le site généré doit savoir mettre en valeur "La Une" (Le gros article du jour) tout en laissant de la place pour les actualités secondaires dans une grille dense mais aérée.

### 🧩 Core Features Architecturaux Requis :
1. **Hero Article (La Une) :** Une image massive prenant 60% de l'écran avec un titre percutant superposé ou juste en dessous.
2. **Bento News Grid :** Une grille asymétrique (CSS Grid) d'articles secondaires.
3. **Catégorisation (Tags) :** Menus de navigation par catégories (Tech, Design, Business) avec surbrillance au défilement.
4. **Article Layout :** Une page de lecture (Single Post) parfaitement typographiée (Drop caps, citations en exergue, lettrines).

---

## 🎨 Vision UI/UX & Design System Éditorial
* **Directives pour Stitch :** Les magazines vivent de leur typographie. Utilise des polices Serif audacieuses (ex: Playfair Display ou Merriweather) pour les titres, et du Sans-Serif pour les métadonnées (Auteur, Date).
* **Hover Effects :** Au survol d'une carte d'article, l'image doit zoomer très légèrement (`scale-105 duration-300`) mais le conteneur ne doit pas bouger (`overflow-hidden`).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un webzine sur la technologie", déploie cette architecture éditoriale avec des données mockées très réalistes.*

[INSTRUCTION IA]
Génère une architecture Média & Magazine :
- CSS Grid complexe pour simuler la mise en page papier (Editorial Design).
- Typographie parfaite via `@tailwindcss/typography` (Classe `prose` sur les articles).
- Composants de "Share" (Partage social) et "Related Articles" (Articles similaires).
- Squelette SEO-ready (Balises sémantiques `<article>`, `<time>`, `<header>`).

[STRUCTURE REQUISE]
- `src/features/magazine/pages/MagazineHome.tsx`
- `src/features/magazine/pages/ArticleSingle.tsx`
- `src/features/magazine/components/HeroArticleCard.tsx`
- `src/features/magazine/components/NewsGrid.tsx`
- `src/features/magazine/components/AuthorByline.tsx`