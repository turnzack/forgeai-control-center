# PROJECT BRIEF — Feed Social Pack

## 1. Nom du produit
**Feed Social Pack**

## 2. Résumé
Pack de feed social personnalisé. Solution métier dans le domaine **Réseau Social & Feed**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les réseaux sociaux génériques manquent d'algorithme de feed personnalisé, de notifications temps réel, et rendent difficile la découverte de nouveaux créateurs à suivre.

## 4. Personas
- Créateur de contenu : publie textes/photos, suit l'engagement, répond aux commentaires.
- Consommateur : scroll son feed personnalisé, like/commente, suit des créateurs.
- Modérateur : signale et supprime les contenus inappropriés, bannit les spammeurs.

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
Moderne, social, vivant. Sans-serif (Inter), fond blanc avec sidebar gauche et droite (#FAFAFA). Posts en cartes blanches avec ombres subtiles, accents violet (#8B5CF6). Animations de like (cœur qui pulse), transitions fluides. Avatars ronds avec border gradient pour les comptes vérifiés.
- Palette dominante : `#8B5CF6` (primaire), `#EC4899` (accent), fond `#FAFAFA`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Post` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
