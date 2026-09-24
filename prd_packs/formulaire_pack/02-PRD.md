# PRD — Formulaire Pack (Product Requirements Document)

## 1. Objectif Produit
Fournir une brique logicielle Grade Gold dans le domaine **Formulaires & Sondages** (archétype `FORMS`), utilisable immédiatement en production. Le produit adresse le problème suivant : Les constructeurs de formulaires existants offrent des champs génériques sans logique conditionnelle, des validations limitées, et aucune analyse des soumissions (taux de complétion, drop-off).

## 2. Fonctionnalités Spécifiées

### F01 — Builder drag-and-drop de formulaires avec aperçu temps réel
- **Objectif** : Builder drag-and-drop de formulaires avec aperçu temps réel.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `FormBuilderCanvas`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F02 — Types de champs
- **Objectif** : texte, email, nombre, date, select, radio, checkbox, fichier, rating.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `FormBuilderCanvas`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F03 — Logique conditionnelle (afficher/masquer un champ selon la valeur d'un autre)
- **Objectif** : Logique conditionnelle (afficher/masquer un champ selon la valeur d'un autre).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `FormBuilderCanvas`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F04 — Validation par champ (required, regex, min/max, message personnalisé)
- **Objectif** : Validation par champ (required, regex, min/max, message personnalisé).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `FormBuilderCanvas`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F05 — Pages multi-étapes avec barre de progression
- **Objectif** : Pages multi-étapes avec barre de progression.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `FormBuilderCanvas`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F06 — Collecte des soumissions avec horodatage, IP et user-agent
- **Objectif** : Collecte des soumissions avec horodatage, IP et user-agent.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `FormBuilderCanvas`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F07 — Analytics
- **Objectif** : taux de complétion, drop-off par champ, temps moyen.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `FormBuilderCanvas`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F08 — Export CSV/JSON des soumissions et intégration webhook
- **Objectif** : Export CSV/JSON des soumissions et intégration webhook.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `FormBuilderCanvas`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F09 — Multi-étapes avec sauvegarde automatique (draft)
- **Objectif** : Multi-étapes avec sauvegarde automatique (draft).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `FormBuilderCanvas`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F10 — Champs conditionnels et calculs entre champs
- **Objectif** : Champs conditionnels et calculs entre champs.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `FormBuilderCanvas`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

## 3. Pages de l'application
- `/`
- `/forms`
- `/forms/:id/edit`
- `/forms/:id/preview`
- `/forms/:id/submissions`
- `/forms/:id/analytics`
- `/templates`

## 4. Endpoints API
- `GET /api/forms`
- `POST /api/forms`
- `GET /api/forms/:id`
- `POST /api/forms/:id/submissions`
- `GET /api/forms/:id/submissions?export=`
- `GET /api/forms/:id/analytics`

## 5. Store global (state shape)
```typescript
forms[], currentForm, submissions[], analytics{completionRate, dropOffByField, avgDuration}, builderState{draggedField, selectedField}
```

## 6. Interfaces TypeScript principales
```typescript
FormField {id, type, label, placeholder, required, validations[], conditional{field, operator, value}}, Form {id, title, description, fields[], steps[], webhookUrl, createdAt}, Submission {id, formId, data{}, submittedAt, ip, userAgent, durationMs}
```

## 7. Contraintes Non Fonctionnelles
- **Accessibilité** : conformité WCAG AA (navigation clavier complète, contrastes validés, ARIA approprié).
- **Sécurité** : headers CSP stricts, protection CSRF, requêtes préparées D1 contre les injections SQL, sanitisation XSS des entrées utilisateur.
- **Performance** : bundle JS < 200 KB gzip, lazy-loading des routes, cache HTTP stale-while-revalidate.
- **Observabilité** : logs structurés JSON, métriques temps-réel, Sentry pour les erreurs front.
- **Internationalisation** : interface en français par défaut, structure i18n prête (fr, en).
