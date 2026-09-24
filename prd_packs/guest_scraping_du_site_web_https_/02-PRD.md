# PRD — Site Scraper (Product Requirements Document)

## 1. Objectif Produit
Fournir une brique logicielle Grade Gold dans le domaine **Web Scraping & Extraction de Données** (archétype `SCRAPER`), utilisable immédiatement en production. Le produit adresse le problème suivant : Les outils de scraping manquent souvent de planification cron, ne gèrent pas la rotation de proxies, et n'offrent pas d'export structuré (CSV, JSON, API webhook) des données collectées.

## 2. Fonctionnalités Spécifiées

### F01 — Création de jobs de scraping avec selectors CSS/XPath et pagination
- **Objectif** : Création de jobs de scraping avec selectors CSS/XPath et pagination.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `JobList`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F02 — Planification cron (toutes les X minutes/heures/jours) avec timezone
- **Objectif** : Planification cron (toutes les X minutes/heures/jours) avec timezone.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `JobList`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F03 — Rotation de proxies et user-agents pour éviter le blocage
- **Objectif** : Rotation de proxies et user-agents pour éviter le blocage.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `JobList`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F04 — Aperçu live des données extraites pendant l'exécution du job
- **Objectif** : Aperçu live des données extraites pendant l'exécution du job.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `JobList`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F05 — Export des résultats en CSV, JSON, ou webhook POST
- **Objectif** : Export des résultats en CSV, JSON, ou webhook POST.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `JobList`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F06 — Gestion des retries et backoff sur échec HTTP 429/503
- **Objectif** : Gestion des retries et backoff sur échec HTTP 429/503.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `JobList`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F07 — Logs d'exécution avec stats (pages crawlées, durée, taux de succès)
- **Objectif** : Logs d'exécution avec stats (pages crawlées, durée, taux de succès).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `JobList`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F08 — Diff entre deux exécutions pour détecter les changements
- **Objectif** : Diff entre deux exécutions pour détecter les changements.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `JobList`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F09 — Configuration par URL cible et schéma de données
- **Objectif** : Configuration par URL cible et schéma de données.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `JobList`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F10 — Surveillance de changements (diff) avec alertes email
- **Objectif** : Surveillance de changements (diff) avec alertes email.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `JobList`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

## 3. Pages de l'application
- `/`
- `/jobs`
- `/jobs/:id`
- `/jobs/:id/edit`
- `/jobs/:id/executions`
- `/executions/:id`
- `/settings`

## 4. Endpoints API
- `GET /api/jobs`
- `POST /api/jobs`
- `POST /api/jobs/:id/run`
- `GET /api/jobs/:id/executions`
- `GET /api/executions/:id/results?format=`
- `GET /api/jobs/:id/diff?from=&to=`

## 5. Store global (state shape)
```typescript
jobs[], currentJob, executions[], currentExecution, results[], logs[], filters{status, schedule}
```

## 6. Interfaces TypeScript principales
```typescript
ScrapeJob {id, name, targetUrl, selectors{}, pagination, schedule, proxyRotation, webhookUrl, createdAt}, Execution {id, jobId, startedAt, finishedAt, status, pagesCrawled, itemsExtracted, errors[]}, ScrapeResult {executionId, data{}, extractedAt, url}
```

## 7. Contraintes Non Fonctionnelles
- **Accessibilité** : conformité WCAG AA (navigation clavier complète, contrastes validés, ARIA approprié).
- **Sécurité** : headers CSP stricts, protection CSRF, requêtes préparées D1 contre les injections SQL, sanitisation XSS des entrées utilisateur.
- **Performance** : bundle JS < 200 KB gzip, lazy-loading des routes, cache HTTP stale-while-revalidate.
- **Observabilité** : logs structurés JSON, métriques temps-réel, Sentry pour les erreurs front.
- **Internationalisation** : interface en français par défaut, structure i18n prête (fr, en).
