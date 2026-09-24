# PROJECT BRIEF — Local Maps Pack

## 1. Nom du produit
**Local Maps Pack**

## 2. Résumé
Carte locale interactive avec POIs. Solution métier dans le domaine **Cartographie & Géolocalisation**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les applications carto manquent de layers personnalisables, de recherche par catégorie contextuelle (restaurants, parkings), et de calcul d'itinéraire multimodal (voiture, vélo, pied).

## 4. Personas
- Explorateur : cherche des lieux par catégorie, ajoute en favoris, partage.
- Voyageur : calcule un itinéraire A→B, compare les modes de transport.
- Local : ajoute ses lieux préférés, note les places, contribue à la carte.

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
Épuré, fonctionnel, vert nature. Sans-serif (Inter), carte en plein écran, sidebars blanches flottantes avec ombres. Accents vert (#16A34A) pour les marqueurs et itinéraires. Mode satellite avec overlay labels. Bottom drawer mobile pour les détails du lieu.
- Palette dominante : `#16A34A` (primaire), `#0EA5E9` (accent), fond `#F0FDF4`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Place` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
