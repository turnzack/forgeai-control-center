> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé dans l'édition numérique, les CMS (Content Management Systems) et le SEO.
> Ce document est le PRD (Product Requirements Document) du **PACK BLOG & CONTENU SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Visionnaire, Moderne et Ultra-Optimisée (UI/UX)** pour publier, lire et indexer du contenu, tout en respectant strictement les règles métier ci-dessous.

# 📰 PACK BLOG & CONTENU (L'Écosystème Éditorial)

Ce pack force la création de plateformes de publication modernes (façon Medium, The Verge ou Vercel Blog). L'application générée doit exceller dans la lisibilité (Typographie), la hiérarchisation de l'information (Grilles visuelles) et l'expérience de lecture (Long-form).

---

## 🎯 1. Les 10 Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les 10 briques métiers (Missions) que tu peux câbler et générer :

### 📖 1. Blog Style Magazine (`tmpl_blog_magazine_modern`)
**Mission :** Créer une page d'accueil d'actualités dense et structurée.
**Design Requis :** "Bento Grid" ou grilles asymétriques mettant en valeur les articles à la Une avec de grandes images (Cards visuelles).
**Composants à générer :** `MagazineGrid.tsx`, `CategoryNav.tsx`

### 🖋️ 2. Article Long-Format (`tmpl_blog_single_post_longform`)
**Mission :** Template de lecture immersive pour des essais ou des articles techniques.
**Design Requis :** Grande typographie (ex: serif élégant), colonne de texte centrale étroite (max-w-prose), et Table des Matières latérale collante (TOC sticky).
**Composants à générer :** `ArticleLayout.tsx`, `InlineToc.tsx`

### 📚 3. Hub de Séries d'Articles (`tmpl_blog_series_hub`)
**Mission :** Regrouper une suite d'articles liés (ex: "Apprendre React en 10 jours").
**Design Requis :** Cartes numérotées séquentiellement avec une barre de progression (Series progress) incitant à lire la suite.
**Composants à générer :** `SeriesList.tsx`, `SeriesProgress.tsx`

### 🗞️ 4. Espace Presse / Newsroom (`tmpl_blog_newsroom`)
**Mission :** Page dédiée aux relations publiques et communiqués.
**Design Requis :** Interface sobre, liste de communiqués datés, et grille de logos des parutions presse (Press mentions).
**Composants à générer :** `PressList.tsx`, `PressLogoRow.tsx`

### 📖 5. Portail de Documentation (`tmpl_blog_docs_landing`)
**Mission :** Page d'accueil pour la documentation technique d'un produit (façon Stripe Docs).
**Design Requis :** Grosse barre de recherche dominante au centre (Search-first UX), entourée de cartes de catégories (Guides, API, Tutoriels).
**Composants à générer :** `DocsLandingHero.tsx`, `DocsCategoryGrid.tsx`

### 📁 6. Bibliothèque de Ressources (`tmpl_blog_resource_library`)
**Mission :** Annuaire filtrable de contenus téléchargeables (e-books, templates, webinars).
**Design Requis :** Grille de cartes avec une barre latérale de filtres avancés (Thèmes, Formats, Années).
**Composants à générer :** `ResourceGrid.tsx`, `ResourceFilter.tsx`

### ⚡ 7. Mini Changelog (`tmpl_blog_changelog_mini`)
**Mission :** Afficher les mises à jour et nouveautés d'un produit (Release notes).
**Design Requis :** Frise chronologique compacte (Timeline) avec des badges colorés (Fix, Feature, Deprecated).
**Composants à générer :** `MiniChangelog.tsx`, `ChangeBadge.tsx`

### 🧑‍💻 8. Profil Auteur (`tmpl_blog_author_profile`)
**Mission :** Mettre en valeur le créateur de contenu.
**Design Requis :** En-tête avec biographie, liens sociaux, avatar, suivi de la grille infinie de ses publications.
**Composants à générer :** `AuthorHeader.tsx`, `AuthorPosts.tsx`

### 🎙️ 9. Blog Hybride (Audio + Texte) (`tmpl_blog_podcast_blog`)
**Mission :** Flux mixant articles écrits et épisodes de podcast.
**Design Requis :** Fil d'actualité avec des badges distinctifs (TypeBadge) pour différencier immédiatement un post à lire d'un post à écouter.
**Composants à générer :** `MixedFeed.tsx`, `TypeBadge.tsx`

### 🎟️ 10. Récapitulatifs d'Événements (`tmpl_blog_event_recaps`)
**Mission :** Gérer les archives de conférences, meetups ou webinars passés.
**Design Requis :** Cartes massives classées par édition/année, contenant des liens vers les vidéos ou les slides.
**Composants à générer :** `EventRecapCard.tsx`, `RecapGrid.tsx`

---

## 🎨 2. Vision UI/UX & Design System Global pour l'Éditorial
* **Directives pour Stitch :** Le contenu est roi. La hiérarchie typographique doit être irréprochable. Utilise des polices contrastées (ex: `font-serif` pour les titres, `font-sans` pour le corps du texte).
* **Lisibilité :** Implémente le mode sombre (Dark Mode) avec des fonds gris profonds (pas noirs purs) pour ne pas fatiguer les yeux lors de longues sessions de lecture. 
* **Micro-interactions :** Animations de "Reveal" (Framer Motion) douces lorsque l'utilisateur fait défiler la page vers le bas.

## ⚙️ 3. Directives de Câblage (VFS)
*Pour le SEO, génère des composants sémantiques HTML5 (`<article>`, `<section>`, `<aside>`). Prévois des props pour intégrer des métadonnées statiques (MDX ou CMS Headless) facilement. Utilise Tailwind Typography (`prose`) pour styliser automatiquement le contenu riche injecté.*

---
### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Je veux lancer un média Tech avec des tutos et un podcast", tu dois fusionner l'intelligence de `tmpl_blog_magazine_modern`, `tmpl_blog_podcast_blog` et `tmpl_blog_single_post_longform`. Ton output final doit structurer une architecture Next.js/React complète capable d'afficher cette richesse éditoriale dès le premier rendu.*