# PROJECT BRIEF — Universal Scraper

## 1. Nom du produit
**Universal Scraper**

## 2. Résumé
Scraper universel configurable par selectors. Solution métier dans le domaine **Web Scraping & Extraction de Données**, conçue pour délivrer une expérience authentique et spécialisée — pas un template générique — avec une architecture moderne (React 18+, TypeScript strict, Tailwind), une persistance D1/SQLite et une UI soignée.

## 3. Problème utilisateur
Les outils de scraping manquent souvent de planification cron, ne gèrent pas la rotation de proxies, et n'offrent pas d'export structuré (CSV, JSON, API webhook) des données collectées.

## 4. Personas
- Data analyst : configure une extraction, planifie, exporte en CSV.
- Développeur : définit un scraper en CSS/XPath selectors, teste, déploie.
- Ops : surveille les jobs échoués, la consommation de proxies, les coûts.

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
Technique, terminal-inspired, data-dense. Sans-serif (Inter) avec mono (JetBrains Mono) pour les selectors et logs. Fond sombre (#0F1419), accents vert lime (#84CC16) évoquant le terminal. Tableaux denses, logs en mono. Statuts colorés (vert succès, rouge échec, jaune en cours).
- Palette dominante : `#84CC16` (primaire), `#06B6D4` (accent), fond `#0F1419`.
- Police principale : `Inter`.

## 8. Périmètre MVP
- Implémentation des fonctionnalités F01 → F010 détaillées dans le PRD.
- Entité principale manipulée : `ScrapeJob` (CRUD complet si pertinent).
- Pages listées dans la section Pages de ce pack.
- Endpoints API documentés et consommés par le frontend.

## 9. Critères de succès
- Score Lighthouse > 95 (Performance, Accessibilité, Best Practices, SEO).
- TTI < 2s sur mobile 4G simulé.
- 100% de réussite au build `vite build` et au `tsc --noEmit`.
- Couverture de tests E2E Playwright sur les parcours critiques.
