> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Réseaux Sociaux et Mobile-First Design.
> Ce document est le PRD (Product Requirements Document) du **PACK MOBILE SOCIAL SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface Fluide, Addictive et Axée sur l'UGC (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 📱 PACK MOBILE SOCIAL (Réseau Social & Flux)

Ce pack force la création d'interfaces sociales (façon Instagram, Twitter ou TikTok). L'objectif est la consommation rapide de contenu (Scroll infini) et la facilitation de la création de contenu par l'utilisateur (UGC).

---

## 🎯 La Mission Principale (Architecture Sociale)

**Mission :** Générer une application mobile avec un flux d'actualité continu et des interactions sociales instantanées.
L'application doit privilégier les gestes tactiles (Double-tap to like) et charger les médias de manière asynchrone pour ne jamais bloquer l'interface.

### 🧩 Core Features Architecturaux Requis :
1. **Feed (Flux d'actualité) :** Liste verticale infinie (Infinite Scroll) avec préchargement (Prefetching) des prochains posts.
2. **Interactions Rapides :** Boutons Like (Cœur qui s'anime), Commentaire, et Partage sous chaque post.
3. **Profil Utilisateur :** Grille photo (Grid view) et biographie (Stats: Followers/Following).
4. **Création de Contenu (Post/Upload) :** Bouton central proéminent (FAB) ouvrant une modale plein écran pour publier une photo/texte.

---

## 🎨 Vision UI/UX & Design System Social
* **Directives pour Stitch :** Les bordures doivent disparaître. Le contenu (Image/Texte) doit toucher les bords de l'écran (Full-bleed) pour un effet immersif.
* **Micro-interactions :** Animations de "Like" explosives (`framer-motion`), transitions douces entre les onglets.

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un clone d'Instagram", tu dois utiliser ce squelette social et implémenter la navigation par onglets (Bottom Tab).*

[INSTRUCTION IA]
Génère une architecture de Réseau Social :
- Optimisation absolue des listes (Virtualization via `react-window` ou `FlashList`).
- Gestion optimisée du cache d'images (Lazy loading).
- Skeleton loaders reproduisant exactement la forme d'un post pendant le chargement réseau.

[STRUCTURE REQUISE]
- `src/features/social/pages/FeedPage.tsx`
- `src/features/social/pages/UserProfile.tsx`
- `src/features/social/components/PostCard.tsx`
- `src/features/social/components/LikeAnimation.tsx`