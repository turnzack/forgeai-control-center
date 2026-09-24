# PROJECT BRIEF — Composant Pack

## 1. Nom du produit
**Composant Pack**

## 2. Résumé
Pack de composants UI réutilisables. Solution métier dans le domaine **Bibliothèque de Composants UI**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les design systems internes manquent souvent de documentation vivante, de variations d'états, de playground interactif, et d'un système de tokens synchronisé entre design (Figma) et code.

## 4. Personas
- Designer : consulte les tokens, voit les variations, copie les specs Figma.
- Développeur : copie le code d'un composant, voit les props et variants.
- Product owner : valide la cohérence visuelle, suit la couverture des composants.

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
Minimaliste, neutre, mettant les composants en valeur. Sans-serif (Inter), fond blanc (#FFFFFF) et gris très clair (#FAFAFA) pour les zones de preview. Accents neutres (zinc #71717A) pour ne pas parasiter les composants montrés. Sidebar gauche par catégorie, contenu central preview, props droite.
- Palette dominante : `#71717A` (primaire), `#6366F1` (accent), fond `#FFFFFF`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Component` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
