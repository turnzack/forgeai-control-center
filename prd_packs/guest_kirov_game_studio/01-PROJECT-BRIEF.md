# PROJECT BRIEF — Kirov Game Studio

## 1. Nom du produit
**Kirov Game Studio**

## 2. Résumé
Studio de création de jeux web. Solution métier dans le domaine **Jeu Vidéo & Arcade**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les jeux web actuels manquent de boucle de gameplay satisfaisante, de système de score persistant, de leaderboard compétitif et de paramétrage (difficulté, sons, contrôles) accessible aux joueurs occasionnels comme hardcore.

## 4. Personas
- Joueur occasionnel : partie rapide, score sauvegardé, leaderboard hebdomadaire.
- Joueur hardcore : modes de difficulté, contrôle fin, achievements, records personnels.
- Spectateur : regarde le leaderboard, voit les replays des meilleurs scores.

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
Néon, arcade rétro-futuriste. Police pixel/mono (Press Start 2P pour les scores, Inter pour les menus). Fond noir (#0A0A0F), accents néon rouge (#EF4444) et cyan (#06FFFF). Glows CSS, scanlines optionnelles, animations de combo éclatantes. Boutons avec effet pressé rétro.
- Palette dominante : `#EF4444` (primaire), `#06FFFF` (accent), fond `#0A0A0F`.
- Police principale : `Press Start 2P`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `GameSession` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
