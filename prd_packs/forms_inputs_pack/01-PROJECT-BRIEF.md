# PROJECT BRIEF — Forms & Inputs Pack

## 1. Nom du produit
**Forms & Inputs Pack**

## 2. Résumé
Pack de formulaires avec validation avancée. Solution métier dans le domaine **Formulaires & Sondages**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les constructeurs de formulaires existants offrent des champs génériques sans logique conditionnelle, des validations limitées, et aucune analyse des soumissions (taux de complétion, drop-off).

## 4. Personas
- Créateur de formulaire : glisse-dépose des champs, définit des règles conditionnelles.
- Répondant : remplit le formulaire avec validation en temps réel, reçoit une confirmation.
- Analyste : consulte les soumissions, exporte en CSV, voit les taux de drop-off par champ.

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
Net, structuré, data-driven. Sans-serif (Inter), fond gris très clair (#F8FAFC), accents cyan (#0891B2). Builder en 3 colonnes (palette, canvas, settings). Champs avec bordures arrondies, focus ring cyan. Cards de statistiques en bento-grid. Tableaux denses avec hover states.
- Palette dominante : `#0891B2` (primaire), `#6366F1` (accent), fond `#F8FAFC`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Form` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
