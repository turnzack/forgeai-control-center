# PROJECT BRIEF — ChatCom

## 1. Nom du produit
**ChatCom**

## 2. Résumé
Messenger temps réel avec appels audio. Solution métier dans le domaine **Chat & Messagerie Temps Réel**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les clients de messagerie actuels manquent de feedback temps réel (typing indicator, read receipts), gèrent mal les conversations groupées et n'offrent pas de recherche dans l'historique des messages.

## 4. Personas
- Utilisateur quotidien : envoie messages, fichiers, voit qui est en ligne, répond rapide.
- Membre d'un groupe : notifié uniquement quand mentionné, peut épingler des messages.
- Admin : modère les membres, gère les permissions, exporte l'historique.

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
Épuré, conversationnel, mobile-first. Sans-serif (Inter), bulles arrondies, fond blanc (#FFFFFF), messages envoyés en bleu (#3B82F6) à droite, reçus en gris clair (#F1F5F9) à gauche. Sidebar conversations à gauche, zone chat centrale, header avec avatar et statut. Animations douces.
- Palette dominante : `#3B82F6` (primaire), `#10B981` (accent), fond `#FFFFFF`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Message` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
