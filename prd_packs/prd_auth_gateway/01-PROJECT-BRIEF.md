# PROJECT BRIEF — Auth Gateway

## 1. Nom du produit
**Auth Gateway**

## 2. Résumé
Passerelle d'authentification SSO. Solution métier dans le domaine **Authentification & Sécurité**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les systèmes d'authentification maison sont souvent vulnérables : mots de passe faibles, absence de 2FA, sessions non révocables, et pas de détection des connexions suspectes.

## 4. Personas
- Utilisateur final : inscription en 30s, 2FA optionnel, gestion des sessions actives.
- Admin sécurité : révocation de sessions, audit des connexions, politique de mot de passe.
- Développeur intégrant l'API : clés API, OAuth2, webhooks d'événements de sécurité.

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
Sérieux, rassurant, sécurisé. Sans-serif (Inter), fond blanc cassé (#F8FAFC), accents vert (#059669) symbolisant la sécurité. Cards avec border-l vert, icônes bouclier. Code TOTP en mono. Aucune fuite visuelle de données sensibles.
- Palette dominante : `#059669` (primaire), `#0EA5E9` (accent), fond `#F8FAFC`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Session` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
