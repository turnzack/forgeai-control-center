# PRD — PDF & Docs Pack (Product Requirements Document)

## 1. Objectif Produit
Fournir une brique logicielle Grade Gold dans le domaine **Documentation & PDF** (archétype `DOCS`), utilisable immédiatement en production. Le produit adresse le problème suivant : Les plateformes de docs imposent des structures rigides, n'offrent pas de recherche full-text performante, et rendent l'export PDF ou la versioning des pages complexes.

## 2. Fonctionnalités Spécifiées

### F01 — Arborescence de pages markdown avec sections pliables
- **Objectif** : Arborescence de pages markdown avec sections pliables.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `DocsSidebar`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F02 — Recherche full-text avec surlignage et fuzzy matching
- **Objectif** : Recherche full-text avec surlignage et fuzzy matching.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `DocsSidebar`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F03 — Coloration syntaxique des blocs de code avec copie en un clic
- **Objectif** : Coloration syntaxique des blocs de code avec copie en un clic.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `DocsSidebar`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F04 — Génération PDF à la volée d'une page ou d'une section complète
- **Objectif** : Génération PDF à la volée d'une page ou d'une section complète.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `DocsSidebar`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F05 — Versioning des pages (historique, diff, restauration)
- **Objectif** : Versioning des pages (historique, diff, restauration).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `DocsSidebar`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F06 — Table des matières auto-générée depuis les headings (H2, H3)
- **Objectif** : Table des matières auto-générée depuis les headings (H2, H3).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `DocsSidebar`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F07 — Boutons d'édition (GitHub) et de signalement d'issue
- **Objectif** : Boutons d'édition (GitHub) et de signalement d'issue.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `DocsSidebar`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F08 — Sélecteur de version de la documentation (v1, v2, latest)
- **Objectif** : Sélecteur de version de la documentation (v1, v2, latest).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `DocsSidebar`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F09 — Templates PDF (facture, devis, rapport) avec variables dynamiques
- **Objectif** : Templates PDF (facture, devis, rapport) avec variables dynamiques.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `DocsSidebar`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F10 — Numérotation automatique, en-têtes/pieds de page et table des matières
- **Objectif** : Numérotation automatique, en-têtes/pieds de page et table des matières.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `DocsSidebar`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

## 3. Pages de l'application
- `/`
- `/docs`
- `/docs/:section/:page`
- `/search`
- `/versions`
- `/docs/:page.pdf`

## 4. Endpoints API
- `GET /api/docs/tree`
- `GET /api/docs/:path`
- `GET /api/search?q=`
- `GET /api/docs/:path/pdf`
- `GET /api/docs/:path/versions`

## 5. Store global (state shape)
```typescript
tree[], currentPage, searchResults[], currentVersion, availableVersions[]
```

## 6. Interfaces TypeScript principales
```typescript
DocPage {id, path, title, content, version, updatedAt, toc[]}, TreeNode {id, title, path, children[], collapsible}, SearchResult {path, title, snippet, score, highlights[]}, DocVersion {id, label, latest, releaseDate}
```

## 7. Contraintes Non Fonctionnelles
- **Accessibilité** : conformité WCAG AA (navigation clavier complète, contrastes validés, ARIA approprié).
- **Sécurité** : headers CSP stricts, protection CSRF, requêtes préparées D1 contre les injections SQL, sanitisation XSS des entrées utilisateur.
- **Performance** : bundle JS < 200 KB gzip, lazy-loading des routes, cache HTTP stale-while-revalidate.
- **Observabilité** : logs structurés JSON, métriques temps-réel, Sentry pour les erreurs front.
- **Internationalisation** : interface en français par défaut, structure i18n prête (fr, en).
