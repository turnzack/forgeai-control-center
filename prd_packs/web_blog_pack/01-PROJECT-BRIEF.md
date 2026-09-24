# PROJECT BRIEF — Web Blog Engine

## 1. Nom du produit
**Web Blog Engine**

## 2. Résumé
CMS de blog minimaliste pour développeurs. Solution métier dans le domaine **Blog & Contenu Éditorial**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les plateformes de blog existantes imposent des éditeurs rigides, manquent d'outils SEO modernes (Open Graph, Twitter Cards, schema.org), n'offrent pas de recommandation de contenu contextuelle et ralentissent la lecture mobile avec des polices inadaptées.

## 4. Personas
- Rédacteur SEO : éditeur markdown enrichi, preview temps réel, gestion des métadonnées Open Graph.
- Lecteur régulier : articles pertinents, temps de lecture estimé, navigation par thème fluide.
- Éditeur en chef : file de modération, planning éditorial, métriques d'engagement par article.

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
Lecture chaleureuse et confortable. Titres serif (Lora/Georgia), interligne généreux (1.75), largeur max-w-2xl pour le corps de l'article. Fond clair #FDFBF7 (ivoire), accents ambre #D97706. Cartes éditoriales avec ombres subtiles et hover lift, typographie soignée, drop cap optionnelle.
- Palette dominante : `#D97706` (primaire), `#059669` (accent), fond `#FDFBF7`.
- Police principale : `Lora`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Article` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
