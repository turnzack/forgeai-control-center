# PROJECT BRIEF — CRM/ERP Pack

## 1. Nom du produit
**CRM/ERP Pack**

## 2. Résumé
Suite CRM + ERP pour PME. Solution métier dans le domaine **CRM & ERP Commercial**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les CRM existants sont surchargés, obligent à saisir les contacts manuellement, manquent de pipeline visuel, et ne proposent pas d'activités automatiques (rappels, emails séquentiels).

## 4. Personas
- Commercial : suit son pipeline, enregistre les appels, planifie les relances.
- Manager : voit le forecast d'équipe, les deals bloqués, le taux de conversion.
- Admin : configure les étapes du pipeline, les champs personnalisés, les automations.

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
Professionnel, dense, orienté métier. Sans-serif (Inter), fond gris clair (#F8FAFC), accents indigo (#4F46E5). Pipeline en Kanban avec border-l coloré par étape. Cards sobres, hover lift. Sidebar navigation par module (Contacts, Deals, Activités, Rapports). Tableaux avec groupement.
- Palette dominante : `#4F46E5` (primaire), `#0EA5E9` (accent), fond `#F8FAFC`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `Deal` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
