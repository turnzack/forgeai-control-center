> **DIRECTIVE SYSTÈME POUR L'IA (DEEPSEEK / STITCH)**
> Tu agis en tant qu'Architecte Logiciel Senior (Niveau Staff Engineer) spécialisé en Algorithmes de Flux et Engagement Utilisateur.
> Ce document est le PRD (Product Requirements Document) du **PACK FEED SOCIAL SOUVERAIN**. Ton rôle est d'analyser cette mission et d'en déduire une **Interface de Consommation de Contenu Addictive (UI/UX)**, tout en respectant strictement les règles métier ci-dessous.

# 🔄 PACK FEED SOCIAL (Flux d'Actualité)

Ce pack force la création exclusive de composants liés au "Feed" (Le mur d'actualités). C'est le cœur nucléaire de toute application sociale moderne (X/Twitter, LinkedIn, Facebook).

---

## 🎯 1. Les Modules Architecturaux Disponibles

Si l'utilisateur demande à implémenter ce pack, voici les briques (Missions) que tu peux générer :

### 📜 1. Feed Infini (`prd_feed_infinite`)
**Mission :** Feed infini optimisé (pagination, cache).
**Design Requis :** Liste de posts, avec un loader subtil en bas qui disparaît quand les nouveaux éléments sont chargés.

### ⭕ 2. Stories Bar (`prd_feed_stories`)
**Mission :** Stories bar + viewer full-screen.
**Design Requis :** Bandeau horizontal glissant en haut de l'écran avec des avatars cerclés de dégradés colorés.

### ❤️ 3. Réactions Avancées (`prd_feed_reactions`)
**Mission :** Réactions emoji + likes + counters.
**Design Requis :** Survol prolongé (Long press / Hover) pour ouvrir une pilule flottante (Popover) de choix d'emojis (Façon Facebook/LinkedIn).

### 💬 4. Threads Mobiles (`prd_feed_threads`)
**Mission :** Thread de commentaires mobile.
**Design Requis :** Liste de commentaires imbriqués (Nested replies) avec lignes de connexion visuelles à gauche.

### 🔖 5. Éléments Sauvegardés (`prd_feed_bookmarks`)
**Mission :** Section éléments sauvegardés.
**Design Requis :** Grille des posts mis en favoris pour lecture ultérieure.

### 🔍 6. Filtres Sticky (`prd_feed_filters`)
**Mission :** Barre filtres sticky en haut du feed.
**Design Requis :** Menu "Pour vous" / "Abonnements" qui reste accroché (Sticky) sous le header au défilement.

### 💸 7. Slots Sponsors (`prd_feed_sponsors`)
**Mission :** Intégrer slots sponsors dans feed.
**Design Requis :** Post déguisé avec une subtile mention "Promoted" ou "Sponsorisé" en haut à droite.

### 🎥 8. Auto-Play Média (`prd_feed_media`)
**Mission :** Mix texte + images + vidéo auto-play.
**Design Requis :** Les vidéos se lancent silencieusement (Muted) lorsqu'elles sont à 50% visibles dans le viewport.

### #️⃣ 9. Vue par Hashtags (`prd_feed_hashtags`)
**Mission :** Vue par hashtag / tags.
**Design Requis :** Le hashtag cliqué devient un Header géant en haut de page filtrant tout le flux.

### 🔔 10. Teaser Notifications (`prd_feed_notifications`)
**Mission :** Teaser notifications en haut du feed.
**Design Requis :** Pilule bleue flottante (Pill) indiquant "↑ 3 nouveaux posts".

---

## 🎨 2. Vision UI/UX & Design System Feed
* **Directives pour Stitch :** Les bordures entre les posts doivent être très légères (ex: `border-b border-zinc-200`). Le fond de l'application est légèrement gris, et les posts sont blancs pour se détacher (Ou inversement en Dark Mode).

---

### 🔄 INSTRUCTION DE FUSION (Pour l'Orchestrateur API)
*Si l'utilisateur demande "Crée moi un clone de Twitter", déploie cette architecture stricte centrée sur le texte et le scroll.*

[INSTRUCTION IA]
Génère une architecture de Feed Social :
- Optimisation des re-renders : Chaque post doit être un composant React memoïsé (`React.memo`) car le flux va en contenir des centaines.
- Intégration de `IntersectionObserver` pour l'Auto-play vidéo et l'Infinite Scroll.
- Skeleton UI très précis imitant la forme exacte du contenu attendu.

[STRUCTURE REQUISE]
- `src/features/feed/components/InfiniteFeedList.tsx`
- `src/features/feed/components/SocialPostCard.tsx`
- `src/features/feed/components/StoriesBar.tsx`
- `src/features/feed/hooks/useInfiniteFeed.ts`