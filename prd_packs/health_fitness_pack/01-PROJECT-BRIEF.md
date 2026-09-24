# PROJECT BRIEF — Health & Fitness

## 1. Nom du produit
**Health & Fitness**

## 2. Résumé
App de suivi fitness et santé. Solution métier dans le domaine **Application Mobile & PWA**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les web apps mobiles manquent de patterns natifs : pas de bottom navigation, pas de gestes swipe, pas de pull-to-refresh, et des notifications push mal intégrées au système d'exploitation.

## 4. Personas
- Utilisateur mobile : navigation par le pouce, gestes naturels, mode hors-ligne.
- Beta-testeur : reçoit les notifications push, teste les nouvelles fonctionnalités en avant-première.
- Admin : pousse des notifications ciblées, suit l'engagement par écran.

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
Mobile-first, natif, fluide. Sans-serif (Inter), fond blanc (#FFFFFF), accents teal (#06B6D4). Bottom nav fixe avec blur backdrop. Transitions entre écrans en slide horizontal. Tap targets minimum 44×44px. Safe areas iOS (notch) gérées via env(safe-area-inset-*).
- Palette dominante : `#06B6D4` (primaire), `#8B5CF6` (accent), fond `#FFFFFF`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Screen` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
