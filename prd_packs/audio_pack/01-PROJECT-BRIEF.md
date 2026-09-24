# PROJECT BRIEF — Audio Pack

## 1. Nom du produit
**Audio Pack**

## 2. Résumé
Lecteur audio polyvalent avec playlists. Solution métier dans le domaine **Audio & Podcast Player**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les lecteurs audio web manquent de waveform interactif, de queue persistante entre sessions, de gestion des playlists collaboratives, et de raccourcis clavier pour le contrôle sans quitter la page.

## 4. Personas
- Auditeur : lit/pause, saute 15s, gère sa queue, marque ses favoris.
- Créateur de playlist : organise par mood, partage avec amis, collaborative.
- Podcasteur : upload ses épisodes, voit les stats d'écoute, répond aux commentaires.

## 5. Plateformes cibles
- Web Desktop (Chrome, Safari, Firefox, Edge) — expérience principale.
- Web Mobile & Tablette (PWA installable, navigation pouce-friendly).
- (Optionnel) Shell mobile natif via wrapper Capacitor si pertinent pour le métier.

## 6. Contraintes techniques
- Frontend : React 18 + TypeScript strict + Tailwind CSS 4 + shadcn/ui.
- Backend : Cloudflare Workers / Hono ou Node.js + tRPC.
- Persistance : Cloudflare D1 (SQLite) ou SQLite local pour le dev.
- Validation runtime : Zod (schémas partagés front/back).
- Zéro dépendance orpheline, build Vite déterministe.

## 7. Style visuel
Moderne, immersive, orange vibrante. Sans-serif (Inter), fond sombre préférable (#0F0F0F) pour la lecture nocturne, accents orange (#F97316). Waveform en gradient orange→rouge. Player en glassmorphism avec blur. Animations fluides sur les transitions de piste.
- Palette dominante : `#F97316` (primaire), `#EF4444` (accent), fond `#0F0F0F`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Track` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
