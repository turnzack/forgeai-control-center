# PROJECT BRIEF — IA Studio

## 1. Nom du produit
**IA Studio**

## 2. Résumé
Studio d'intégration de modèles IA. Solution métier dans le domaine **Assistant IA & Chatbot**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les chatbots IA actuels manquent de contexte conversationnel persistant, ne gèrent pas le streaming des réponses, et n'offrent pas de réglage fin (température, modèle, system prompt) pour les utilisateurs avancés.

## 4. Personas
- Utilisateur métier : pose des questions en langage naturel, obtient des réponses citées.
- Power user : ajuste le modèle, la température, le system prompt, exporte l'historique.
- Admin : surveille l'usage, les coûts par token, le contenu modéré.

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
Moderne, futuriste, premium. Sans-serif (Inter), fond sombre (#0F0F1A) ou clair (#FAFAFA) selon préférence, accents fuchsia (#D946EF). Messages IA en cards avec border gradient. Animations de streaming douces. Mode focus possible (cacher la sidebar). Code blocks avec syntax highlighting.
- Palette dominante : `#D946EF` (primaire), `#8B5CF6` (accent), fond `#0F0F1A`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Conversation` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
