# PROJECT BRIEF — Markdown Studio

## 1. Nom du produit
**Markdown Studio**

## 2. Résumé
Atelier markdown avec preview live et export. Solution métier dans le domaine **Documentation & PDF**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les plateformes de docs imposent des structures rigides, n'offrent pas de recherche full-text performante, et rendent l'export PDF ou la versioning des pages complexes.

## 4. Personas
- Rédacteur technique : édite en markdown, versionne, publie sans déployer.
- Développeur lecteur : recherche un symbole, copie un exemple de code, voit la version.
- Visiteur : navigue par catégorie, imprime en PDF, s'abonne aux mises à jour.

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
Épuré, lisible, technique. Sans-serif (Inter), serif optionnel pour le corps (Lora) en mode lecture. Fond blanc (#FFFFFF), accents ardoise (#475569). Sidebar gauche fixe, sommaire droite, contenu central max-w-3xl. Code blocks en fond #1E293B avec syntaxe colorée. Mode sombre par défaut.
- Palette dominante : `#475569` (primaire), `#0EA5E9` (accent), fond `#FFFFFF`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Document` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
