# PROJECT BRIEF — Landing SaaS Pack

## 1. Nom du produit
**Landing SaaS Pack**

## 2. Résumé
Pack landing spécialisé SaaS B2B. Solution métier dans le domaine **Landing Page & Conversion**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les landing pages génériques ne convertissent pas : hero flou, absence de preuve sociale, pricing non comparatif, CTA faibles, et aucun système de waitlist ou d'A/B test intégré.

## 4. Personas
- Visiteur découvrant le produit : comprend la valeur en < 5 secondes, CTA visible.
- Marketeur : modifie le hero, les témoignages, le pricing sans déployer de code.
- Lead qualifié : s'inscrit à la waitlist ou demande une démo avec un formulaire ciblé.

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
Moderne, conversion-orienté, premium. Gradients violet→fuchsia, titres gras en Inter Display, fond blanc avec sections alternées (violet clair #FAF5FF). Hero avec mockup produit en perspective. Animations subtiles au scroll (fade-up). Boutons CTA avec glow.
- Palette dominante : `#7C3AED` (primaire), `#EC4899` (accent), fond `#FAF5FF`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Lead` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
