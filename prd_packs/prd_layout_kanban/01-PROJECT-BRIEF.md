# PROJECT BRIEF — Kanban Layout

## 1. Nom du produit
**Kanban Layout**

## 2. Résumé
Layout Kanban spécialisé gestion de projets. Solution métier dans le domaine **Gestion de Tâches & Kanban**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les outils de gestion de tâches existants imposent des structures rigides, manquent de drag-and-drop fluide, ne gèrent pas les sous-tâches et dépendances, et n'offrent pas de vue calendrier pour visualiser les échéances.

## 4. Personas
- Chef de projet : crée des boards, assigne des membres, suit l'avancement global.
- Contributeur : voit ses tâches assignées, change le statut via drag-and-drop, commente.
- Stakeholder : vue reporting (burndown, vélocité) sans modifier les tâches.

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
Productif, ergonomique, coloré. Sans-serif (Inter), fond gris très clair (#F1F5F9), accents ambre/rose (#F59E0B / #E11D48). Cartes blanches avec border-l coloré par priorité. Drag-and-drop avec placeholder bleu. Densité d'information optimisée, raccourcis clavier partout.
- Palette dominante : `#F59E0B` (primaire), `#E11D48` (accent), fond `#F1F5F9`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Task` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
