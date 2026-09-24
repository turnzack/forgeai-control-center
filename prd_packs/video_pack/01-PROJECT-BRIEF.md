# PROJECT BRIEF — Video Pack

## 1. Nom du produit
**Video Pack**

## 2. Résumé
Plateforme vidéo avec chapitres et chat. Solution métier dans le domaine **Vidéo & Streaming**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les plateformes vidéo génériques offrent un lecteur basique sans chapitres, pas de chat live, pas de sélecteur de qualité adaptatif, et des commentaires séparés du contexte de la vidéo.

## 4. Personas
- Spectateur : choisit la qualité, marque chapitres, commente, partage un timestamp.
- Créateur : upload, définit chapitres et thumbnail, modère les commentaires.
- Live streamer : interagit avec le chat live, voit le compte de viewers en direct.

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
Dark mode par défaut, focus sur la vidéo. Sans-serif (Inter), fond noir (#0A0A0A), accents rouge (#DC2626) pour le live et les CTAs. Lecteur cinématique en 16:9 avec contrôles qui fade-out après 3s. Sidebar chat à droite, commentaires en dessous. Cards vidéo avec hover preview animé.
- Palette dominante : `#DC2626` (primaire), `#F59E0B` (accent), fond `#0A0A0A`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Video` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
