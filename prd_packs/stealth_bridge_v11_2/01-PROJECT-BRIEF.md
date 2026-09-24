# PROJECT BRIEF — Stealth Bridge v11.2

## 1. Nom du produit
**Stealth Bridge v11.2**

## 2. Résumé
Extension navigateur pour automatisation stealth. Solution métier dans le domaine **SaaS Dashboard & Analytics**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les dashboards SaaS existants juxtaposent des KPIs sans cohérence, manquent de drill-down, imposent des tables statiques non filtrables, et délèguent la facturation à des widgets tiers mal intégrés.

## 4. Personas
- Admin SaaS : métriques clés (MRR, churn, activation), gestion des rôles et abonnements.
- Membre d'équipe : accès à ses propres données, invitation de collaborateurs.
- Finance : historique des factures, export PDF, suivi des paiements Stripe.

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
Professionnel, dense en données. Police Inter, espacement compact, couleurs atténuées. Fond ardoise (#F8FAFC), bleu primaire (#2563EB). Tables avec hover states, badges colorés pour les statuts, sidebar fixe avec icônes et labels. Cards en bento-grid.
- Palette dominante : `#2563EB` (primaire), `#7C3AED` (accent), fond `#F8FAFC`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Metric` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
