# PROJECT BRIEF — Checkout Express

## 1. Nom du produit
**Checkout Express**

## 2. Résumé
Tunnel de checkout optimisé conversion. Solution métier dans le domaine **E-commerce & Boutique en Ligne**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les boutiques en ligne actuelles souffrent de tunnels d'achat longs, d'une recherche produit peu pertinente, d'un manque de filtres adaptés (taille, couleur, prix) et d'une gestion d'inventaire désynchronisée entre le panier et le stock réel.

## 4. Personas
- Acheteur : recherche par filtres, comparaison rapide, panier persistant, checkout en 3 étapes.
- Marchand : gestion du catalogue, prix promotionnels, suivi du stock, tableaux de bord ventes.
- Logistique : visualisation des commandes par statut, étiquettes d'expédition, retours.

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
Boutique premium, nette et persuasive. Sans-serif (Inter), espacement aéré, blanc dominant (#FFFFFF), accents emerald (#10B981) pour les CTAs. Cartes produit avec hover zoom sur l'image, badges promo rouges. Tunnel de checkout minimaliste, sans distraction.
- Palette dominante : `#10B981` (primaire), `#F59E0B` (accent), fond `#FFFFFF`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Product` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
