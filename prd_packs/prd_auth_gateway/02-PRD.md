# PRD — Auth Gateway (Product Requirements Document)

## 1. Objectif Produit
Fournir une brique logicielle Grade Gold dans le domaine **Authentification & Sécurité** (archétype `AUTH`), utilisable immédiatement en production. Le produit adresse le problème suivant : Les systèmes d'authentification maison sont souvent vulnérables : mots de passe faibles, absence de 2FA, sessions non révocables, et pas de détection des connexions suspectes.

## 2. Fonctionnalités Spécifiées

### F01 — Inscription et connexion avec email/mot de passe (hash bcrypt + pepper)
- **Objectif** : Inscription et connexion avec email/mot de passe (hash bcrypt + pepper).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `AuthForm`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F02 — Authentification 2FA via TOTP (Google Authenticator, Authy)
- **Objectif** : Authentification 2FA via TOTP (Google Authenticator, Authy).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `AuthForm`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F03 — Réinitialisation de mot de passe par email avec token à usage unique
- **Objectif** : Réinitialisation de mot de passe par email avec token à usage unique.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `AuthForm`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F04 — Gestion des sessions actives avec révocation à distance
- **Objectif** : Gestion des sessions actives avec révocation à distance.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `AuthForm`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F05 — Détection des connexions suspectes (nouvel appareil, pays inhabituel)
- **Objectif** : Détection des connexions suspectes (nouvel appareil, pays inhabituel).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `AuthForm`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F06 — Gestion des clés API avec scopes et rate limiting
- **Objectif** : Gestion des clés API avec scopes et rate limiting.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `AuthForm`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F07 — OAuth2
- **Objectif** : Google, GitHub, Apple comme providers.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `AuthForm`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F08 — Audit log
- **Objectif** : toutes les actions sensibles horodatées et IP-trackées.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `AuthForm`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F09 — SSO SAML/OIDC pour intégration enterprise (Okta, Azure AD)
- **Objectif** : SSO SAML/OIDC pour intégration enterprise (Okta, Azure AD).
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `AuthForm`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

### F10 — Politique de mot de passe configurable par tenant
- **Objectif** : Politique de mot de passe configurable par tenant.
- **Préconditions** : session utilisateur active (sauf endpoints publics) ; données préchargées ou fetch à la demande.
- **Scénario nominal** : l'utilisateur interagit via `AuthForm`, l'API répond en < 200ms, l'UI se met à jour optimistement.
- **Scénarios d'erreur** : toast d'erreur + retry automatique sur 500/503 ; état vide explicite si aucune donnée ; validation Zod côté client avant envoi.
- **Critères d'acceptation** :
  - Skeleton affiché pendant le chargement (< 200ms).
  - Feedback visuel immédiat (hover, focus, transition).
  - Conformité WCAG AA (contrastes, navigation clavier, ARIA).
  - Persistance D1 vérifiée par test d'intégration.

## 3. Pages de l'application
- `/login`
- `/register`
- `/2fa`
- `/forgot-password`
- `/reset-password`
- `/sessions`
- `/api-keys`
- `/audit-log`

## 4. Endpoints API
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/2fa/verify`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/sessions`
- `DELETE /api/sessions/:id`
- `GET /api/audit-log`

## 5. Store global (state shape)
```typescript
user, sessions[], apiKeys[], auditLog[], twoFactorEnabled, currentSession
```

## 6. Interfaces TypeScript principales
```typescript
User {id, email, name, twoFactorEnabled, createdAt, lastLoginAt}, Session {id, device, browser, ip, location, lastActivityAt, current}, ApiKey {id, label, keyMasked, scopes[], createdAt, lastUsedAt}, AuditEntry {id, action, ip, userAgent, status, createdAt}
```

## 7. Contraintes Non Fonctionnelles
- **Accessibilité** : conformité WCAG AA (navigation clavier complète, contrastes validés, ARIA approprié).
- **Sécurité** : headers CSP stricts, protection CSRF, requêtes préparées D1 contre les injections SQL, sanitisation XSS des entrées utilisateur.
- **Performance** : bundle JS < 200 KB gzip, lazy-loading des routes, cache HTTP stale-while-revalidate.
- **Observabilité** : logs structurés JSON, métriques temps-réel, Sentry pour les erreurs front.
- **Internationalisation** : interface en français par défaut, structure i18n prête (fr, en).
